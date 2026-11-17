import ExcelJS from 'exceljs';
import { Readable } from 'node:stream';
import { ApiError } from '../utils/ApiError.js';

const cellText = (value) => {
  if (value && typeof value === 'object') return value.text ?? value.result ?? '';
  return value ?? '';
};

/** Reads the first sheet of an uploaded .xlsx or .csv file into row objects keyed by header. */
export async function parseSpreadsheet(file) {
  const workbook = new ExcelJS.Workbook();
  const isCsv = /\.csv$/i.test(file.originalname);

  try {
    if (isCsv) await workbook.csv.read(Readable.from(file.buffer));
    else await workbook.xlsx.load(file.buffer);
  } catch {
    throw new ApiError(400, 'Could not read the file. Upload a valid .xlsx or .csv file');
  }

  const sheet = workbook.worksheets[0];
  if (!sheet) throw new ApiError(400, 'The file has no data');

  const headers = sheet.getRow(1).values.slice(1).map((header) => String(cellText(header)).trim());
  const rows = [];
  sheet.eachRow((row, index) => {
    if (index === 1) return;
    const values = row.values.slice(1);
    const record = Object.fromEntries(headers.map((header, i) => [header, cellText(values[i])]));
    if (Object.values(record).some((value) => value !== '')) rows.push(record);
  });
  return rows;
}

/** Builds an .xlsx file. `sheets` is [{ name, columns: [{ header, key }], rows: [] }]. */
export async function buildWorkbook(sheets) {
  const workbook = new ExcelJS.Workbook();
  sheets.forEach(({ name, columns, rows }) => {
    const sheet = workbook.addWorksheet(name);
    sheet.columns = columns.map(({ header, key }) => ({ header, key, width: Math.max(header.length + 4, 16) }));
    sheet.getRow(1).font = { bold: true };
    rows.forEach((row) => sheet.addRow(row));
  });
  return workbook.xlsx.writeBuffer();
}

export function sendWorkbook(res, filename, buffer) {
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}.xlsx"`);
  res.send(Buffer.from(buffer));
}

import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const MODULES = {
  toolbar: [
    [{ header: [2, 3, false] }],
    ['bold', 'italic', 'underline'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link', 'blockquote', 'image'],
    ['clean'],
  ],
};

export default function RichTextEditor({ value, onChange }) {
  return <ReactQuill theme="snow" modules={MODULES} value={value || ''} onChange={onChange} />;
}

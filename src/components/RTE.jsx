import React from 'react'
import { Editor } from '@tinymce/tinymce-react'
import conf from '../conf/conf'

function RTE({ label, name, value, onChange }) {
    return (
        <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">
                {label}
            </label>
            <Editor
                apiKey={conf.tinymceApiKey || import.meta.env.VITE_TINYMCE_API_KEY}
                value={value}
                onEditorChange={(content) => {
                    onChange({
                        target: {
                            name,
                            value: content
                        }
                    })
                }}
                init={{
                    height: 500,
                    menubar: true,
                    plugins: [
                        'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                        'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                        'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                    ],
                    toolbar: 'undo redo | blocks | ' +
                        'bold italic backcolor | alignleft aligncenter ' +
                        'alignright alignjustify | bullist numlist outdent indent | ' +
                        'removeformat | help',
                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                }}
            />
        </div>
    )
}

export default RTE
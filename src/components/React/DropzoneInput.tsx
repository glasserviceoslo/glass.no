/** @jsxImportSource react */

import { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';

export const DropzoneInput = ({ onChange }: { onChange: (files: File[]) => void }) => {
  const [files, setFiles] = useState<Array<File & { preview: string }>>([]);

  const onDrop = (acceptedFiles: File[]) => {
    setFiles(
      acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        }),
      ),
    );
  };

  const { getRootProps, getInputProps } = useDropzone({
    // accept: {
    //   'image/*': [],
    // },
    onDrop,
  });

  const thumbs = files.map((file) => (
    <li key={file.name} className="border-4 border-green-400">
      <img
        src={file.preview}
        alt={file.name}
        style={{ height: '50px' }}
        // Revoke data uri after image is loaded
        onLoad={() => {
          URL.revokeObjectURL(file.preview);
        }}
      />
    </li>
  ));

  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
    return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
  }, []);

  return (
    <section className="flex flex-col">
      <article className="flex w-full items-center justify-center" {...getRootProps()}>
        <label
          htmlFor="dropzone-file"
          className="dark:hover:bg-bray-800 flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg
              aria-hidden="true"
              className="mb-3 h-10 w-10 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              ></path>
            </svg>
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
          </div>
          <input id="dropzone-file" type="file" className="hidden" {...getInputProps()} />
        </label>
      </article>
      {files.length > 0 && (
        <article className="py-2">
          <h3>Filer</h3>
          <ul className="flex gap-1">{thumbs}</ul>
        </article>
      )}
    </section>
  );
};

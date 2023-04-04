import { Controller, useFormContext, type FieldValues, type Control } from 'react-hook-form';
import { useDropzone } from 'react-dropzone';
import { generateRandomId, getBase64 } from '$lib/utils';
import { useEffect, useState } from 'react';
import { classNames } from '$lib/classNames';
import type { FileWithPreview } from '$types';

interface DropzoneFieldProps {
  name: string;
  control: Control<FieldValues>;
  multiple?: boolean;
}

export const DropzoneField = ({ name, control, multiple = true, ...rest }: DropzoneFieldProps) => (
  <Controller
    render={({ field: { onChange } }) => (
      <Dropzone
        name={name}
        multiple={multiple}
        onChange={({ target }) => {
          onChange(target.files);
        }}
        {...rest}
      />
    )}
    name={name}
    control={control}
    defaultValue={[]}
  />
);

interface DropzoneProps {
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  name: string;
  multiple?: boolean;
}

function Dropzone({ onChange, multiple, name }: DropzoneProps) {
  const [files, setFiles] = useState<FileWithPreview[]>([]);

  const {
    setValue,
    formState: { isSubmitSuccessful },
  } = useFormContext();

  const onDrop = async (acceptedFiles: File[]) => {
    let updatedFiles: FileWithPreview[];

    multiple
      ? (updatedFiles = [
          ...files,
          ...(await Promise.all(
            acceptedFiles.map(async (file) =>
              Object.assign(file, {
                id: generateRandomId(),
                preview: URL.createObjectURL(file),
                base64: await getBase64(file),
              }),
            ),
          )),
        ])
      : (updatedFiles = [
          Object.assign(acceptedFiles[0], {
            id: generateRandomId(),
            preview: URL.createObjectURL(acceptedFiles[0]),
            base64: await getBase64(acceptedFiles[0]),
          }),
        ]);

    setFiles(updatedFiles);
    setValue(name, updatedFiles);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': [] },
    multiple,
    onDrop,
  });

  const deleteFile = (e: React.MouseEvent, file: FileWithPreview) => {
    e.preventDefault();
    setFiles((prev) => prev.filter((f) => f.id !== file.id));
  };

  const thumbs = files.map((file) => (
    <li key={file.id} className="relative border-4 border-green-400">
      <button className="absolute -right-5 -top-5" onClick={(e) => deleteFile(e, file)}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="red"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="white"
          className="h-8 w-8"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </button>
      <div className="h-14 w-14">
        <img
          src={file.preview}
          alt={file.name}
          className="h-full w-full object-cover"
          // Revoke data uri after image is loaded
          onLoad={() => {
            URL.revokeObjectURL(file.preview);
          }}
        />
      </div>
    </li>
  ));

  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
    return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
  }, []);

  useEffect(() => {
    if (isSubmitSuccessful) {
      setFiles([]);
    }
  }, [isSubmitSuccessful]);

  return (
    <section className="flex flex-col">
      <article
        className="flex w-full items-center justify-center"
        {...getRootProps({ onClick: (e) => e.preventDefault() })}
      >
        <label
          htmlFor="dropzone-file"
          className={classNames(
            'dark:hover:bg-bray-800 flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600',
            isDragActive && 'animate-pulse bg-green-200',
          )}
        >
          <div className="flex flex-col items-center justify-center pb-6 pt-5">
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
          <input id="dropzone-file" type="file" className="hidden" {...getInputProps({ onChange })} name="file" />
        </label>
      </article>
      {files.length > 0 && (
        <article className="py-2">
          <h3 className="mb-4">
            Opplastede filer: <span className="text-green-700">{files.length}</span>
          </h3>
          <ul className="flex flex-wrap gap-2">{thumbs}</ul>
        </article>
      )}
    </section>
  );
}

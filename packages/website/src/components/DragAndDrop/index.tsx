import {DropEvent, FileRejection, useDropzone} from 'react-dropzone';

import {Upload} from '../../assets/icons';

export type DragAndDropProps = {
  onDrop: (acceptedFiles: File[], fileRejections: FileRejection[], event: DropEvent) => void;
};

export const DragAndDrop: React.FC<DragAndDropProps> = ({onDrop}) => {
  const {getRootProps, getInputProps} = useDropzone({onDrop});

  return (
    <label
      className="flex flex-col items-center justify-center gap-2 px-4 py-16 w-4/12 border-border border-2 border-dashed bg-surface rounded-lg cursor-pointer"
      {...getRootProps()}
    >
      <input type="file" className="hidden" {...getInputProps()} />

      <div className="flex flex-col items-center justify-center gap-4">
        <div className="flex flex-row items-center justify-center rounded-lg bg-primary text-on-primary">
          <div className="pl-3 pr-2 py-4 border-r-1 border-surface">
            <Upload className="w-6 h-6" />
          </div>

          <div className="pl-2 pr-3 py-4">
            <span className="font-semibold">Choose File</span>
          </div>
        </div>

        <div className="flex flex-col items-center text-sm">
          <span>Chosen files are not uploaded.</span>
          <span>Everything is handled at your browser.</span>
        </div>
      </div>
    </label>
  );
};

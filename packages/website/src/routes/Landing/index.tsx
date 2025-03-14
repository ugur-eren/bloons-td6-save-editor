import Editor from '@monaco-editor/react';
import {editor} from 'monaco-editor';
import {decrypt, DecryptedFile, encrypt} from 'encryption';
import {useRef, useState} from 'react';

import {DragAndDrop} from '../../components';
import {ChevronLeft, Copy, Download} from '../../assets/icons';

export const Landing: React.FC = () => {
  const editorRef = useRef<editor.IStandaloneCodeEditor>(null);

  const [save, setSave] = useState<
    | (DecryptedFile & {
        name: string;
        data: string;
      })
    | null
  >(null);

  const onEditorMount = (monacoEditor: editor.IStandaloneCodeEditor) => {
    editorRef.current = monacoEditor;
  };

  const onDrop = async (files: File[]) => {
    const file = files && 'length' in files && files[0];
    if (!file) return;

    try {
      const byteArray = await file.bytes();
      const decrypted = await decrypt(byteArray, '11');

      setSave({name: file.name, data: JSON.stringify(decrypted.content, null, 2), ...decrypted});
    } catch (error) {
      console.error(error);
      // eslint-disable-next-line no-alert
      alert('Failed to open the file');
    }
  };

  const onCancelClick = () => setSave(null);

  const onCopyClick = async () => {
    if (!editorRef.current) {
      // eslint-disable-next-line no-alert
      alert('Could not copy the JSON');
      return;
    }

    const value = editorRef.current.getValue();
    await navigator.clipboard.writeText(value);
  };

  const onSaveClick = async () => {
    if (!editorRef.current || !save) {
      // eslint-disable-next-line no-alert
      alert('Could not save the file');
      return;
    }

    const value = editorRef.current.getValue();
    const encrypted = await encrypt(
      {
        ...save,
        content: JSON.parse(value),
      },
      '11',
    );

    const blob = new Blob([encrypted], {type: 'application/octet-stream'});
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = save?.name || 'Profile.Save';
    a.click();
  };

  if (save) {
    return (
      <div className="flex flex-col flex-1">
        <header className="flex flex-row justify-between items-center px-4 py-2 bg-elevated">
          <div className="flex flex-1 flex-row items-center justify-start">
            <button
              onClick={onCancelClick}
              className="flex flex-row items-center justify-center cursor-pointer bg-error text-text-highlight rounded-md pl-2 pr-3 py-1.5"
            >
              <ChevronLeft className="w-6 h-6" />

              <span className="text-lg ml-2">Cancel</span>
            </button>
          </div>

          <span className="text-lg">{save.name}</span>

          <div className="flex flex-1 flex-row items-center justify-end gap-3">
            <button
              onClick={onCopyClick}
              className="flex flex-row items-center justify-center cursor-pointer bg-primary text-on-primary rounded-md pl-3 pr-3 py-1.5"
            >
              <Copy className="w-6 h-6" />

              <span className="text-lg ml-2">Copy JSON</span>
            </button>

            <button
              onClick={onSaveClick}
              className="flex flex-row items-center justify-center cursor-pointer bg-primary text-on-primary rounded-md pl-3 pr-3 py-1.5"
            >
              <Download className="w-6 h-6" />

              <span className="text-lg ml-2">Save File</span>
            </button>
          </div>
        </header>

        <Editor
          language="json"
          value={save.data}
          theme="vs-dark"
          wrapperProps={{style: {display: 'flex', flex: 1}}}
          onMount={onEditorMount}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2 px-2 py-8">
      <div className="flex flex-col mb-8 text-center gap-2">
        <h1 className="text-4xl font-bold">Bloons TD 6 Save Editor</h1>

        <span>
          Editing save files is not recommended, use at your own risk. You can lose access to online
          features PERMANENTLY.
        </span>

        <span>
          Save file location:{' '}
          <span className="font-semibold">
            Steam/userdata/&lt;numbers&gt;/960090/local/link/PRODUCTION/current/Profile.Save
          </span>
        </span>
      </div>

      <DragAndDrop onDrop={onDrop} />
    </div>
  );
};

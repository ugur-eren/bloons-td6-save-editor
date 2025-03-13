import {DragAndDrop} from '../../components';

export const Landing: React.FC = () => {
  const onDrop = async (files: File[]) => {
    const file = files && 'length' in files && files[0];
    if (!file) return;

    const byteArray = await file.bytes();
  };

  return (
    <div className="flex flex-col items-center gap-2 px-2 py-8">
      <div className="flex flex-col mb-8 text-center gap-2">
        <h1 className="text-4xl font-bold">Bloons TD 6 Save Editor</h1>

        <span>
          Editing save files is not recommended, use at your own risk. You can lose access to online
          features.
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

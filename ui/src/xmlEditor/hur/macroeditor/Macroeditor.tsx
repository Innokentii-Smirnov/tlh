import { JSX, useState } from 'react';
import { ChangesUploader } from '../changes/ChangesUploader';
import { ChangesViewer } from '../changes/ChangesViewer';

interface IProps {
  changes: Map<string, string>;
}

export function Macroeditor({ changes }: IProps): JSX.Element {

  const [loaded, setLoaded] = useState(changes.size > 0);
  
  return (
    <div className="grid grid-cols-2 gap-2 my-2">
      {!loaded ? <ChangesUploader onUpload={() => setLoaded(true)} /> :
      <ChangesViewer changes={changes} />}
    </div>
  );
}

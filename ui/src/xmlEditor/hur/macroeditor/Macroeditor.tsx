import { JSX, useState } from 'react';
import { ChangesViewerContainer } from '../changes/ChangesViewerContainer';
import { TextEditorContainer } from '../textEditor/TextEditorContainer';

interface IProps {
  initialChanges: Map<string, string>;
}

export function Macroeditor({ initialChanges }: IProps): JSX.Element {
  const [changes, setChanges] = useState(initialChanges);
  return (
    <div className="grid grid-cols-2 gap-2 my-2">
      <ChangesViewerContainer changes={changes} />
      <TextEditorContainer clearChanges={() => setChanges(new Map<string, string>())} />
    </div>
  );
}

import { JSX } from 'react';
import { ChangesViewerContainer } from '../changes/ChangesViewerContainer';
import { TextEditorContainer } from '../textEditor/TextEditorContainer';

interface IProps {
  changes: Map<string, string>;
}

export function Macroeditor({ changes }: IProps): JSX.Element {
  
  return (
    <div className="grid grid-cols-2 gap-2 my-2">
      <ChangesViewerContainer changes={changes} />
      <TextEditorContainer />
    </div>
  );
}

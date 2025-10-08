import { JSX } from 'react';
import { Replacement } from '../replacement/replacement';
import { ReplacementViewer } from '../replacement/ReplacementViewer';

interface IProps {
  replacements: Replacement[];
}

export function TextEditor({ replacements }: IProps): JSX.Element {
  
  return (
    <div className="display: table">
      {replacements.map((replacement: Replacement, index: number) => {
        return (
          <ReplacementViewer replacement={replacement} key={index} />
        );
      })}
    </div>
  );
}

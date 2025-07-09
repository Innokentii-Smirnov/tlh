import { JSX } from 'react';

interface IProps {
  segmentation: string;
  translation: string;
  morphTags: string[];
  transcriptions: string[];
}

export function WordformElement({segmentation, translation, morphTags, transcriptions}: IProps): JSX.Element {
  return (
    <>
      <pre>&#9;{segmentation}</pre>
      {(morphTags).map((tag: string, index: number) => {
          return (
            <pre key={index}>&#9;{translation + 
            ((tag.startsWith('=') || tag.startsWith('.') || tag === '') ? '' : '-') +
            tag}</pre>
          );
        })
      }
      <pre>&#9;({transcriptions.join(', ')})</pre>
      <br />
    </>
  );
}

import { JSX } from 'react';

interface IProps {
  segmentation: string;
  translation: string;
  morphTags: string[];
}

export function WordformElement({segmentation, translation, morphTags}: IProps): JSX.Element {
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
      <br />
    </>
  );
}

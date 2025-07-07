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
      <pre>&#9;{
        (morphTags).map((tag: string) =>
          translation +
          ((tag.startsWith('=') || tag.startsWith('.') || tag === '') ? '' : '-') +
          tag).join('<br />')
      }</pre>
      <br />
    </>
  );
}

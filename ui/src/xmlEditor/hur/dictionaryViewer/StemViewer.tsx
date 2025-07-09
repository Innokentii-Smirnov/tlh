import { JSX, useState } from 'react';
import { StemElement } from './Stem';
import { WordformElement } from './Wordform';

export class Stem {
  index: string;
  form: string;
  translation: string;
  pos: string;
  constructor(repr: string) {
    [this.index, this.form, this.translation, this.pos] = repr.split('@');
  }
}

export class Wordform {
  segmentation: string;
  morphTags: string[];
  transcriptions: string[];
  constructor(repr: string) {
    const spl = repr.split('@');
    this.segmentation = spl[0];
    this.morphTags = spl[1].split(';');
    this.transcriptions = spl[2].split(';');
  }
}

interface IProps {
  stem: Stem;
  wordforms: Wordform[];
}

export function StemViewer({stem, wordforms}: IProps): JSX.Element {
  
  const [unfolded, setUnfolded] = useState(false);
  
  return (
    <>
      {StemElement({...stem, handleClick: () => setUnfolded(!unfolded)})}
      <br />
      {unfolded && wordforms.map(
        (wordform: Wordform, index: number) =>
          <WordformElement segmentation={wordform.segmentation}
                           translation={stem.translation}
                           morphTags={wordform.morphTags}
                           transcriptions={wordform.transcriptions}
                           key={index}/>
      )}
    </>
  );
}

import { JSX, useState } from 'react';
import { StemElement } from './Stem';
import { WordformElement } from './Wordform';
import { getMorphTags } from '../utils';
import { MorphologicalAnalysis } from '../../../model/morphologicalAnalysis';
import { modifyAnalysis } from '../dict/analysisModifier';
import update from 'immutability-helper';

export class Stem {
  index: string;
  form: string;
  translation: string;
  pos: string;
  constructor(repr: string) {
    [this.index, this.form, this.translation, this.pos] = repr.split('@');
  }
}

export interface Entry {
  transcriptions: string[];
  analysis: string;
  morphologicalAnalysis: MorphologicalAnalysis;
}

interface IProps {
  stem: Stem;
  entries: Entry[];
}

function modifyTranslation(value: string) {
  const setTranslation = (morphologicalAnalysis: MorphologicalAnalysis) => {
    return update(morphologicalAnalysis, { translation: { $set: value } });
  };
  return setTranslation;
}

export function StemViewer({stem, entries}: IProps): JSX.Element {
  
  const [unfolded, setUnfolded] = useState(false);
  const [translation, setTranslation] = useState(stem.translation);
  
  return (
    <>
      <StemElement
        index={stem.index}
        form={stem.form} 
        translation={translation}
        pos={stem.pos}
        handleClick={() => setUnfolded(!unfolded)} 
        onTranslationChange={(translation: string) => {
          setTranslation(translation);
        }}
        onTranslationBlur={(translation: string) => {
          for (const {transcriptions, analysis} of entries) {
            modifyAnalysis(transcriptions, analysis, modifyTranslation(translation));
          }
        }} />
      <br />
      {unfolded && entries.map(
        (entry: Entry, index: number) =>
          <WordformElement segmentation={entry.morphologicalAnalysis.referenceWord}
                           translation={translation}
                           morphTags={getMorphTags(entry.morphologicalAnalysis) || []}
                           transcriptions={entry.transcriptions}
                           key={index}/>
      )}
    </>
  );
}

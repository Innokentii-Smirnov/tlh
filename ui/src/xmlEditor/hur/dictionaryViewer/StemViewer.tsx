import { JSX, useState } from 'react';
import { StemElement } from './Stem';
import { WordformElement } from './Wordform';
import { getMorphTags } from '../utils';
import { MorphologicalAnalysis, writeMorphAnalysisValue }
  from '../../../model/morphologicalAnalysis';
import { modifyAnalysis } from '../dict/analysisModifier';
import update from 'immutability-helper';
import { findBoundary } from '../splitter';

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
  morphologicalAnalysis: MorphologicalAnalysis;
}

interface IProps {
  stem: Stem;
  initialEntries: Entry[];
}

function replaceStem(newStem: string, segmentation: string) {
  return newStem + segmentation.substring(findBoundary(segmentation));
}

function modifyStem(newStem: string) {
  const setTranslation = (morphologicalAnalysis: MorphologicalAnalysis) => {
    const segmentation = morphologicalAnalysis.referenceWord;
    return update(morphologicalAnalysis,
      { referenceWord: { $set: replaceStem(newStem, segmentation)} });
  };
  return setTranslation;
}

function modifyTranslation(value: string) {
  const setTranslation = (morphologicalAnalysis: MorphologicalAnalysis) => {
    return update(morphologicalAnalysis, { translation: { $set: value } });
  };
  return setTranslation;
}

export function StemViewer({stem, initialEntries}: IProps): JSX.Element {
  
  const [unfolded, setUnfolded] = useState(false);
  const [stemForm, setStemForm] = useState(stem.form);
  const [translation, setTranslation] = useState(stem.translation);
  const [entries, setEntries] = useState(initialEntries);
  
  return (
    <>
      <StemElement
        index={stem.index}
        form={stemForm} 
        translation={translation}
        pos={stem.pos}
        handleClick={() => setUnfolded(!unfolded)}
        onFormChange={(newStem: string) => {
          setStemForm(newStem);
        }}
        onFormBlur={(newStem: string) => {
          const newEntries: Entry[] = [];
          for (const {transcriptions, morphologicalAnalysis} of entries) {
            const analysis = writeMorphAnalysisValue(morphologicalAnalysis);
            const newAnalysis = modifyAnalysis(transcriptions, analysis, modifyStem(newStem));
            if (newAnalysis !== undefined) {
              newEntries.push({transcriptions, morphologicalAnalysis: newAnalysis});
            }
          }
          setEntries(newEntries);
        }}        
        onTranslationChange={(translation: string) => {
          setTranslation(translation);
        }}
        onTranslationBlur={(translation: string) => {
          const newEntries: Entry[] = [];
          for (const {transcriptions, morphologicalAnalysis} of entries) {
            const analysis = writeMorphAnalysisValue(morphologicalAnalysis);
            const newAnalysis = modifyAnalysis(transcriptions, analysis, modifyTranslation(translation));
            if (newAnalysis !== undefined) {
              newEntries.push({transcriptions, morphologicalAnalysis: newAnalysis});
            }
          }
          setEntries(newEntries);
        }} />
      <br />
      {unfolded && entries.map(
        (entry: Entry, index: number) =>
          <WordformElement segmentation={replaceStem(stemForm, entry.morphologicalAnalysis.referenceWord)}
                           translation={translation}
                           morphTags={getMorphTags(entry.morphologicalAnalysis) || []}
                           transcriptions={entry.transcriptions}
                           key={index}/>
      )}
    </>
  );
}

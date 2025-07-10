import { JSX, useState } from 'react';
import { StemElement } from './Stem';
import { Entry, WordformElement } from './Wordform';
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

function modifyPartOfSpeech(value: string) {
  const setPartOfSpeech = (morphologicalAnalysis: MorphologicalAnalysis) => {
    return update(morphologicalAnalysis, { paradigmClass: { $set: value } });
  };
  return setPartOfSpeech;
}

function modifyEntries(entries: Entry[],
  modification: (ma: MorphologicalAnalysis) => MorphologicalAnalysis): Entry[] {
  const newEntries: Entry[] = [];
  for (const {transcriptions, morphologicalAnalysis} of entries) {
    const analysis = writeMorphAnalysisValue(morphologicalAnalysis);
    const newAnalysis = modifyAnalysis(transcriptions, analysis, modification);
    if (newAnalysis !== undefined) {
      newEntries.push({transcriptions, morphologicalAnalysis: newAnalysis});
    }
  }
  return newEntries;
}

type StemViewerState = {
  stemForm: string;
  translation: string;
  partOfSpeech: string;
  entries: Entry[];
}

export function StemViewer({stem, initialEntries}: IProps): JSX.Element {
  
  const [unfolded, setUnfolded] = useState(false);
  const initialState: StemViewerState = {
    stemForm: stem.form,
    translation: stem.translation,
    partOfSpeech: stem.pos,
    entries: initialEntries
  };
  const [state, setState] = useState(initialState);
  const { stemForm, translation, partOfSpeech, entries } = state;
  
  return (
    <>
      <StemElement
        index={stem.index}
        form={stemForm} 
        translation={translation}
        pos={partOfSpeech}
        handleClick={() => setUnfolded(!unfolded)}
        onFormChange={(value: string) => {
          setState(update(state,
            { stemForm: { $set: value },
              entries: { $set: modifyEntries(entries, modifyStem(value)) } }
          ));
        }}       
        onTranslationChange={(value: string) => {
          setState(update(state,
            { translation: { $set: value },
              entries: { $set: modifyEntries(entries, modifyTranslation(value)) } }
          ));
        }}
        onPartOfSpeechChange={(value: string) => {
          setState(update(state,
            { partOfSpeech: { $set: value },
              entries: { $set: modifyEntries(entries, modifyPartOfSpeech(value)) } }
          ));
        }} />
      <br />
      {unfolded && entries.map(
        (entry: Entry, index: number) =>
          <WordformElement entry={entry}
                           key={index} />
      )}
    </>
  );
}

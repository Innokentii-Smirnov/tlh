import { JSX, useState } from 'react';
import { StemElement } from './Stem';
import { Entry, WordformElement } from './Wordform';
import { MorphologicalAnalysis, writeMorphAnalysisValue }
  from '../../../model/morphologicalAnalysis';
import update from 'immutability-helper';
import { findBoundary, getTranslationAndMorphTag } from '../splitter';

export class Stem {
  index: string;
  form: string;
  translation: string;
  pos: string;
  constructor(repr: string) {
    [this.index, this.form, this.translation, this.pos] = repr.split('@');
  }
  toString(): string {
    return [this.index, this.form, this.translation, this.pos].join('@');
  }
}

export type ModifyAnalysis = (transcriptions: string[], analysis: string,
    modification: (morphologicalAnalysis: MorphologicalAnalysis) => MorphologicalAnalysis)
    => MorphologicalAnalysis | undefined;
    
interface IProps {
  stem: Stem;
  initialEntries: Entry[];
  modifyAnalysis: ModifyAnalysis;
  initialUnfolded: boolean;
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

function handleSegmentationInput(entries: Entry[], index: number, value: string): Entry[] {
  const newEntries = update(entries,
    { [index]: { morphologicalAnalysis: { referenceWord: { $set: value } } } }
  );
  return newEntries;
}

function handleSegmentationBlur(entries: Entry[], index: number, value: string,
  modifyAnalysis: ModifyAnalysis, initialAnalysis: string): void {
  const entry = entries[index];
  const { transcriptions } = entry;
  const modification = (ma: MorphologicalAnalysis) => update(ma,
    { referenceWord: { $set: value } }
  );
  modifyAnalysis(transcriptions, initialAnalysis, modification);
}

function handleAnalysisInput(entries: Entry[], index: number, value: string,
  optionIndex: number): Entry[] {
  const entry = entries[index];
  const { morphologicalAnalysis } = entry;
  const [translation, morphTag] = getTranslationAndMorphTag(value);
  switch (morphologicalAnalysis._type) {
    case 'SingleMorphAnalysisWithoutEnclitics': {
        const newEntries = update(entries, {
          [index]: { 
            morphologicalAnalysis: {
              translation: { $set: translation },
              analysis: { $set: morphTag } 
            } 
          } 
        });
        return newEntries;
    }
    case 'MultiMorphAnalysisWithoutEnclitics': {
        const newEntries = update(entries, {
          [index]: { 
            morphologicalAnalysis: {
              translation: { $set: translation },
              analysisOptions: { [optionIndex]: { analysis: { $set: morphTag } } }
            } 
          } 
        });
        return newEntries;
    }
    default:
      return entries;
  }
}

function handleAnalysisBlur(entries: Entry[], index: number, value: string,
  optionIndex: number, modifyAnalysis: ModifyAnalysis, initialAnalysis: string): void {
  const entry = entries[index];
  const { transcriptions, morphologicalAnalysis } = entry;
  const [translation, morphTag] = getTranslationAndMorphTag(value);
  switch (morphologicalAnalysis._type) {
    case 'SingleMorphAnalysisWithoutEnclitics': {
        const modification = (ma: MorphologicalAnalysis) => update(ma, { 
          translation: { $set: translation },
          analysis: { $set: morphTag } 
        });
        modifyAnalysis(transcriptions, initialAnalysis, modification);
        break;
    }
    case 'MultiMorphAnalysisWithoutEnclitics': {
        const modification = (ma: MorphologicalAnalysis) => update(ma, { 
          translation: { $set: translation },
          analysisOptions: { [optionIndex]: {analysis: { $set: morphTag } } } 
        });
        modifyAnalysis(transcriptions, initialAnalysis, modification);
        break;
    }
  }
}

function modifyLocalEntries(entries: Entry[],
  modification: (ma: MorphologicalAnalysis) => MorphologicalAnalysis): Entry[] {
  const newEntries: Entry[] = [];
  for (const {transcriptions, morphologicalAnalysis} of entries) {
    const newAnalysis = modification(morphologicalAnalysis);
    if (newAnalysis !== undefined) {
      newEntries.push({transcriptions, morphologicalAnalysis: newAnalysis});
    }
  }
  return newEntries;
}

function modifyGlobalEntries(initialEntries: Entry[],
  currentEntries: Entry[],
  modifyAnalysis: ModifyAnalysis): void {
  for (let i = 0; i < currentEntries.length; i++) {
    const initialEntry = initialEntries[i];
    const currentEntry = currentEntries[i];
    const transcriptions = initialEntry.transcriptions;
    const initialMorphologicalAnalysis = initialEntry.morphologicalAnalysis;
    const currentMorphologicalAnalysis = currentEntry.morphologicalAnalysis;
    const modification = () => currentMorphologicalAnalysis;
    const analysis = writeMorphAnalysisValue(initialMorphologicalAnalysis);
    modifyAnalysis(transcriptions, analysis, modification);
  }
}

function modifyLocalAndGlobalEntries(entries: Entry[],
  modification: (ma: MorphologicalAnalysis) => MorphologicalAnalysis,
  modifyAnalysis: ModifyAnalysis): Entry[] {
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

export function StemViewer({stem, initialEntries, modifyAnalysis, initialUnfolded}: IProps): JSX.Element {
  
  const [unfolded, setUnfolded] = useState(initialUnfolded);
  const initialState: StemViewerState = {
    stemForm: stem.form,
    translation: stem.translation,
    partOfSpeech: stem.pos,
    entries: initialEntries
  };
  const [state, setState] = useState(initialState);
  const { stemForm, translation, partOfSpeech, entries } = state;
  
  const handleMultiEntryBlurEvent = () => modifyGlobalEntries(initialEntries, entries, modifyAnalysis);
  
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
              entries: { $set: modifyLocalEntries(entries, modifyStem(value)) } }
          ));
        }}
        onFormBlur={handleMultiEntryBlurEvent}        
        onTranslationChange={(value: string) => {
          setState(update(state,
            { translation: { $set: value },
              entries: { $set: modifyLocalEntries(entries, modifyTranslation(value)) } }
          ));
        }}
        onTranslationBlur={handleMultiEntryBlurEvent}
        onPartOfSpeechChange={(value: string) => {
          setState(update(state,
            { partOfSpeech: { $set: value },
              entries: { $set: modifyLocalAndGlobalEntries(entries, modifyPartOfSpeech(value), modifyAnalysis) } }
          ));
        }} />
      <br />
      {unfolded && entries.map(
        (entry: Entry, index: number) => {
          const morphAnalysisValue = writeMorphAnalysisValue(
            initialEntries[index].morphologicalAnalysis
          );

          return (
              <WordformElement entry={entry} key={morphAnalysisValue}
              handleSegmentationInput={(value: string) =>
                setState(update(state, { entries:
                  { $set: handleSegmentationInput(entries, index, value) }
                }))
              }
              handleSegmentationBlur={(value: string) =>
                handleSegmentationBlur(entries, index, value, modifyAnalysis,
                  morphAnalysisValue)
              }
              handleAnalysisInput={(value: string, optionIndex: number) =>
                setState(update(state, { entries:
                  { $set: handleAnalysisInput(entries, index, value, optionIndex) }
                }))
              }
              handleAnalysisBlur={(value: string, optionIndex: number) =>
                handleAnalysisBlur(entries, index, value, optionIndex, modifyAnalysis,
                  morphAnalysisValue)
              } />
            );
          }
      )}
    </>
  );
}

import { JSX, useState } from 'react';
import { StemElement } from './Stem';
import { WordformElement } from './Wordform';
import { makeAnalysisOptions, getMorphTags } from '../utils';
import { MorphologicalAnalysis, SingleMorphologicalAnalysisWithoutEnclitics,
  MultiMorphologicalAnalysisWithoutEnclitics, writeMorphAnalysisValue }
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
  entries: Entry[];
}

function replaceStem(newStem: string, segmentation: string) {
  return newStem + segmentation.substring(findBoundary(segmentation));
}

function getAnalysis(segmentation: string, translation: string, morphTags: string[], pos: string) {
  if (morphTags.length == 1) {
    const morphologicalAnalysis: SingleMorphologicalAnalysisWithoutEnclitics = {
        _type: 'SingleMorphAnalysisWithoutEnclitics',
        number: 1,
        selected: false,
        encliticsAnalysis: undefined,
        referenceWord: segmentation,
        translation: translation,
        analysis: morphTags[0],
        paradigmClass: pos,
        determinative: ''
    };
    const analysis = writeMorphAnalysisValue(morphologicalAnalysis);
    return analysis;
  } else {
    const morphologicalAnalysis: MultiMorphologicalAnalysisWithoutEnclitics = {
        _type: 'MultiMorphAnalysisWithoutEnclitics',
        number: 1,
        encliticsAnalysis: undefined,
        referenceWord: segmentation,
        translation: translation,
        analysisOptions: makeAnalysisOptions(morphTags),
        paradigmClass: pos,
        determinative: ''
      };
    const analysis = writeMorphAnalysisValue(morphologicalAnalysis);
    return analysis;
  }
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

export function StemViewer({stem, entries}: IProps): JSX.Element {
  
  const [unfolded, setUnfolded] = useState(false);
  const [stemForm, setStemForm] = useState(stem.form);
  const [translation, setTranslation] = useState(stem.translation);
  
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
          for (const {transcriptions, morphologicalAnalysis} of entries) {
            const analysis = getAnalysis(
              morphologicalAnalysis.referenceWord,
              translation,
              getMorphTags(morphologicalAnalysis) || [],
              stem.pos
            );
            modifyAnalysis(transcriptions, analysis, modifyStem(newStem));
          }
        }}        
        onTranslationChange={(translation: string) => {
          setTranslation(translation);
        }}
        onTranslationBlur={(translation: string) => {
          for (const {transcriptions, morphologicalAnalysis} of entries) {
            const analysis = getAnalysis(
              replaceStem(stemForm, morphologicalAnalysis.referenceWord),
              morphologicalAnalysis.translation,
              getMorphTags(morphologicalAnalysis) || [],
              stem.pos
            );
            modifyAnalysis(transcriptions, analysis, modifyTranslation(translation));
          }
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

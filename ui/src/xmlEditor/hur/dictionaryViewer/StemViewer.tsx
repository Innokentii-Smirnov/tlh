import { JSX, useState } from 'react';
import { StemElement } from './Stem';
import { Entry, WordformElement, IMorphologicalAnalysis } from './Wordform';
import { MorphologicalAnalysis, writeMorphAnalysisValue }
  from '../../../model/morphologicalAnalysis';
import update, { Spec } from 'immutability-helper';
import { findBoundary/*, getTranslationAndMorphTag*/ } from '../common/splitter';
import { changeStem, changePos, changeTranslation } from '../translations/modifyTranslations';
import { Dictionary, SetDictionary, containsAnalysis } from '../dict/dictionary';
//import { modifyAnalysis } from '../dict/analysisModifier';
import { addChange } from '../changes/changesAccumulator';
import { updateConcordanceKey } from '../concordance/concordance';
import { replaceMorphologicalAnalysis } from '../corpus/corpus';
import { areCorrect } from '../dict/morphologicalAnalysisValidator';
import { getMorphTags } from '../morphologicalAnalysis/auxiliary';
import { getEnglishTranslationKey } from '../translations/englishTranslations';
import { useMorphologicalAnalysesByStemIdQuery,
  useChangeStemFormMutation, useChangeStemPosMutation, useChangeStemGermanTranslationMutation,
  useChangeStemEnglishTranslationMutation, Stem as GQStem
} from '../../../graphql';

const errorSymbol = <>&#9876;</>;

function applySideEffects(origin: string, target: string, targetIsExtant: boolean): void {
  addChange(origin, target, targetIsExtant);
  // The corpus should be updated before the concordance
  // Since the old analysis is used to find the lines to update
  replaceMorphologicalAnalysis(origin, target);
  updateConcordanceKey(origin, target);
}

export class Stem {
  index: string;
  form: string;
  translation: string;
  pos: string;
  constructor(index: number, form: string, translation: string, pos: string) {
    this.index = index.toString();
    this.form = form;
    this.translation = translation;
    this.pos = pos;
  }
  toString(): string {
    return [this.index, this.form, this.translation, this.pos].join('@');
  }
}
    
interface IProps {
  stemListIndex: number,
  stem: GQStem;
  initialEntries: Entry[];
  setDictionary: SetDictionary;
  initialUnfolded: boolean;
  allUnfolded: boolean;
  onEnglishTranslationBlur: (eglishTranslation: string) => void;
  updateEnglishTranslationKey: (newEglishTranslationKey: string) => void;
}

function replaceStem(newStem: string, segmentation: string) {
  return newStem + segmentation.substring(findBoundary(segmentation));
}

function modifyStem(newStem: string) {
  const setStem = (morphologicalAnalysis: MorphologicalAnalysis) => {
    const segmentation = morphologicalAnalysis.referenceWord;
    return update(morphologicalAnalysis,
      { referenceWord: { $set: replaceStem(newStem, segmentation)} });
  };
  return setStem;
}

function modifyTranslation(value: string) {
  const setTranslation = (morphologicalAnalysis: MorphologicalAnalysis) => {
    return update(morphologicalAnalysis, { translation: { $set: value } });
  };
  return setTranslation;
}
/*
function handleSegmentationInput(entries: Entry[], index: number, value: string): Entry[] {
  const newEntries = update(entries,
    { [index]: { morphologicalAnalysis: { referenceWord: { $set: value } } } }
  );
  return newEntries;
}

function handleSegmentationBlur(dictionary: Dictionary,
  entries: Entry[], index: number, value: string, 
  initialAnalysis: string): Dictionary {
  const entry = entries[index];
  const { transcriptions, morphologicalAnalysis } = entry;
  const target = writeMorphAnalysisValue(morphologicalAnalysis);
  applySideEffects(initialAnalysis, target, containsAnalysis(dictionary, target));
  return modifyAnalysis(dictionary, transcriptions, initialAnalysis, morphologicalAnalysis);
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

function handleAnalysisBlur(dictionary: Dictionary,
  entries: Entry[], index: number, value: string,
  optionIndex: number, initialAnalysis: string): Dictionary {
  const entry = entries[index];
  const { transcriptions, morphologicalAnalysis } = entry;
  const target = writeMorphAnalysisValue(morphologicalAnalysis);
  applySideEffects(initialAnalysis, target, containsAnalysis(dictionary, target));
  return modifyAnalysis(dictionary, transcriptions, initialAnalysis, morphologicalAnalysis);
}
*/
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

function modifyGlobalEntries(dictionary: Dictionary, initialEntries: Entry[],
  currentEntries: Entry[]): Dictionary {
  const specification = new Map<string, [string[], string[]]>();
  for (let i = 0; i < currentEntries.length; i++) {
    const initialEntry = initialEntries[i];
    const currentEntry = currentEntries[i];
    const transcriptions = initialEntry.transcriptions;
    const initialMorphologicalAnalysis = initialEntry.morphologicalAnalysis;
    const currentMorphologicalAnalysis = currentEntry.morphologicalAnalysis;
    const initialAnalysis = writeMorphAnalysisValue(initialMorphologicalAnalysis);
    const currentAnalysis = writeMorphAnalysisValue(currentMorphologicalAnalysis);
    applySideEffects(initialAnalysis, currentAnalysis, containsAnalysis(dictionary, currentAnalysis));
    for (const transcription of transcriptions) {
      const entrySpec = specification.get(transcription);
      if (entrySpec === undefined) {
        specification.set(transcription, [[initialAnalysis], [currentAnalysis]]);
      } else {
        const [toRemove, toAdd] = entrySpec;
        toRemove.push(initialAnalysis);
        toAdd.push(currentAnalysis);
      }
    }
  }
  const spec: Spec<Dictionary> = {};
  for (const [transcription, entrySpec] of specification.entries()) {
    const [toRemove, toAdd] = entrySpec;
    spec[transcription] = {$remove: toRemove, $add: toAdd};
  }
  return update(dictionary, spec);
}

function modifyGlobalPartOfSpeech(dictionary: Dictionary, initialEntries: Entry[],
  value: string): Dictionary {
  const specification = new Map<string, [string[], string[]]>();
  for (let i = 0; i < initialEntries.length; i++) {
    const initialEntry = initialEntries[i];
    const transcriptions = initialEntry.transcriptions;
    const initialMorphologicalAnalysis = initialEntry.morphologicalAnalysis;
    const currentMorphologicalAnalysis = update(initialMorphologicalAnalysis,
      { paradigmClass: { $set: value } }
    );
    const initialAnalysis = writeMorphAnalysisValue(initialMorphologicalAnalysis);
    const currentAnalysis = writeMorphAnalysisValue(currentMorphologicalAnalysis);
    applySideEffects(initialAnalysis, currentAnalysis, containsAnalysis(dictionary, currentAnalysis));
    for (const transcription of transcriptions) {
      const entrySpec = specification.get(transcription);
      if (entrySpec === undefined) {
        specification.set(transcription, [[initialAnalysis], [currentAnalysis]]);
      } else {
        const [toRemove, toAdd] = entrySpec;
        toRemove.push(initialAnalysis);
        toAdd.push(currentAnalysis);
      }
    }
  }
  const spec: Spec<Dictionary> = {};
  for (const [transcription, entrySpec] of specification.entries()) {
    const [toRemove, toAdd] = entrySpec;
    spec[transcription] = {$remove: toRemove, $add: toAdd};
  }
  return update(dictionary, spec);
}

type StemViewerState = {
  form: string;
  pos: string;
  deu: string;
  eng: string;
  entries: Entry[];
}

export function StemViewer({stemListIndex, stem, initialEntries, setDictionary, initialUnfolded,
                            allUnfolded,
                            onEnglishTranslationBlur,
                            updateEnglishTranslationKey }: IProps): JSX.Element {
  
  const [unfolded, setUnfolded] = useState(initialUnfolded);
  const id = stem.id;
  const initialState: StemViewerState = {
    form: stem.form,
    pos: stem.pos,
    deu: stem.deu,
    eng: stem.eng,
    entries: initialEntries
  };
  const [state, setState] = useState(initialState);
  const { form, pos, deu, eng, entries } = state;
  
  const isCorrect = entries.every(entry => 
    getMorphTags(entry.morphologicalAnalysis).every(morphTag =>
      areCorrect(entry.morphologicalAnalysis.referenceWord, morphTag)
    )
  );

  const { data, loading, error } = useMorphologicalAnalysesByStemIdQuery({
    variables: {
      stemId: id
    },
  });

  let morphs: IMorphologicalAnalysis[];

  if (loading || error || data === undefined) {
    console.log(loading, error);
    morphs = [];
  } else {
    morphs = data.stem.morphologicalAnalyses;
  }

  const [changeStemFormMutation, formMutation] = useChangeStemFormMutation({
    variables: {
      stemId: id,
      form
    },
  });

  const [changeStemPosMutation, posMutation] = useChangeStemPosMutation({
    variables: {
      stemId: id,
      pos
    },
  });

  const [changeStemGermanTranslationMutation, deuMutation] = useChangeStemGermanTranslationMutation({
    variables: {
      stemId: id,
      deu
    },
  });

  const [changeStemEnglishTranslationMutation, engMutation] = useChangeStemEnglishTranslationMutation({
    variables: {
      stemId: id,
      eng
    },
  });
  
  return (
    <div className="flex flex-row">
      <div>
        <StemElement
          index={stemListIndex.toString()}
          form={form}
          pos={pos}
          translation={deu}
          englishTranslation={eng}
          handleClick={() => setUnfolded(!unfolded)}
          onFormChange={(value: string) => {
            setState(update(state,
              { form: { $set: value },
                entries: { $set: modifyLocalEntries(entries, modifyStem(value)) } }
            ));
          }}
          onFormBlur={(value: string) => {
            if (value !== stem.form) {
              changeStem(stem.form, value, pos, deu);
              setDictionary((dictionary: Dictionary) => {
                return modifyGlobalEntries(dictionary, initialEntries, entries);
              });
              updateEnglishTranslationKey(getEnglishTranslationKey(value, pos, deu));
              if (formMutation.loading || formMutation.error) {
                console.log(formMutation.loading, formMutation.error);
              } else {
                changeStemFormMutation();
              }
            }
          }}        
          onTranslationChange={(value: string) => {
            setState(update(state,
              { deu: { $set: value },
                entries: { $set: modifyLocalEntries(entries, modifyTranslation(value)) } }
            ));
          }}
          onTranslationBlur={(value: string) => {
            if (value !== stem.deu) {
              changeTranslation(form, pos, stem.deu, value);
              setDictionary((dictionary: Dictionary) => {
                return modifyGlobalEntries(dictionary, initialEntries, entries);
              });
              updateEnglishTranslationKey(getEnglishTranslationKey(form, pos, value));
              if (deuMutation.loading || deuMutation.error) {
                console.log(deuMutation.loading, deuMutation.error);
              } else {
                changeStemGermanTranslationMutation();
              }
            }
          }}
          onPartOfSpeechChange={(value: string) => {
            setState(update(state, { pos: { $set: value } }));
          }}
          onPartOfSpeechBlur={(value: string) => {
            changePos(form, stem.pos, value, deu);
            setDictionary((dictionary: Dictionary) => {
              return modifyGlobalPartOfSpeech(dictionary, initialEntries, value);
            });
            updateEnglishTranslationKey(getEnglishTranslationKey(form, value, deu));
            if (posMutation.loading || posMutation.error) {
              console.log(posMutation.loading, posMutation.error);
            } else {
              changeStemPosMutation();
            }
          }}
          onEnglishTranslationChange={(value: string) => {
            setState(update(state, { eng: { $set: value } }));
          }}
          onEnglishTranslationBlur={(value: string) => {
            onEnglishTranslationBlur(value);
            if (engMutation.loading || engMutation.error) {
              console.log(engMutation.loading, engMutation.error);
            } else {
              changeStemEnglishTranslationMutation();
            }
          }} />
        <br />
        {(unfolded || allUnfolded) && morphs.map(
          (morphologicalAnalysis) => {
            return (
              <WordformElement
                stem={form}
                deu={deu}
                morphologicalAnalysis={morphologicalAnalysis}
                key={morphologicalAnalysis.id}
                initialShowAttestations={allUnfolded}
                handleSegmentationInput={() => {
                  // Do nothing.
                }}
                handleSegmentationBlur={() => {
                  // Do nothing.
                }}
                handleAnalysisInput={() => {
                  // Do nothing.
                }}
                handleAnalysisBlur={() => {
                  // Do nothing.
                }} />
              );
            }
        )}
      </div>
      {!isCorrect &&
        <div className="p-2 error-mark">{errorSymbol}</div>
      }
    </div>
  );
}

import { JSX } from 'react';
import { MorphologicalAnalysis } from '../../../model/morphologicalAnalysis';
import { getStem } from '../splitter';
import { getPos } from '../partsOfSpeech';
import { getMorphTags } from '../utils';
import { groupBy } from '../utils';
import { StemViewer, Stem, Wordform } from './StemViewer';

interface IProps {
  morphologicalAnalyses: MorphologicalAnalysis[];
}

function keyFunc(morphologicalAnalysis: MorphologicalAnalysis): string {
  return [getStem(morphologicalAnalysis.referenceWord),
          morphologicalAnalysis.translation,
          getPos(morphologicalAnalysis.paradigmClass, morphologicalAnalysis.translation, '')].join('@');
}

function valueFunc(morphologicalAnalysis: MorphologicalAnalysis): string {
  return morphologicalAnalysis.referenceWord + '@' + 
         (getMorphTags(morphologicalAnalysis) || []).join(';');
}

export function DictionaryViewer({morphologicalAnalyses}: IProps): JSX.Element {
  
  const grouped = groupBy(morphologicalAnalyses, keyFunc, valueFunc);
  
  const stems = Array.from(grouped.keys()).sort();
  
  return (
    <div className="mt-2">
      Click on a stem to see its derivatives and inflected forms. <br /> <br />
      {stems.map((stem: string, index: number) => {
        const group = grouped.get(stem);
        const wordforms: string[] = group === undefined ? [] : Array.from(group);
        return (
          <StemViewer
            stem={new Stem((index + 1).toString() + '.@' + stem)}
            wordforms={wordforms.map((wordform: string) => new Wordform(wordform))}
            key={index} />
        );
      })}
    </div>
  );
}

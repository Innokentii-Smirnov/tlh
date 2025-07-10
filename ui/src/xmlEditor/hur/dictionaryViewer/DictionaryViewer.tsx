import { JSX } from 'react';
import { getStem } from '../splitter';
import { getPos } from '../partsOfSpeech';
import { groupBy } from '../utils';
import { StemViewer, Stem } from './StemViewer';
import { Entry } from './Wordform';
import { DictionaryDownloader } from '../dict/files/DictionaryDownloader';

interface IProps {
  entries: Entry[];
}

function keyFunc({morphologicalAnalysis}: Entry): string {
  return [getStem(morphologicalAnalysis.referenceWord),
          morphologicalAnalysis.translation,
          getPos(morphologicalAnalysis.paradigmClass, morphologicalAnalysis.translation, '')].join('@');
}

function valueFunc(entry: Entry): Entry {
  return entry;
}

export function DictionaryViewer({entries}: IProps): JSX.Element {
  
  const grouped = groupBy(entries, keyFunc, valueFunc);
  
  const stems = Array.from(grouped.keys()).sort();
  
  return (
    <div className="grid grid-cols-2 gap-2 my-2">
      <div className="mt-2">
        Click on the button &quot;&#8744;&quot; or a stem&apos;s number to see its derivatives and inflected forms. <br /> <br />
        {stems.map((stem: string, index: number) => {
          const group = grouped.get(stem);
          const entries: Entry[] = group === undefined ? [] : Array.from(group);
          return (
            <StemViewer
              stem={new Stem((index + 1).toString() + '.@' + stem)}
              initialEntries={entries}
              key={index} />
          );
        })}
      </div>
      <div>
        <div className="position: fixed">
          <DictionaryDownloader />
        </div>
      </div>
    </div>
  );
}

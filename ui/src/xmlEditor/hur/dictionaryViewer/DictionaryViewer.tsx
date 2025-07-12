import { JSX, useState, useEffect } from 'react';
import { getStem } from '../common/splitter';
import { groupBy } from '../common/utils';
import { StemViewer, Stem, ModifyAnalysis } from './StemViewer';
import { Entry } from './Wordform';
import { DictionaryDownloader } from '../dict/files/DictionaryDownloader';
import { writeMorphAnalysisValue } from '../../../model/morphologicalAnalysis';

interface IProps {
  entries: Entry[];
  modifyAnalysis: ModifyAnalysis;
}

function keyFunc({morphologicalAnalysis}: Entry): string {
  return [getStem(morphologicalAnalysis.referenceWord),
          morphologicalAnalysis.translation,
          morphologicalAnalysis.paradigmClass].join('@');
}

function valueFunc(entry: Entry): Entry {
  return entry;
}

export function DictionaryViewer({entries, modifyAnalysis}: IProps): JSX.Element {

  const [unfolded, setUnfolded] = useState(false);
  
  useEffect(() => {
    setUnfolded(true);
  });
  
  const grouped = groupBy(entries, keyFunc, valueFunc);
  
  const stems = Array.from(grouped.keys()).sort();
  
  return (
    <div className="grid grid-cols-2 gap-2 my-2">
      <div className="mt-2">
        Click on the button &quot;&#8744;&quot; or a stem&apos;s number to see its derivatives and inflected forms. <br /> <br />
        {stems.map((stem: string, index: number) => {
          const group = grouped.get(stem);
          const entries: Entry[] = group === undefined ? [] : Array.from(group);
          const stemObject = new Stem((index + 1).toString() + '.@' + stem);
          const key = entries
            .map(entry => writeMorphAnalysisValue(entry.morphologicalAnalysis))
            .join('|');
          return (
            <StemViewer
              stem={stemObject}
              initialEntries={entries}
              key={key} 
              modifyAnalysis={modifyAnalysis}
              initialUnfolded={unfolded} />
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

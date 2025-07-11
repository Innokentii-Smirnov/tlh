import { JSX, useState } from 'react';
import { getStem } from '../splitter';
import { groupBy } from '../utils';
import { StemViewer, Stem } from './StemViewer';
import { Entry } from './Wordform';
import { DictionaryDownloader } from '../dict/files/DictionaryDownloader';
import update from 'immutability-helper';
import { countValues } from '../dict/valueCounter';

interface IProps {
  entries: Entry[];
}

function keyFunc({morphologicalAnalysis}: Entry): string {
  return [getStem(morphologicalAnalysis.referenceWord),
          morphologicalAnalysis.translation,
          morphologicalAnalysis.paradigmClass].join('@');
}

function valueFunc(entry: Entry): Entry {
  return entry;
}

type State = {
  count: number;
  stems: string[];
  grouped: Map<string, Set<Entry>>;
}

export function DictionaryViewer({entries}: IProps): JSX.Element {
  
  const [state, setState] = useState(() => {
      const grouped = groupBy(entries, keyFunc, valueFunc);
      const initialState: State = {
        count: countValues(),
        stems: Array.from(grouped.keys()).sort(),
        grouped
      };
      return initialState;
  });
  
  const removeStem = (index: number, newCount: number) => {
    //alert(`Removing ${index} from ${state.stems.length}`);
    setState((prevState: State) =>
      update(prevState, {count: {$set: newCount}, stems: { $splice: [[index, 1]] } })
    );
  };
  
  return (
    <div className="grid grid-cols-2 gap-2 my-2">
      <div className="mt-2">
        Click on the button &quot;&#8744;&quot; or a stem&apos;s number to see its derivatives and inflected forms. <br /> <br />
        {state.stems.map((stem: string, index: number) => {
          const group = state.grouped.get(stem);
          const entries: Entry[] = group === undefined ? [] : Array.from(group);
          return (
            <StemViewer
              stem={new Stem((index + 1).toString() + '.@' + stem)}
              initialEntries={entries}
              key={stem} count={state.count}
              remove={(newCount: number) => removeStem(index, newCount)} />
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

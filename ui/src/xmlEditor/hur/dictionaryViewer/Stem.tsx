import { JSX } from 'react';

interface IProps {
  index: string;
  form: string;
  translation: string;
  pos: string;
  handleClick: () => void;
  onFormChange: (newStem: string) => void;
  onTranslationChange: (translation: string) => void;
}

export function StemElement({index, form, translation, pos, handleClick,
                             onFormChange,
                             onTranslationChange}: IProps): JSX.Element {
  
  return (
    <div className="flex flex-row">
      {[index, pos].map((field: string, index: number) => {
        let style = 'p-2 border-y border-r border-slate-500';
        if (index === 0) {
          style += ' border-l';
        }
        return (
          <button onClick={handleClick}
                className={style}
                key={index}>
            {field}
          </button>
        );
       })
      }
      <input type="text" value={form}
             className="p-2 border-y border-r border-slate-500"
             onChange={event => onFormChange(event.target.value)} />
      <input type="text" value={translation}
             className="p-2 border-y border-r border-slate-500"
             onChange={event => onTranslationChange(event.target.value)} />
    </div>
  );
}

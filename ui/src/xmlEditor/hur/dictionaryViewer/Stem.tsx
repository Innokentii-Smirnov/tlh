import { JSX } from 'react';

interface IProps {
  index: string;
  form: string;
  translation: string;
  pos: string;
  handleClick: () => void;
  onTranslationChange: (translation: string) => void;
  onTranslationBlur: (translation: string) => void;
}

export function StemElement({index, form, translation, pos, handleClick,
                             onTranslationChange,
                             onTranslationBlur}: IProps): JSX.Element {
  
  return (
    <div className="flex flex-row">
      {[index, form, pos].map((field: string, index: number) => {
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
      <input type="text" value={translation}
             className="p-2 border-y border-r border-slate-500"
             onChange={event => onTranslationChange(event.target.value)}
             onBlur={event => onTranslationBlur(event.target.value)} />
    </div>
  );
}

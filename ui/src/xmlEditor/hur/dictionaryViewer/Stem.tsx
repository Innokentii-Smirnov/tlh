import { JSX } from 'react';

interface IProps {
  index: string;
  form: string;
  translation: string;
  pos: string;
  handleClick: () => void;
}

export function StemElement({index, form, translation, pos, handleClick}: IProps): JSX.Element {

  return (
    <div className="flex flex-row">
      {[index, form, translation, pos].map((field: string, index: number) => {
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
    </div>
  );
}

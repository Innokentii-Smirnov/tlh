import {JSX} from 'react';
import {useTranslation} from 'react-i18next';
import {restartChangesAccumulation} from '../changes/changesAccumulator';

interface IProps {
  clearChanges: () => void;
}

export function ChangesListClearer({ clearChanges }: IProps): JSX.Element {

  const {t} = useTranslation('common');

  return (
    <button type="button"
            className="p-2 rounded border border-slate-500 w-full"
            onClick={() => {
              restartChangesAccumulation();
              clearChanges();
            }} >
      {t('clearChangesList')}
    </button>
  );
}

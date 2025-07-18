import { getDictionary, upgradeDictionary } from '../dictionary';
import { getGlosses, upgradeGlosses } from '../../translations/glossProvider';
import { getPartsOfSpeech, setPartsOfSpeech } from '../../partsOfSpeech/partsOfSpeech';
import { getConcordance, updateConcordance } from '../../concordance/concordance';
import { makeDownload } from '../../../../downloadHelper';

export function downloadDictionary() {
  const dictionary = getDictionary();
  const glosses = getGlosses();
  const partsOfSpeech = getPartsOfSpeech();
  const concordance = getConcordance();
  const obj = {partsOfSpeech, dictionary, glosses, concordance};
  const jsonText = JSON.stringify(obj, undefined, '\t');
  makeDownload(jsonText, 'Dictionary.json');
}

export async function readDict(file: File) {
  const source = await file.text();
  const parsed = JSON.parse(source);
  const {dictionary, glosses} = parsed;
  upgradeDictionary(dictionary);
  upgradeGlosses(glosses);
  if ('partsOfSpeech' in parsed) {
    setPartsOfSpeech(parsed.partsOfSpeech);
  }
  if ('concordance' in parsed) {
    updateConcordance(parsed.concordance);
  }
}

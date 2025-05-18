import {convertDictionary, updateDictionary} from './utility';
import {getStem} from './splitter';

//Dieses Modul kann Bedeutungen von Stämmen speichern und nachschlagen.
const glosses: Map<string, Set<string>> = new Map();

const specialSymbols = /[()>]/g;

function preprocessWord(word: string): string
{
	return word.replaceAll(specialSymbols, '');
}

function getKey(word: string, pos: string): string
{
  return preprocessWord(word) + ',' + pos;
}

export function storeGloss(word: string, pos: string, gloss: string)
{
	const key: string = getKey(word, pos);
	let current: Set<string>;
	if (glosses.has(key))
	{
		const value = glosses.get(key);
		if (value === undefined)
		{
			throw new Error();
		}
		current = value;
	}
	else
	{
		current = new Set();
		glosses.set(key, current);
	}
	current.add(gloss);
}

export function retrieveGloss(word: string, pos: string): Set<string> | null
{
	const key: string = getKey(word, pos);
	if (glosses.has(key))
	{
		const value = glosses.get(key);
		if (value === undefined)
		{
			throw new Error();
		}
		return value;
	}
	else
	{
		return null;
	}
}

export function getGloss(word: string, pos: string): string
{
    const stem = getStem(word);
    const retrieved = retrieveGloss(stem, pos);
    if (retrieved === null)
    {
        return '';
    }
    else
    {
        return Array.from(retrieved).sort().join('; ');
    }
}

const sep = ' @ ';

export function insertGloss(analysis: string): string
{
  console.log(analysis);
  const fields: string[] = analysis.split(sep);
  const segmentation = fields[0];
  const pos = fields[3];
  console.log(segmentation + ',' + pos);
  const gloss = getGloss(segmentation, pos);
  fields[1] = gloss;
  return fields.join(sep);
}

export function getGlosses(): {[key: string]: string[]}
{
  return convertDictionary(glosses);
}

export function upgradeGlosses(object: {[key: string]: string[]}): void
{
  updateDictionary(glosses, object);
}

import {convertDictionary, updateDictionary} from './utility';
import { getHurrianLexiconUrl } from '../../urls';

//Dieses Modul kann Bedeutungen von Stämmen speichern und nachschlagen.
const glosses: Map<string, Set<string>> = new Map();

fetch(getHurrianLexiconUrl, {method: 'GET'}).then(response => {
  response.json().then(obj => {
    upgradeGlosses(obj);
  });
});

function preprocessStem(stem: string): string
{
  return stem.replace('(', '').replace(')', '');
}

function getKey(stem: string, pos: string): string
{
	return preprocessStem(stem) + ',' + pos;
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

export function logGlosses(): void
{
	for(const [key, value] of glosses)
	{
		console.log(key + ' -> ' + Array.from(value).sort().join('; '));
	}
}

export function getGlosses(): {[key: string]: string[]}
{
  return convertDictionary(glosses);
}

export function upgradeGlosses(object: {[key: string]: string[]}): void
{
  updateDictionary(glosses, object);
}

const glosses: Map<string, Set<string>> = new Map();

function getKey(word: string, pos: string): string
{
	return word + ',' + pos;
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
		console.log(key + " -> " + Array.from(value).sort().join('; '));
	}
}

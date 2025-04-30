import {grammemes as grammemesByPartOfSpeech} from './morphemes';
import {suffixPositions, encliticPositions} from './positions';

function makeCategoryGroup(partOfSpeech: string, position: string, sep: string): string
{
    const category: string = position.replace('2', '');
	const grammemes: {[key: string]: {[key: string]: string}} = grammemesByPartOfSpeech[partOfSpeech];
    if (grammemes[category] === undefined)
	{
        console.log(category);
    }
    const values: string = Object.keys(grammemes[category]).join('|');
    const group: string = '(?:' + sep + '(?<' + position + '>'+ values + '))?';
    return group;
}

export const partsOfSpeech: string[] = Array.from(Object.keys(grammemesByPartOfSpeech))
	.filter((partOfSpeech: string) => partOfSpeech != 'enclitic');
const enclitics: string = encliticPositions
	.map((category: string) => makeCategoryGroup('enclitic', category, '='))
	.join('');
const expr: {[key: string]: RegExp} = {};

for (const pos of partsOfSpeech)
{
	const suffixes: string = suffixPositions[pos]
		.map((category: string) => makeCategoryGroup(pos, category, '-'))
		.join('');
	const rootLength: string = pos === 'noun' ? '3' : '2'; 
	const segmentedWord: string = '^(?<stem>[^-=]{' + rootLength + ',}?)' + suffixes + enclitics + '$';
	expr[pos] = new RegExp(segmentedWord);
}

export function analyze(word: string, pos: string): [string, string | null] | null
{
    if (pos == 'indecl')
	{
        return [word, null];
    }
    else 
	{
        const match = word.match(expr[pos]);
        if (match === null)
		{
            return null;
        }
        else
		{
            const groups = match.groups;
			if (groups !== undefined)
			{
				const stem: string = groups['stem'];
				const suffixes: string = suffixPositions[pos]
					.filter(position => groups[position] !== undefined)
					.map(position =>
					{
						const grammemes: {[key: string]: string} =
							grammemesByPartOfSpeech[pos][position.replace('2', '')];
						return grammemes[groups[position]];
					})
					.join('-');
				const enclitics: string = encliticPositions
					.filter(position => groups[position] !== undefined)
					.map(position => 
					{
						const grammemes: {[key: string]: string} =
							grammemesByPartOfSpeech.enclitic[position.replace('2', '')];
						return grammemes[groups[position]];
					})
					.join('=');
				let tag: string | null;
				if (suffixes != '')
				{
					tag = suffixes;
					if (enclitics != '')
					{
						tag += '=' + enclitics;
					}
				}
				else
				{
					tag = null;
				}
				return [stem, tag];
			}
			else
			{
				return null;
			}
        }
    }
}

// Dieses Modul kann Segmentierungen morphologische Glossierung zuweisen.
// Sowohl den vom Benutzer eingegebenen Segmentierungen als auch den automatisch erstellten.
// Die Grammatik (Annotationen von Suffixen und ihre Reihenfolge) wird als 2 JSON-Dateien in "public" gespeichert.
function loadFile(filePath: string): string
{
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.open('GET', filePath, false);
    xmlhttp.send();
    if (xmlhttp.status == 200) 
	{
        const result: string = xmlhttp.responseText;
		return result;
    }
	else
	{
		throw new Error('File not found: ' + filePath);
	}
}

type Seq = string | string[];

const grammemesByPartOfSpeech: {[key: string]: {[key: string]: {[key: string]: Seq}}}
	= JSON.parse(loadFile(process.env.PUBLIC_URL + '/hurrian/morphemes.json'));
const suffixPositions: {[key: string]: string[]}
	= JSON.parse(loadFile(process.env.PUBLIC_URL + '/hurrian/positions.json'));
const encliticPositions: string[] = suffixPositions.enclitic;
delete suffixPositions.enclitic;

function makeCategoryGroup(partOfSpeech: string, position: string, sep: string): string
{
    const category: string = position.replace('2', '');
	const grammemes: {[key: string]: {[key: string]: Seq}} = grammemesByPartOfSpeech[partOfSpeech];
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
	const segmentedGrammaticalMorphemes: string = suffixes + enclitics + '$';
	expr[pos] = new RegExp(segmentedGrammaticalMorphemes);
}

function expand(array: Seq[]): string[][]
{
	let sequences: string[][] = [[]];
	for (let i = 0; i < array.length; i++)
	{
		const element = array[i];
		if (typeof(element) === 'string')
		{
			for (const sequence of sequences)
			{
				sequence.push(element);
			}
		}
		else
		{
			const newSequences: string[][] = [];
			for (const sequence of sequences)
			{
				for (const subelement of element)
				{
					newSequences.push(sequence.concat([subelement]));
				}
			}
			sequences = newSequences;
		}
	}
	return sequences;
}

export function analyze(grammaticalMorphemes: string, pos: string): string[] | null
{
    if (pos == 'indecl')
	{
        return null;
    }
    else 
	{
        const match = grammaticalMorphemes.match(expr[pos]);
        if (match === null)
		{
            return null;
        }
        else
		{
            const groups = match.groups;
			if (groups !== undefined)
			{
				const suffixChains: string[][] = 
				expand(
					suffixPositions[pos]
						.filter(position => groups[position] !== undefined)
						.map(position =>
						{
							const grammemes: {[key: string]: Seq} =
								grammemesByPartOfSpeech[pos][position.replace('2', '')];
							return grammemes[groups[position]];
						})
				);
				const encliticChains: string[][] =
				expand(
					encliticPositions
						.filter(position => groups[position] !== undefined)
						.map(position => 
						{
							const grammemes: {[key: string]: Seq} =
								grammemesByPartOfSpeech.enclitic[position.replace('2', '')];
							return grammemes[groups[position]];
						})
				);
				const result: string[] = [];
				for (const suffixChain of suffixChains)
				{
					for (const encliticChain of encliticChains)
					{
						const chain: string = encliticChain.length > 0 ?
							suffixChain.join('-') + '=' + encliticChain.join('=') :
							suffixChain.join('-');
						result.push(chain);
					}
				}
				return result;
			}
			else
			{
				return null;
			}
        }
    }
}

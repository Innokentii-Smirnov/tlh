import {XmlElementNode} from 'simple_xml';
import {getText} from './xmlUtilities';
import {makeBoundTranscription} from './transcribe';
import {makeStandardAnalyses} from './standardAnalysis';
import {storeGloss, retrieveGloss, logGlosses} from './glossProvider';

const mrpRegex = /^mrp(\d+)$/;
const dictionary: Map<string, Set<string>> = new Map();

function getMrps(node: XmlElementNode): Map<string, string>
{
	const mrps: Map<string, string> = new Map();
	for (const attribute of Object.keys(node.attributes))
	{
		const match = attribute.trim().match(mrpRegex);
		if (match !== null)
		{
			const key: string = match[1];
			const value: string = node.attributes[attribute] || '';
			mrps.set(key, value);
		}
	}
	return mrps;
}

function setGlosses(node: XmlElementNode): void
{
	const mrps: Map<string, string> = getMrps(node);
	for (const pair of mrps)
	{
		const [key, mrp] = pair;
		const [segmentation, gloss, tag, template, det] = mrp.split('@').map(x => x.trim());
		if (gloss === '')
		{
			const stem = getStem(segmentation);
			const pos = getPos(template);
			const glosses = retrieveGloss(stem, pos);
			if (glosses != null)
			{
				const newGloss = Array.from(glosses).sort().join('; ');
				const newMrp = [segmentation, newGloss, tag, template, det].join(' @ ');
				node.attributes['mrp' + key] = newMrp;
			}
		}
	}
}

export function annotateHurrianWord(node: XmlElementNode): void
{
	const transliteration: string = getText(node);
	const transcription: string = makeBoundTranscription(transliteration);
	node.attributes.trans = transcription;
	if (node.attributes.mrp0sel === 'HURR')
	{
		node.attributes.mrp0sel = '';
	}
	if (dictionary.has(transcription))
	{
		setGlosses(node);
		const possibilities: Set<string> | undefined = dictionary.get(transcription);
		if (possibilities === undefined)
		{
			throw new Error();
		}
		if (node.attributes.firstAnalysisIsPlaceholder === 'true')
		{
			delete node.attributes.mrp1;
			delete node.attributes.firstAnalysisIsPlaceholder;
		}
		const mrps: Map<string, string> = getMrps(node);
		const analyses: Set<string> = new Set(mrps.values());
		let i: number;
		if (mrps.size > 0)
		{
			i = Math.max(...Array.from(mrps.keys()).map(parseInt));
		}
		else
		{
			i = 0;
		}
		for (const analysis of possibilities)
		{
			if (!analyses.has(analysis))
			{
				i++;
				node.attributes['mrp' + i.toString()] = analysis;
			}
		}
	}
	else 
	{
		const mrps: Map<string, string> = getMrps(node);
		if (mrps.size == 0)
		{
			const analyses: string[] = makeStandardAnalyses(transcription);
			if (analyses.length > 0)
			{
				for (let i = 0; i < analyses.length; i++)
				{
					const index: string = (i+1).toString();
					const analysis: string = analyses[i];
					node.attributes['mrp' + index] = analysis;
				}
			}
			else
			{
				node.attributes.mrp1 = transcription + '@@@@';
				node.attributes.firstAnalysisIsPlaceholder = 'true';
			}
		}
		logGlosses();
		setGlosses(node);
	}
}

function getStem(segmentation: string): string
{
	let i;
	for (i = 0; i < segmentation.length; i++)
	{
		const char: string = segmentation[i];
		if (char == '-' || char == '=')
		{
			break;
		}
	}
	return segmentation.substring(0, i);
}

function getPos(template: string): string
{
	if (template === 'noun' || template === 'indecl')
	{
		return template;
	}
	else
	{
		return 'verb';
	}
}

function saveGloss(mrp: string): void
{
	const [segmentation, gloss, tag, template, det] = mrp.split('@').map(x => x.trim());
	if (gloss != '')
	{
		const stem = getStem(segmentation);
		const pos = getPos(template);
		storeGloss(stem, pos, gloss);
	}
}

export function updateHurrianDictionary(node: XmlElementNode, number: number, value: string): void
{
	if (number === 1)
	{
		delete node.attributes.firstAnalysisIsPlaceholder;
	}
	const transcription: string = node.attributes.trans || '';
	let possibilities: Set<string> | undefined;
	if (dictionary.has(transcription))
	{
		possibilities = dictionary.get(transcription);
	}
	else
	{
		possibilities = new Set<string>();
		dictionary.set(transcription, possibilities);
	}
	if (possibilities === undefined)
	{
		throw new Error();
	}
	possibilities.add(value);
	saveGloss(value);
}

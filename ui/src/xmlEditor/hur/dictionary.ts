import {XmlElementNode} from 'simple_xml';
import {getText, getMrps} from './xmlUtilities';
import {makeBoundTranscription} from './transcribe';
import {makeStandardAnalyses} from './standardAnalysis';
import {logGlosses} from './glossProvider';
import {setGlosses, saveGloss} from './glossUpdater';
import {MorphologicalAnalysis, writeMorphAnalysisValue}
	from '../../model/morphologicalAnalysis';
import {convertDictionary, updateDictionary} from './utility';

const dictionary: Map<string, Set<string>> = new Map();

export async function annotateHurrianWord(node: XmlElementNode): Promise<void>
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
			const analyses: MorphologicalAnalysis[] = await makeStandardAnalyses(transcription);
			if (analyses.length > 0)
			{
				for (const ma of analyses)
				{
					node.attributes['mrp' + ma.number.toString()]
						= writeMorphAnalysisValue(ma);
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
	saveGloss(number, value);
}

export function getDictionary(): {[key: string]: string[]}
{
  return convertDictionary(dictionary);
}

export function upgradeDictionary(object: {[key: string]: string[]}): void
{
  updateDictionary(dictionary, object);
}

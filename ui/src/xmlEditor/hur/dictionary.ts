import {XmlElementNode} from 'simple_xml';
import {getText, getMrps} from './xmlUtilities';
import {makeBoundTranscription} from './transcribe';
import {makeStandardAnalyses} from './standardAnalysis';
import {logGlosses} from './glossProvider';
import {setGlosses, saveGloss} from './glossUpdater';

const dictionary: Map<string, Set<string>> = new Map();

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

import {MorphologicalAnalysis, readMorphologicalAnalysis,
		readMorphologiesFromNode, writeMorphAnalysisValue}
		from '../../model/morphologicalAnalysis';
import {XmlElementNode} from 'simple_xml';
import {storeGloss, retrieveGloss} from './glossProvider';
import {getStem} from './splitter';

export function getPos(template: string): string
{
	if (template === 'noun' || template === 'indecl' || template === '')
	{
		return template;
	}
	else
	{
		return 'verb';
	}
}

export function setGlosses(node: XmlElementNode): void
{
	const mas: MorphologicalAnalysis[] = readMorphologiesFromNode(node, []);
	for (const ma of mas)
	{
		if (ma.translation === '')
		{
			const stem = getStem(ma.referenceWord);
			const pos = getPos(ma.paradigmClass);
			const glosses = retrieveGloss(stem, pos);
			if (glosses != null)
			{
				ma.translation = Array.from(glosses).sort().join('; ');
				node.attributes['mrp' + ma.number.toString()] = writeMorphAnalysisValue(ma);
			}
		}
	}
}

export function saveGloss(number: number, mrp: string): void
{
	const ma: MorphologicalAnalysis | undefined = readMorphologicalAnalysis(number, mrp, []);
	if (ma !== undefined && ma.translation != '')
	{
		const stem = getStem(ma.referenceWord);
		const pos = getPos(ma.paradigmClass);
		storeGloss(stem, pos, ma.translation);
	}
}

import {getMrps} from './xmlUtilities';
import {XmlElementNode} from 'simple_xml';
import {storeGloss, retrieveGloss} from './glossProvider';

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

export function setGlosses(node: XmlElementNode): void
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

export function saveGloss(mrp: string): void
{
	const [segmentation, gloss, tag, template, det] = mrp.split('@').map(x => x.trim());
	if (gloss != '')
	{
		const stem = getStem(segmentation);
		const pos = getPos(template);
		storeGloss(stem, pos, gloss);
	}
}

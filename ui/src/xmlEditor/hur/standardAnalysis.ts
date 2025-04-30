import {segment} from './segment';
import {analyze} from './analyze';

export function makeStandardAnalyses(transcription: string): string[]
{
	const analyses: string[] = [];
	const segmentations: [string, string][] = segment(transcription);
	for (const result of segmentations)
	{
		const [segmentation, pos] = result;
		const analysis = analyze(segmentation, pos);
		if (analysis !== null)
		{
			const [stem, tagOrNull] = analysis;
			const tag: string = tagOrNull !== null ? tagOrNull : '';
			analyses.push(segmentation + '@@' + tag + '@' + pos + '@');
		}
		else
		{
			analyses.push(segmentation + '@@@' + pos + '@');
		}
	}
	return analyses;
}

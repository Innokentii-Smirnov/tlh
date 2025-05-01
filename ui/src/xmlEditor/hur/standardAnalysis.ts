import {segment} from './segment';
import {analyze} from './analyze';
import {MorphologicalAnalysis} from '../../model/morphologicalAnalysis';
import {SelectableLetteredAnalysisOption} from '../../model/analysisOptions';
import {getGrammaticalMorphemes} from './splitter';

export function makeStandardAnalyses(transcription: string): MorphologicalAnalysis[]
{
	const analyses: MorphologicalAnalysis[] = [];
	const segmentations: [string, string][] = segment(transcription);
	for (let i = 0; i < segmentations.length; i++)
	{
		const [segmentation, pos] = segmentations[i];
		let ma: MorphologicalAnalysis;
		const grammaticalMorphemes = getGrammaticalMorphemes(segmentation);
		const tags: string[] | null = analyze(grammaticalMorphemes, pos);
		if (tags !== null && tags.length > 0)
		{
			if (tags.length == 1)
			{
				ma = {
					number: i + 1,
					referenceWord: segmentation,
					translation: '',
					analysis: tags[0],
					paradigmClass: pos,
					determinative: '',
					_type: 'SingleMorphAnalysisWithoutEnclitics',
					encliticsAnalysis: undefined,
					selected: false
				};
			}
			else
			{
				const analysisOptions: SelectableLetteredAnalysisOption[] = [];
				let c = 97;
				for (const tag of tags)
				{
					const analysisOption: SelectableLetteredAnalysisOption = 
					{
						letter: String.fromCodePoint(c),
						analysis: tag,
						selected: false
					};
					c++;
					analysisOptions.push(analysisOption);
				}
				ma = {
					number: i + 1,
					referenceWord: segmentation,
					translation: '',
					analysisOptions,
					paradigmClass: pos,
					determinative: '',
					_type: 'MultiMorphAnalysisWithoutEnclitics',
					encliticsAnalysis: undefined
				};
			}
		}
		else
		{
			ma = {
				number: i + 1,
				referenceWord: segmentation,
				translation: '',
				analysis: '',
				paradigmClass: pos,
				determinative: '',
				_type: 'SingleMorphAnalysisWithoutEnclitics',
				encliticsAnalysis: undefined,
				selected: false
			};
		}
		analyses.push(ma);
	}
	return analyses;
}

import {MorphologicalAnalysis} from '../../model/morphologicalAnalysis';
import {SelectableLetteredAnalysisOption} from '../../model/analysisOptions';
import {analyze} from './analyze';
import {getGrammaticalMorphemes} from './splitter';

export function updateHurrianAnalysis(oldma: MorphologicalAnalysis, referenceWord: string)
{
	console.log('hur');
	const grammaticalMorphemes = getGrammaticalMorphemes(referenceWord);
	const tags: string[] | null = analyze(grammaticalMorphemes, oldma.paradigmClass);
	if (tags !== null && tags.length > 0)
	{
		if (tags.length == 1)
		{
			return {referenceWord: {$set: referenceWord},
					analysis: {$set: tags[0]},
					encliticsAnalysis: {$set: undefined},
					selected: {$set: false}
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
			return {referenceWord: {$set: referenceWord},
					analysis: {$set: analysisOptions[0].analysis},
					encliticsAnalysis: {$set: undefined}
			};
		}
	}
	else
	{
			return {referenceWord: {$set: referenceWord},
					encliticsAnalysis: {$set: undefined},
					selected: {$set: false}
			};
	}
}

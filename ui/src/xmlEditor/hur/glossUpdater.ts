import {MorphologicalAnalysis, readMorphologicalAnalysis} from '../../model/morphologicalAnalysis';
import {storeGloss} from './glossProvider';
import {getStem} from './splitter';

export function saveGloss(number: number, mrp: string): void
{
	const ma: MorphologicalAnalysis | undefined = readMorphologicalAnalysis(number, mrp, []);
	if (ma !== undefined && ma.translation != '')
	{
		const stem = getStem(ma.referenceWord);
		const pos = ma.paradigmClass;
		storeGloss(stem, pos, ma.translation);
	}
}

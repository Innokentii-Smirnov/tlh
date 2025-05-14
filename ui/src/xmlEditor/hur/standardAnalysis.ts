import {segment, analyze} from './applyFST';
import {MorphologicalAnalysis} from '../../model/morphologicalAnalysis';
import {SelectableLetteredAnalysisOption} from '../../model/analysisOptions';
import {getGrammaticalMorphemes} from './splitter';

// Erstellt morphologische Analysen für Wörter, die im Lexicon fehlen.
// Das unbekannte Wort wird zuerst durch die Funktion "segment" in Morpheme getrennt, möglicherweise auf mehrere verschiedene Weisen.
// Der grammatische Teil der Segmentierung, die Suffixe und Enklitika, werden dann durch "analyze" grammatisch analysiert. Auch hier mehrere Optionen möglich.
// Der Stamm wird an diesem Schritt noch nicht im Wörterbuch nachgeschlagen.
export async function makeStandardAnalyses(transcription: string): Promise<MorphologicalAnalysis[]>
{
	const analyses: MorphologicalAnalysis[] = [];
	const segmentations: string[] = await segment(transcription);
	for (let i = 0; i < segmentations.length; i++)
	{
		const segmentation = segmentations[i];
        if (segmentation !== '+?')
        {
            let ma: MorphologicalAnalysis;
            const morphAnalyses: string[] = await analyze(segmentation);
            for (const morphAnalysis of morphAnalyses)
            {
                let tag: string  = getGrammaticalMorphemes(morphAnalysis);
                if (tag[0] === '-')
                {
                  tag = tag.substring(1);
                }
                ma = {
                    number: i + 1,
                    referenceWord: segmentation,
                    translation: '',
                    analysis: tag,
                    paradigmClass: '',
                    determinative: '',
                    _type: 'SingleMorphAnalysisWithoutEnclitics',
                    encliticsAnalysis: undefined,
                    selected: false
                };
                analyses.push(ma);
            }
        }
	}
	return analyses;
}

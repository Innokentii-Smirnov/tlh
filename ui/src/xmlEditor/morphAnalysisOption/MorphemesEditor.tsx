import {SingleMorphologicalAnalysis} from '../../model/morphologicalAnalysis';

interface IProps {
  morphAnalysis: SingleMorphologicalAnalysis;
}

const sep = /-|=/;

export function MorphemesEditor({morphAnalysis} : IProps) {
  return (
    <div className="segmentation-box">
    {morphAnalysis.referenceWord.split(sep).map((morpheme: string, i:number) => {
      const tags: string[] = morphAnalysis.analysis.split(sep);
      const tag: string = i > 0 ? tags[i - 1] : morphAnalysis.translation;
      return (
        <div key={i.toString()} className="morpheme-box">
          <div className="field-box">
            <input type="text" className="morpheme-input" defaultValue={morpheme}>
            </input>
          </div>
          <div className="field-box">
            <input type="text" className="morpheme-input" defaultValue={tag}>
            </input>
          </div>
        </div>
      );
    })}
    </div>
  );
}
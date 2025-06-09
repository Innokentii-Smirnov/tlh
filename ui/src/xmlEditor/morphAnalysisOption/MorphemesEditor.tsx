interface IProps {
  segmentation: string,
  translation: string,
  analysis: string
}

const sep = /-|=/;

export function MorphemesEditor({segmentation, translation, analysis} : IProps) {
  const morphemes: string[] = segmentation.split(sep);
  const tags: string[] = analysis.split(sep);
  return (
    <div className="segmentation-box">
    {morphemes.map((morpheme: string, i:number) => {
      const tag: string = i > 0 ? tags[i - 1] : translation;
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
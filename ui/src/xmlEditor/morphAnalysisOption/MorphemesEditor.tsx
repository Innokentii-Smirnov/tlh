interface IProps {
  segmentation: string,
  translation: string,
  analysis: string,
  onSegmentationChange: (newSegmentation: string) => void,
  onTranslationChange: (newTranslation: string) => void,
  onAnalysisChange: (newAnalysis: string) => void
}

const sep = /(-|=|\.(?=ABS))/;

function split(segmentation: string): [string, string][] {
  const morphemes: [string, string][] = [];
  const spl = segmentation.split(sep);
  morphemes.push([spl[0], '']);
  for (let i = 1; i < spl.length; i += 2) {
    morphemes.push([spl[i + 1], spl[i]]);
  }
  return morphemes;
}

class Morpheme {
  form: string;
  tag: string;
  boundary: string;
  constructor(form: string, tag: string, boundary: string) {
    this.form = form;
    this.tag = tag;
    this.boundary = boundary;
  }
  getForm(): string {
    if (this.boundary === '.') {
      return '';
    }
    return this.boundary + this.form;
  }
  getTag(): string {
    return this.boundary + this.tag;
  }
}

function makeSegmentation(morphemes: Morpheme[]): string {
  return morphemes.map(morpheme => morpheme.getForm()).join('');
}

function makeAnalysis(morphemes: Morpheme[]): string {
  return morphemes.slice(1).map(morpheme => morpheme.getTag()).join('');
}

function buildMorphemes(segmentation: string, translation: string, analysis: string): Morpheme[] {
  const forms: [string, string][] = split(segmentation);
  const tags: [string, string][] = analysis === '' ? [] : split(analysis);
  const morphemes: Morpheme[] = [];
  let j = tags.length - 1;
  for (let i = forms.length - 1; i >= 0; i--) {
    const form = forms[i][0];
    let tag, boundary;
    if (j >= 0) {
      [tag, boundary] = tags[j];
      if (boundary === '.') {
        const zero = new Morpheme('', tag, boundary);
        morphemes.push(zero);
        j--;
        continue;
      }
    } else if (i === 0) {
      tag = translation;
      boundary = '';
    } else {
      tag = '';
      boundary = '-';
    }
    const morpheme = new Morpheme(form, tag, boundary);
    morphemes.push(morpheme);
    j--;
  }
  return morphemes.reverse();
}

export function MorphemesEditor({
  segmentation, translation, analysis,
  onSegmentationChange, onTranslationChange, onAnalysisChange
} : IProps) {
  const morphemes = buildMorphemes(segmentation, translation, analysis);
  return (
    <div className="segmentation-box">
    {morphemes.map((morpheme: Morpheme, i: number) => {
      return (
        <div key={i.toString()} className="morpheme-box">
          <div className="field-box">
            <input
              type="text"
              className="morpheme-input"
              defaultValue={morpheme.form}
              onChange={(event) => {
                morphemes[i].form = event.target.value;
                onSegmentationChange(makeSegmentation(morphemes));
              }}
            >
            </input>
          </div>
          <div className="field-box">
            <input
              type="text"
              className="morpheme-input"
              defaultValue={morpheme.tag}
              onChange={(event) => {
                morphemes[i].tag = event.target.value;
                if (i == 0) {
                  onTranslationChange(event.target.value);
                }
                else {
                  onAnalysisChange(makeAnalysis(morphemes));
                }
              }}
            >
            </input>
          </div>
        </div>
      );
    })}
    </div>
  );
}
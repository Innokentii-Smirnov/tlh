import { useEffect } from 'react';

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

const kindToBoundary: { [key: string]: string } = {
  'stem': '',
  'zero': '.',
  'suffix': '-',
  'enclitic': '='
};

const boundaryToKind: { [key: string]: string } = {
  '': 'stem',
  '.':'zero',
  '-': 'suffix',
  '=': 'enclitic'
};

class Morpheme {
  form: string;
  tag: string;
  kind: string;
  constructor(form: string, tag: string, kind: string) {
    this.form = form;
    this.tag = tag;
    this.kind = kind;
  }
  getForm(): string {
    if (this.kind === 'zero') {
      return '';
    }
    return kindToBoundary[this.kind] + this.form;
  }
  getTag(position: number): string {
    return this.getTagBoundary(position) + this.tag;
  }
  getTagBoundary(position: number): string {
    if (position === 0 && this.kind === 'suffix') {
      return '';
    }
    return kindToBoundary[this.kind];
  }
}

function makeSegmentation(morphemes: Morpheme[]): string {
  return morphemes.map(morpheme => morpheme.getForm()).join('');
}

function makeAnalysis(morphemes: Morpheme[]): string {
  return morphemes.slice(1).map((morpheme, i) => morpheme.getTag(i)).join('');
}

function buildMorphemes(segmentation: string, translation: string, analysis: string): Morpheme[] {
  const forms: [string, string][] = split(segmentation);
  const tags: [string, string][] = analysis === '' ? []
    : split(analysis);
  const morphemes: Morpheme[] = [];
  let j = tags.length - 1;
  for (let i = forms.length - 1; i >= 0; i--) {
    const [form, boundary] = forms[i];
    let tag: string;
    while (j >= 0 && tags[j][1] === '.') {
      tag = tags[j][0];
      const zero = new Morpheme('', tag, 'zero');
      morphemes.push(zero);
      j--;
    }
    const kind: string = boundaryToKind[boundary];
    if (i === 0) {
      tag = translation;
    } else if (j >= 0) {
      tag = tags[j][0];
    } else {
      tag = '';
    }
    const morpheme = new Morpheme(form, tag, kind);
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
  useEffect(() => onAnalysisChange(makeAnalysis(morphemes)));
  return (
    <div className="segmentation-box">
    {morphemes.map((morpheme: Morpheme, i: number) => {
      return (
        <div key={i.toString()} className="morpheme-box">
          <div className="field-box">
            <select
              className="morpheme-input"
              defaultValue={morpheme.kind}
              onChange={(event) => {
                morphemes[i].kind = event.target.value;
                onSegmentationChange(makeSegmentation(morphemes));
                onAnalysisChange(makeAnalysis(morphemes));
              }}>
              <option value='stem'>Stamm</option>
              <option value='suffix'>Suffix</option>
              <option value='enclitic'>Enklitik</option>
              <option value='zero'>Nullsuf.</option>
            </select>
          </div>
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
import { useEffect } from 'react';

interface IProps {
  segmentation: string,
  translation: string,
  analysis: string,
  onSegmentationChange: (newSegmentation: string) => void,
  onTranslationChange: (newTranslation: string) => void,
  onAnalysisChange: (newAnalysis: string) => void
}

export const sep = /((?<!\()-|-(?!\))|=|\.(?=ABS))/;
const stemFragmentGloss = 'u.B.';

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
  'enclitic': '=',
  'fragment': '-',
  'stemFragment': ''
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
    if (this.kind === 'fragment') {
      return '';
    }
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

function formIsFragment(form: string): boolean {
  return form.includes('[') || form.includes(']') || form.includes('(-)');
}

function kindIsFragment(kind: string): boolean {
  return kind === 'fragment' || kind === 'stemFragment';
}

function morphemeIsFragment(morpheme: Morpheme): boolean {
  return kindIsFragment(morpheme.kind);
}

function removeSuffix(suffix: string, s: string) {
  while(s.endsWith(suffix)) {
    s = s.substring(0, s.length - suffix.length);
  }
  return s;
}

function buildMorphemes(segmentation: string, translation: string, analysis: string): Morpheme[] {
  const forms: [string, string][] = split(segmentation);
  analysis = removeSuffix('-', analysis);
  const tags: [string, string][] = analysis === '' ? []
    : split(analysis);
  const morphemes: Morpheme[] = [];
  let j = tags.length - 1;
  for (let i = forms.length - 1; i >= 0; i--) {
    const [form, boundary] = forms[i];
    if (formIsFragment(form)) {
      let kind, tag: string;
      if (i === 0) {
        kind = 'stemFragment';
        tag = translation;
      } else {
        kind = 'fragment';
        tag = '<fragm>';
      }
      const morpheme = new Morpheme(form, tag, kind);
      morphemes.push(morpheme);
    } else {
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
              value={morpheme.kind}
              onChange={(event) => {
                morphemes[i].kind = event.target.value;
                onSegmentationChange(makeSegmentation(morphemes));
                onAnalysisChange(makeAnalysis(morphemes));
              }}>
              <option value='stem'>Stamm</option>
              <option value='suffix'>Suffix</option>
              <option value='enclitic'>Enklitik</option>
              <option value='zero'>Nullsuf.</option>
              <option value='fragment'>Fragm.</option>
              <option value='stemFragment'>St.-fr.</option>
            </select>
          </div>
          <div className="field-box">
            <input
              type="text"
              className="morpheme-input"
              defaultValue={morpheme.form}
              onChange={(event) => {
                const newForm = event.target.value;
                morphemes[i].form = newForm;
                onSegmentationChange(makeSegmentation(morphemes));
                if (i == 0 && formIsFragment(newForm)) {
                  morphemes[i].tag = stemFragmentGloss;
                  onTranslationChange(stemFragmentGloss);
                }
              }}
            >
            </input>
          </div>
          {!(morpheme.kind === 'fragment') &&
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
          }
        </div>
      );
    })}
    </div>
  );
}
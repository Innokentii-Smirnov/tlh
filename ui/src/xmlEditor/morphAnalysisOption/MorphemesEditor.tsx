interface IProps {
  segmentation: string,
  translation: string,
  analysis: string,
  onSegmentationChange: (newSegmentation: string) => void,
  onTranslationChange: (newTranslation: string) => void,
  onAnalysisChange: (newAnalysis: string) => void
}

const sep = /(-|=)/;

function split(segmentation: string): [string, boolean][] {
  const morphemes: [string, boolean][] = [];
  const spl = segmentation.split(sep);
  morphemes.push([spl[0], false]);
  for (let i = 1; i < spl.length; i += 2) {
    morphemes.push([spl[i + 1], spl[i] === '=']);
  }
  return morphemes;
}

// Returns the position in the string of the morpheme with the required number
function findMorphemeStart(requiredMorphemeNumber: number, segmentation: string): number {
  if (requiredMorphemeNumber == 0) {
    return 0;
  }
  let morphemeNumber = 0;
  for (let i = 0; i < segmentation.length; i++) {
    const char = segmentation[i];
    if (char == '-' || char == '=') {
      morphemeNumber += 1;
    }
    if (morphemeNumber == requiredMorphemeNumber) {
      return i + 1;
    }
  }
  return -1;
}

// Replaces n characters at position i with replacement.
function replaceAt(s: string, i: number, n: number, replacement: string): string {
  return s.substring(0, i) + replacement + s.substring(i + n);
}

// Replaces a morpheme or its annotation
// by newMorpheme (or new annotation)
// in the given position, where positions are counted
// in morphemes (not in characters).
function replaceMorpheme(morpheme: string, newMorpheme: string,
                         segmentation: string, position: number) {
  const morphemeStart = findMorphemeStart(position, segmentation);
  const newSegmentation = replaceAt(segmentation, morphemeStart, morpheme.length, newMorpheme);
  return newSegmentation;
}

function addSep(pair: [string, boolean], posit: number): string {
  const [tag, isEnclitic] = pair;
  if (posit === 0) {
    return tag;
  }
  if (isEnclitic) {
    return '=' + tag;
  }
  return '-' + tag;
}

export function MorphemesEditor({
  segmentation, translation, analysis,
  onSegmentationChange, onTranslationChange, onAnalysisChange
} : IProps) {
  const morphemes = split(segmentation);
  let tags: [string, boolean][] = analysis === '' ? [] : split(analysis);
  if (tags.length < morphemes.length - 1) {
    const front: [string, boolean][] = morphemes
      .slice(1, morphemes.length - tags.length)
      .map(pair => ['', pair[1]]);
    tags = front.concat(tags);
  }
  return (
    <div className="segmentation-box">
    {morphemes.map((pair: [string, boolean], i: number) => {
      const [morpheme, isEnclitic] = pair;
      const tagIndex: number = i - 1;
      const tag: string = (i === 0) ? translation : tags[tagIndex][0];
      return (
        <div key={i.toString()} className="morpheme-box">
          <div className="field-box">
            <input
              type="text"
              className="morpheme-input"
              defaultValue={morpheme}
              onChange={(event) => onSegmentationChange(
                replaceMorpheme(morpheme, event.target.value, segmentation, i)
              )}
            >
            </input>
          </div>
          <div className="field-box">
            <input
              type="text"
              className="morpheme-input"
              defaultValue={tag}
              onChange={(event) => {
                if (i == 0) {
                  onTranslationChange(event.target.value);
                }
                else {
                  let newTags: [string, boolean][] = tags.slice(0, tagIndex);
                  newTags.push([event.target.value, isEnclitic]);
                  if (tagIndex < tags.length - 1) {
                    newTags = newTags.concat(tags.slice(tagIndex + 1));
                  }
                  onAnalysisChange(newTags
                    .map((pair, posit) => addSep(pair, posit))
                    .join(''));
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
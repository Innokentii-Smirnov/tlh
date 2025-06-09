interface IProps {
  segmentation: string,
  translation: string,
  analysis: string,
  onSegmentationChange: (newSegmentation: string) => void,
  onTranslationChange: (newTranslation: string) => void,
  onAnalysisChange: (newAnalysis: string) => void
}

const sep = /-|=/;

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

export function MorphemesEditor({
  segmentation, translation, analysis,
  onSegmentationChange, onTranslationChange, onAnalysisChange
} : IProps) {
  const morphemes: string[] = segmentation.split(sep);
  const tags = analysis.split(sep);
  return (
    <div className="segmentation-box">
    {morphemes.map((morpheme: string, i:number) => {
      const tagIndex: number = i - (morphemes.length - tags.length);
      const tag: string = i > 0 ? tags[tagIndex] : translation;
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
                  const index = i - 1; // Because of the stem, which has no tag
                  let newTags: string[] = tags.slice(0, index);
                  newTags.push(event.target.value);
                  if (index < tags.length - 1) {
                    newTags = newTags.concat(tags.slice(index + 1));
                  }
                  onAnalysisChange(newTags.join('-'));
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
import { normalize } from '../dict/morphologicalAnalysisValidator';
import { readMorphAnalysisValue } from '../morphologicalAnalysis/auxiliary';
import { writeMorphAnalysisValue } from '../../../model/morphologicalAnalysis';

const changes = new Map<string, string>;
const sources = new Map<string, Set<string>>;

export function addChange(source: string, target: string): void {
  const initialSources = sources.get(source);
  if (initialSources === undefined) {
    changes.set(source, target);
    const sourcesSet = new Set<string>();
    sourcesSet.add(source);
    sources.set(target, sourcesSet);
  } else {
    sources.delete(source);
    sources.set(target, initialSources);
    for (const initialSource of initialSources) {
      changes.set(initialSource, target);
    }
  }
}

export function getChanges(): Map<string, string> {
  return changes;
}

export function setChanges(newChanges: Map<string, string>): void {
  for (const [source, target] of newChanges) {
    changes.set(source, target);
  }
}

const pattern = /(?<=mrp\d+=")[^"]+(?=")/g;

function changeAnalysis(analysis: string): string {
  const normalized = normalize(analysis, true);
  if (normalized !== null) {
    const morphologicalAnalysis = readMorphAnalysisValue(normalized);
    if (morphologicalAnalysis !== undefined) {
      const morphAnalysisValue = writeMorphAnalysisValue(morphologicalAnalysis);
      const result = changes.get(morphAnalysisValue);
      if (result !== undefined) {
        return result;
      }
    }
  }
  return analysis;
}

export function applyChanges(text: string): string {
  text = text.replaceAll(pattern, changeAnalysis);
  return text;
}

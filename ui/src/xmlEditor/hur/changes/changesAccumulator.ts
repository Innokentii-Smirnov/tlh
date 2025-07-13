import { normalize } from '../dict/morphologicalAnalysisValidator';
import { readMorphAnalysisValue } from '../morphologicalAnalysis/auxiliary';
import { writeMorphAnalysisValue } from '../../../model/morphologicalAnalysis';

const changes = new Map<string, string>();
const sources = new Map<string, Set<string>>();

export function addChange(source: string, target: string, targetIsExtant: boolean): void {
  // Look up what the original analysis could be derived from
  const initialSources = sources.get(source);
  if (initialSources === undefined) {
    changes.set(source, target);
    const sourcesSet = new Set<string>();
    sourcesSet.add(source);
    if (targetIsExtant) {
      sourcesSet.add(target);
    }
    sources.set(target, sourcesSet);
  } else {
    // The original analysis should no longer be mapped to its own origins because it has been replaced
    sources.delete(source);
    if (targetIsExtant) {
      initialSources.add(target);
    }
    // Save sources for the target
    sources.set(target, initialSources);
    // The original analyses of the given analysis and the given analysis itself are mapped to target 
    for (const initialSource of initialSources) {
      changes.set(initialSource, target);
    }
  }
}

export function getChanges(): Map<string, string> {
  return changes;
}

export function getSources(): Map<string, Set<string>> {
  return sources;
}

export function updateChanges(newChanges: { [key: string]: string }): void {
  for (const [source, target] of Object.entries(newChanges)) {
    changes.set(source, target);
  }
}

export function updateSources(newSources: { [key: string]: string[] }): void {
  for (const [target, sourcesArray] of Object.entries(newSources)) {
    const sourcesSet = new Set<string>();
    for (const source of sourcesArray) {
      sourcesSet.add(source);
    }
    sources.set(target, sourcesSet);
  }
}

const pattern = /(?<=mrp\d+=")[^"]+(?=")|(lnr)="([^"]+)"/g;

export function applyChanges(text: string,
  onChange: (line: string, initialAnalysis: string, result: string) => void): string {
  let line = 'unk';
  const changeAnalysis = (analysis: string, attr: string, lnr: string) => {
    if (attr === 'lnr') {
      line = lnr;
      return analysis;
    }
    const normalized = normalize(analysis, true, false);
    if (normalized !== null) {
      const morphologicalAnalysis = readMorphAnalysisValue(normalized);
      if (morphologicalAnalysis !== undefined) {
        const morphAnalysisValue = writeMorphAnalysisValue(morphologicalAnalysis);
        const result = changes.get(morphAnalysisValue);
        if (result !== undefined) {
          onChange(line, analysis, result);
          return result;
        }
      }
    }
    return analysis;
  };
  text = text.replaceAll(pattern, changeAnalysis);
  return text;
}

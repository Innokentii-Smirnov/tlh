import { formIsFragment } from '../hur/utils';

const sep = /[-=]/;

function haveMatchingNumberOfMorphemes(segmentation: string, analysis: string) {
  return segmentation.split(sep).length === analysis.split(sep).filter(tag => tag !== '.ABS').length + 1;
}

export function isValidForm(form: string): boolean {
  if (formIsFragment(form)) {
    return false;
  }
  return true;
}

export function isValid(analysis: string): boolean {
  const fields: string[] = analysis.split('@').map(field => field.trim());
  if (fields.length !== 5) {
    return false;
  }
  const segmentation = fields[0];
  const gloss = fields[1];
  const morphTag = fields[2];
  if (!isValidForm(segmentation)) {
    return false;
  }
  if (gloss === '' || morphTag === '') {
    return false;
  }
  if (!(morphTag.startsWith('{') && morphTag.endsWith('}'))) {
    if (!haveMatchingNumberOfMorphemes(segmentation, morphTag)) {
      return false;
    }
  }
  return true;
}
function normalizeOption(option: string): string {
  if (option.startsWith('-')) {
    return option.substring(1);
  }
  return option;
}
function normalizePairs(pairs: string[], unify: boolean, segmentation: string): string[][] {
  let result: string[][] = pairs.map((option: string) => option.split('→').map(s => s.trim()));
  if (unify) {
    result = result.filter((pair: string[]) => pair[1] !== '')
      .filter(pair => haveMatchingNumberOfMorphemes(segmentation, pair[1]));
  }
  return result;
}
function normalizeMorphTag(morphTag: string, unify: boolean, segmentation: string): string | null {
  if (morphTag.startsWith('{') && morphTag.endsWith('}')) {
    const options: string[][] = normalizePairs(morphTag
      .substring(1, morphTag.length - 1)
      .replaceAll(' ', '')
      .replaceAll('\n', '')
      .split('}{'), unify, segmentation);
    if (options.length === 0) {
      return null;
    }
    if (unify && options.length === 1) {
      return normalizeOption(options[0][1].trim());
    }
    else {
      return '{' + options
        .map((pair: string[]) => pair[0] + ' → ' + normalizeOption(pair[1]))
        .join('}{') +
      '}';
    }
  } else {
    return normalizeOption(morphTag);
  }
}
export function normalize(analysis: string, unify: boolean): string | null {
  const fields: string[] = analysis.split('@').map(field => field.trim());
  const segmentation = fields[0];
  const morphTag = fields[2];
  const normalized = normalizeMorphTag(morphTag, unify, segmentation);
  if (normalized === null) {
    return null;
  }
  fields[2] = normalized;
  return fields.join(' @ ');
}
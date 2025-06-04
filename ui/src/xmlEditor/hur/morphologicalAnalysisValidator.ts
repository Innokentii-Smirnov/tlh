export function isValid(analysis: string): boolean {
  const fields: string[] = analysis.split('@').map(field => field.trim());
  if (fields.length !== 5) {
    return false;
  }
  const gloss = fields[1];
  const morphTag = fields[2];
  if (gloss === '' || morphTag === '') {
    return false;
  }
  return true;
}
function normalizeOption(option: string): string {
  if (option.startsWith('-')) {
    return option.substring(1);
  }
  return option;
}
function normalizePairs(pairs: string[], unify: boolean): string[][] {
  let result: string[][] = pairs.map((option: string) => option.split('→').map(s => s.trim()));
  if (unify) {
    result = result.filter((pair: string[]) => pair[1] !== '');
  }
  return result;
}
function normalizeMorphTag(morphTag: string, unify: boolean): string {
  if (morphTag.startsWith('{') && morphTag.endsWith('}')) {
    const options: string[][] = normalizePairs(morphTag
      .substring(1, morphTag.length - 1)
      .replaceAll(' ', '')
      .replaceAll('\n', '')
      .split('}{'), unify);
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
export function normalize(analysis: string, unify: boolean): string {
  const fields: string[] = analysis.split('@').map(field => field.trim());
  const morphTag = fields[2];
  fields[2] = normalizeMorphTag(morphTag, unify);
  return fields.join(' @ ');
}
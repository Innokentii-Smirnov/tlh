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
function normalizePairs(pairs: string[]): string[][] {
  return pairs
    .map((option: string) => option.split('→').map(s => s.trim()))
    .filter((pair: string[]) => pair[1] !== '');
}
function normalizeMorphTag(morphTag: string): string {
  if (morphTag.startsWith('{') && morphTag.endsWith('}')) {
    const options: string[][] = normalizePairs(morphTag
      .substring(1, morphTag.length - 1)
      .replaceAll(' ', '')
      .replaceAll('\n', '')
      .split('}{'));
    if (options.length === 1) {
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
export function normalize(analysis: string): string {
  const fields: string[] = analysis.split('@').map(field => field.trim());
  const morphTag = fields[2];
  fields[2] = normalizeMorphTag(morphTag);
  return fields.join(' @ ');
}
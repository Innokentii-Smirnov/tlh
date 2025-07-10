let partsOfSpeech: string[] = [
  'ADV',
  'CONJ',
  'PREP',
  'INTJ',
  'NUM',
  'PRON',
  'INF',
  'CVB',
  'noun',
  'verb',
  'unclear'
];

export function getPartsOfSpeech(): string[] {
  return partsOfSpeech;
}

export function setPartsOfSpeech(value: string[]): void {
  partsOfSpeech = value;
}

const cases = /.*(?:ABS|ERG|GEN|DAT|DIR|ABL|COM|ESS|EQU|ASSOC).*/;
const indeclinable = /\.?(ADV|CONJ|PREP|INTJ).*/;

export function getPos(template: string, morphTag: string | null, translation: string): string
{
  if (translation.includes('PRON')) {
    return 'PRON';
  }
  if (morphTag !== null) {
    const match = morphTag.match(indeclinable);
    if (match) {
      return match[1];
    }
  }
  if (template === '') {
    if (morphTag === 'CVB' || morphTag === 'INF') {
      return 'NF';
    }
    if (morphTag !== null) {
      if (morphTag.includes('PRON')) {
        return 'PRON';
      }
      if (morphTag.match(cases)) {
        return 'noun';
      }
      return 'verb';
    }
    return 'unclear';
  }
  if (template === 'aspect' || template === 'modal' || template === 'voice')
  {
    return 'verb';
  }
  else
  {
    return template;
  }
}
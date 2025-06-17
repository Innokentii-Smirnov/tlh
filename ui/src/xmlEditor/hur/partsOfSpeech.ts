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
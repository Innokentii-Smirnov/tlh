function removeAuxiliarySymbols(word: string): string {
  word = word
    .replaceAll('〈', '')
    .replaceAll('〉', '');
  return word;
}
function removeDiacritics(word: string): string {
  word = word
    .replaceAll('á', 'a')
    .replaceAll('é', 'e')
    .replaceAll('í', 'i')
    .replaceAll('à', 'a')
    .replaceAll('è', 'e')
    .replaceAll('ì', 'i')
    .replaceAll(/[\u2080-\u2089]/g, '');
  return word;
}
function processVowels(word: string): string {
  word = word.replaceAll(/(?<=[aei][[\]?!]?)-ú(?=[[\]?!]?$|-)/g, 'V');
  word = word.replaceAll(/(?<=u[[\]?!]?)-ú(?=[[\]?!]?-[aei])/g, 'V');
  
  // Vokale: kurz
  // NB: Für a gilt diese Regel auch nach i (d. h., in ia-aC -> iaC)
  word = word.replaceAll(/([bdgḫiklmnpqrsṣštwyz])([[\]?!]?)a[?!]?(\]?)-(\[?)[?!]?a([[\]?!]?)([bdgḫklmnpqrsṣštwyz])/g,  '$1$2$3a$4$5$6');
  word = word.replaceAll(/([bdgḫklmnpqrsṣštwyz])([[\]?!]?)e[?!]?(\]?)-(\[?)[?!]?e([[\]?!]?)([bdgḫklmnpqrsṣštwyz])/g,  '$1$2$3e$4$5$6');
  // NB: Für i gilt diese Regel auch vor a (d. h., in Ci-ia -> Cia)
  word = word.replaceAll(/([bdgḫklmnpqrsṣštwyz])([[\]?!]?)i[?!]?(\]?)-(\[?)[?!]?i([[\]?!]?)([abdgḫklmnpqrsṣštwyz])/g,  '$1$2$3i$4$5$6');
  word = word.replaceAll(/([bdgḫklmnpqrsṣštwyz])([[\]?!]?)u[?!]?(\]?)-(\[?)[?!]?[uú]([[\]?!]?)([bdgḫklmnpqrsṣštwyz])/g,  '$1$2$3u$4$5$6');
  
  // neu
  word = word.replaceAll(/([bdgḫklmnpqrsṣštwyz])([[\]?!]?)i[?!]?(\]?)-(\[?)[?!]?e([[\]?!]?)([bdgḫklmnpqrsṣštwyz])/g,  '$1$2$3e$4$5$6');
  word = word.replaceAll(/([bdgḫklmnpqrsṣštwyz])([[\]?!]?)e[?!]?(\]?)-(\[?)[?!]?i([[\]?!]?)([bdgḫklmnpqrsṣštwyz])/g,  '$1$2$3e$4$5$6');
  // Ein o ist möglich, wenn es aus Subskript kommt.
  word = word.replaceAll(/([bdgḫklmnpqrsṣštwyz])([[\]?!]?)o[?!]?(\]?)-(\[?)[?!]?[uú]([[\]?!]?)([bdgḫklmnpqrsṣštwyz])/g,  '$1$2$3o$4$5$6');

  // Vokale: lang
  word = word.replaceAll(/a[?!]?(\]?)-(\[?)a[?!]?(\]?)-(\[?)[?!]?a/g, '$1$2ā$3$4');
  word = word.replaceAll(/[e|i][?!]?(\]?)-(\[?)e[?!]?(\]?)-(\[?)[?!]?[e|i]/g, '$1$2ē$3$4');
  word = word.replaceAll(/[e|i][?!]?(\]?)-(\[?)i[?!]?(\]?)-(\[?)[?!]?i/g, '$1$2ī$3$4');
  word = word.replaceAll(/[uo][?!]?(\]?)-(\[?)u[?!]?(\]?)-(\[?)[?!]?[uú]/g, '$1$2ō$3$4');
  word = word.replaceAll(/u[?!]?(\]?)-(\[?)ú[?!]?(\]?)-(\[?)[?!]?[uú]/g, '$1$2ū$3$4');
    
  word = word.replaceAll(/a[?!]?(\]?)-(\[?)[?!]?a/g, '$1ā$2');
  word = word.replaceAll(/e[?!]?(\]?)-(\[?)[?!]?e/g, '$1ē$2');
  word = word.replaceAll(/i[?!]?(\]?)-(\[?)[?!]?i/g, '$1ī$2');
  word = word.replaceAll(/u[?!]?(\]?)-(\[?)[?!]?u/g, '$1ō$2');
  word = word.replaceAll(/[uú][?!]?(\]?)-(\[?)[?!]?[uú]/g, '$1ū$2');
  //neu
  word = word.replaceAll(/^e(\]?)-(\[?)i/g, '$1ē$2');
  word = word.replaceAll(/^i(\]?)-(\[?)e/g, '$1ī$2');
  word = word.replaceAll(/i(\]?)-(\[?)e(?=[[\]?!]?-)/g, '$1ē$2');
  word = word.replaceAll(/e(\]?)-(\[?)i(?=[[\]?!]?-)/g, '$1ī$2');
    
  
  word = word.replaceAll('ú', 'u');
  
  // zusammengerückte Klammern entfernen
  word = word.replaceAll('[]', '').replaceAll('][', '');
  return word;
}
const voicedCorrelate: { [key: string]: string } = {
  p: 'b',
  t: 'd',
  k: 'g',
  f: 'v',
  s: 'z',
  š: 'ž',
  ḫ: 'ġ',
};
function processConsonants(word: string): string {
  word = word
    .replaceAll('s', 'c')
    .replaceAll('b', 'p')
    .replaceAll('d', 't')
    .replaceAll('g', 'k')
    .replaceAll('w', 'f')
    .replaceAll('z', 's')
    .replaceAll(/(?<=[aeiouāēīōū][[\]]?)[ptkfsšḫ](?=[[\]]?[aeiouāēīōū])/g, (voicelessConsonant: string) => voicedCorrelate[voicelessConsonant])
    .replaceAll(/(?<=[rlmn][[\]]?)[ptkfsšḫ]/g, (voicelessConsonant: string) => voicedCorrelate[voicelessConsonant])
    .replaceAll(/[ptkfsšḫ](?=[[\]]?[rlmn])/g, (voicelessConsonant: string) => voicedCorrelate[voicelessConsonant])
    .replaceAll(/[ptkfsšḫ](?=[[\]]?$)/g, (voicelessConsonant: string) => voicedCorrelate[voicelessConsonant])
    .replaceAll('V', 'w')
    .replaceAll(/(?<=[uū][[\]]?)v/g, 'w')
    .replace('pf', 'ff');
  return word;
}
export function makeBoundTranscription(word: string): string {
  word = removeAuxiliarySymbols(word);
  word = removeDiacritics(word);
  word = processVowels(word);
  word = word.replaceAll(/(?<![x(A-UW-ZŠ\d])-(?![)xA-UW-ZŠ])/g, '');
  word = processConsonants(word);
  return word;
}

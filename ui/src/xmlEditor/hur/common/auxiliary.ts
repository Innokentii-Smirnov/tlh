export function makeGloss(translation: string, tag: string) {
  const gloss = translation + 
    ((tag.startsWith('=') || tag.startsWith('.') || tag === '') ? '' : '-') + tag;
  return gloss;
}

export function removeSuffix(s: string, suffix: string) {
  if (s.endsWith(suffix)) {
    const rest = s.substring(0, s.length - suffix.length);
    if (rest.length > 0) {
      return rest;
    }
  }
  return s;
}

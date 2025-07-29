import { updateMapping } from '../common/utility';

const textToCTHGroup = new Map<string, string>();

fetch('textToCTHGroup.json')
  .then(response => response.json())
  .then(object => updateMapping(textToCTHGroup, object));

const unknown = '(unknown)';

export function getCTH(textName: string): string {
  const cth = textToCTHGroup.get(textName);
  if (cth === undefined) {
    return unknown;
  } else {
    return cth;
  }
}

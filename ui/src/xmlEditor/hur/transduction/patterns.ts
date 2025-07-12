// Hier werden Vorlagen für automatische Morphemtrennung definiert
// Noch unvollständig
const enclitics = '(tta|mma|nna|mē|[td]ill?a?)?([aā]n|mān|ma|n[iī]n)?$';
const nominalRoot = '^(.{3,}?)';
const verbalRoot = '^(.{2,}?)';
const thematicVowel = '([uo](?=ž|ra|nna)|a(?=ne))?';

const noun = new RegExp(
	nominalRoot + 
	'((?:n|(?<=r)r|(?<=l)l)(?:[ei](?!$)|a|(?=[aā])))?' +
	'([aā]ž)?' +
	thematicVowel + 
	'(|ž|ve|va|(?<=[uū])we|(?<=[uū])wa|ta|da|e|a)' +
	'(?:(ne|na)(aš)?(u)?(ž|ve|va|ta|da|e|a)?)?' + 
	enclitics
);

const modal = new RegExp(
	verbalRoot +
	'([ie])' +
	'(l)' + 
	'([aā]nni|[aā][iī])' + 
	enclitics
);

const voice = new RegExp(
	verbalRoot +
	'([aeō]št)?' +
	'([uiīa])(b)?' +
	enclitics
);

const aspect = new RegExp(
	verbalRoot +
	'([aeō]št)?' +
	'([uoō])' +
	'(m)' +
	enclitics
);

export const patterns: {[key: string]: RegExp} = {noun, modal, voice, aspect};

export const firstEnclitics: {[key: string]: number} = 
{
	noun: 9,
	modal: 4,
	voice: 4,
	aspect: 4
};

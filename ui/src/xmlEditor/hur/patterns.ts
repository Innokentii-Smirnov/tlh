const enclitics = '(tta|mma|nna|mē|[td]ill?a?)?([aā]n|mān|ma|n[iī]n)?$';
const nominalRoot = '^(.{3,}?)';
const verbalRoot = '^(.{2,}?)';
const thematicVowel = '([uo](?=ž|ra|nna)|a(?=ne))?';

const noun = new RegExp(
	nominalRoot + 
	'((?:n|(?<=r)r|(?<=l)l)(?:[ei](?!$)|a|(?=[aā])))?' + 
	'([aā]ž)?' +
	thematicVowel + 
	'(|ž|ve|va|ta)' + 
	'(?:(ne|na)(aš)?(u)?(ž|ve|va|ta)?)?' + 
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
	'(u)' +
	enclitics
);

const aspect = new RegExp(
	verbalRoot +
	'([uoō])' +
	'(m)' +
	enclitics
);

export const patterns: {[key: string]: RegExp} = {noun, modal, voice, aspect};

export const firstEnclitics: {[key: string]: number} = 
{
	noun: 9,
	modal: 4,
	voice: 2,
	aspect: 3
};

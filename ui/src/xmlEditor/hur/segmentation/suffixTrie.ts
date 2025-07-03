class Node {
	children: Map<string, Node>;
	final: boolean;
	constructor() {
		this.children = new Map();
		this.final = false;
	}
}
export default class SuffixTrie {
	root: Node;
	constructor() {
		this.root = new Node();
	}
	add(suffix: string) {
		let node: Node = this.root;
		for (let i = suffix.length - 1; i >= 0; i--) {
			const letter = suffix[i];
			let child = node.children.get(letter);
			if (child === undefined) {
				child = new Node();
				node.children.set(letter, child);
			}
			node = child;
		}
		node.final = true;
	}
	getLongestSuffix(word: string): string | null {
		let node: Node = this.root;
		let stop: number | null = null;
		for (let i = word.length - 1; i >= 0; i--) {
			const letter = word[i];
			const child = node.children.get(letter);
			if (child === undefined) {
				break;
			} else if (child.final) {
				stop = i;
			}
			node = child;
		}
		if (stop === null) {
			if (this.root.final) {
				return '';
			} else {
				return null;
			}
		} else {
			return word.substring(stop);
		}
	}
	getAllSuffixes(word: string): string[] {
		let node: Node = this.root;
		const suffixes: string[] = [];
		if (this.root.final) {
			suffixes.push('');
		}
		for (let i = word.length - 1; i >= 0; i--) {
			const letter = word[i];
			const child = node.children.get(letter);
			if (child === undefined) {
				break;
			} else if (child.final) {
				const suffix = word.substring(i);
				suffixes.push(suffix);
			}
			node = child;
		}
		return suffixes;
	}
}

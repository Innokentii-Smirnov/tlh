async function applyFST(fst: string, word: string)
{
	const url = new URL('http://127.0.0.2:8067');
	url.searchParams.set('fst', fst);
	url.searchParams.set('word', encodeURIComponent(word));
    try
    {
      const response = await fetch(url);
      const body = await response.text();
      return body.trim();
    }
    catch (error)
    {
      console.error(error);
      throw error;
    }
}
async function segmentation(word: string)
{
	return applyFST('segmentation', word);
}
async function extendedSegmentation(word: string)
{
	return applyFST('extendedSegmentation', word);
}
export async function segment(word: string)
{
	let result = await segmentation(word);
	if (result === '+?')
	{
		result = await extendedSegmentation(word);
	}
	return result.split('\n').map(x => x.trim());
}
export async function analyze(word: string)
{
	const result = await applyFST('analysis', word);
	return result.split('\n').map(x => x.trim());
}

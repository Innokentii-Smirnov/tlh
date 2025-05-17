export async function fetchFSTGeneratedAnalyses(word: string): Promise<string[]>
{
	const url = new URL('http://127.0.0.2:8067');
	url.searchParams.set('word', encodeURIComponent(word));
    try
    {
      const response = await fetch(url);
      const body = await response.text();
      return body.trim().split('\n').filter(analysis => analysis !== '');
    }
    catch (error)
    {
      console.error(error);
      throw error;
    }
}

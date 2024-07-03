import axios from 'axios';

export async function fetchRandomGif(tag: string): Promise<string> {
  const apiKey = process.env.GIPHY_API_KEY;
  if (!apiKey) {
    throw new Error('GIPHY_API_KEY is not set in environment variables');
  }

  try {
    const response = await axios.get('https://api.giphy.com/v1/gifs/random', {
      params: {
        api_key: apiKey,
        tag: tag,
        rating: 'G',
      },
    });

    if (response.status !== 200) {
      console.error(`Failed to fetch GIF: ${response.statusText}`);
      throw new Error('Failed to fetch GIF');
    }

    const gifUrl = response.data.data.images.original.url;
    return gifUrl;
  } catch (error) {
    console.error('Failed to fetch GIF:', error);
    throw new Error('Failed to fetch GIF');
  }
}

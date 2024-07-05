import axios from 'axios';
import { fetchRandomGif } from '../../src/services/gifService';
import { vi, describe, it, expect, beforeEach } from 'vitest';

vi.mock('axios');

describe('gifService', () => {
  const tag = 'celebration';
  const apiKey = 'test-api-key';
  const gifUrl = 'http://gif.url';

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.GIPHY_API_KEY = apiKey;
  });

  it('should fetch a random GIF with the specified tag', async () => {
    (axios.get as vi.Mock).mockResolvedValueOnce({
      status: 200,
      data: {
        data: {
          images: {
            original: {
              url: gifUrl,
            },
          },
        },
      },
    });

    const result = await fetchRandomGif(tag);

    expect(result).toBe(gifUrl);
    expect(axios.get).toHaveBeenCalledWith(
      'https://api.giphy.com/v1/gifs/random',
      {
        params: {
          api_key: apiKey,
          tag,
          rating: 'G',
        },
      }
    );
  });

  it('should handle errors when fetching a GIF', async () => {
    (axios.get as vi.Mock).mockRejectedValueOnce(new Error('Test error'));

    await expect(fetchRandomGif(tag)).rejects.toThrow('Failed to fetch GIF');
  });

  it('should throw an error if GIPHY_API_KEY is not set', async () => {
    delete process.env.GIPHY_API_KEY;

    await expect(fetchRandomGif(tag)).rejects.toThrow(
      'GIPHY_API_KEY is not set in environment variables'
    );
  });
});

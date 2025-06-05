import { useState, useEffect } from 'react';

interface UseS3ImageOptions {
  refreshInterval?: number; // Time in ms before refreshing URL
  fallbackUrl?: string;
}

export const useS3Image = (imageKey: string | null, options: UseS3ImageOptions = {}) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const { refreshInterval = 3000000, fallbackUrl = '/default-avatar.png' } = options;

  const fetchSignedUrl = async () => {
    try {
      if (!imageKey) {
        setImageUrl(fallbackUrl);
        return;
      }

      const response = await fetch(
        `${process.env.SERVER_URL}/api/users/get-signed-url?key=${imageKey}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (!response.ok) throw new Error('Failed to fetch image URL');
      
      const { url } = await response.json();
      setImageUrl(url);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load image'));
      setImageUrl(fallbackUrl);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSignedUrl();

    // Refresh URL before it expires
    const interval = setInterval(fetchSignedUrl, refreshInterval);
    return () => clearInterval(interval);
  }, [imageKey]);

  return { imageUrl, isLoading, error, refetch: fetchSignedUrl };
};
const API_URL = process.env.SERVER_URL || 'http://localhost:53195';

export const fetchArticle = async (articleId: string) => {
  const response = await fetch(`${API_URL}/api/articles/article?key=${articleId}`);

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('NOT_FOUND');
    }
    throw new Error('Failed to fetch article');
  }

  return response.json();
};

export const fetchArticles = async (page: number = 1, countryCode: string | null) => {
  const params = page ? `page=${page}` : '' + (countryCode ? `&country=${countryCode}` : '');
  const response = await fetch(`${process.env.SERVER_URL}/api/articles?${params}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    console.log('Failed to fetch articles:', response.status, response.statusText);
    throw new Error('Failed to fetch articles');
  }

  return response.json();
};
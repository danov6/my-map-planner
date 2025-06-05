const API_URL = process.env.SERVER_URL || 'http://localhost:53195';

export const fetchArticle = async (articleId: string) => {
  const response = await fetch(`${API_URL}/api/articles/${articleId}`);

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('NOT_FOUND');
    }
    throw new Error('Failed to fetch article');
  }

  return response.json();
};
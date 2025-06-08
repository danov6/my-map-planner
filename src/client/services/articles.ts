import { Article  } from '../../shared/types';

const API_URL = process.env.SERVER_URL || 'http://localhost:53195';

export const fetchArticle = async (articleId: string) => {
  const response = await fetch(`${API_URL}/api/articles/article/${articleId}`);

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
  const response = await fetch(`${API_URL}/api/articles?${params}`, {
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

export const createArticle = async (formData: any, content: string): Promise<any> => {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`${API_URL}/api/articles/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      ...formData,
      content
    })
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('UNAUTHORIZED');
    }
    throw new Error('Failed to create article');
  }

  return response.json();
};
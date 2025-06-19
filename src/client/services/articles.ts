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

export const toggleArticleLike = async (articleId: string): Promise<{ liked: boolean, favoriteTopics: string[] }> => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/api/articles/article/like`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ articleId })
  });

  if (!response.ok) {
    console.log('Failed to toggle article like:', response.status, response.statusText);
    if (response.status === 401) throw new Error('UNAUTHORIZED');
    throw new Error('Failed to toggle article like');
  }

  return response.json();
};

export const updateArticle = async (articleId: string, formData: any): Promise<Article> => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/api/articles/article/${articleId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(formData)
  });

  if (!response.ok) {
    if (response.status === 401) throw new Error('UNAUTHORIZED');
    if (response.status === 403) throw new Error('NOT_AUTHORIZED');
    throw new Error('Failed to update article');
  }

  return response.json();
};

export const fetchUniqueCountries = async (): Promise<string[]> => {
  const response = await fetch(`${API_URL}/api/articles/countries`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch countries');
  }

  const data = await response.json();
  console.log('Map highlighted countries:', data.countries);
  return data.countries;
};

export const fetchArticlesByCountry = async (countryCode: string, page: number = 1): Promise<any> => {
  const response = await fetch(
    `${API_URL}/api/articles/countries/${countryCode}?page=${page}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch country articles');
  }

  return response.json();
};

export const fetchMostViewedArticles = async (country?: string) => {
  const params = new URLSearchParams({
    sortBy: 'views',
    timeRange: '24h',
    viewsOnly: 'true'
  });
  
  if (country) {
    params.append('country', country);
  }

  const response = await fetch(`${API_URL}/api/articles?${params}`);
  if (!response.ok) {
    throw new Error('Failed to fetch most viewed articles');
  }
  return response.json();
};

export const toggleArticleBookmark = async (articleId: string): Promise<any> => {
  const response = await fetch(`${API_URL}/api/articles/article/bookmark`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify({ articleId })
  });

  if (!response.ok) {
    throw new Error('Failed to toggle bookmark');
  }

  return response.json();
};

export const fetchArticlesByTopic = async (topic: string): Promise<Article[]> => {
  const response = await fetch(`${API_URL}/api/articles?topic=${topic}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch topic articles');
  }

  const data = await response.json();
  return data.articles;
};

export const fetchTopics = async (params: Record<string, string>) => {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_URL}/api/articles/topics?${query}`);
  if (!res.ok) throw new Error('Failed to fetch topics');
  return (await res.json()).topics;
};
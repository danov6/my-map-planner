import { Article } from '../../shared/types';

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

interface PaginatedResponse {
  articles: Article[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalArticles: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export const fetchArticles = async (page: number = 1): Promise<PaginatedResponse> => {
  const response = await fetch(`${process.env.SERVER_URL}/api/articles?page=${page}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch articles');
  }

  return response.json();
};
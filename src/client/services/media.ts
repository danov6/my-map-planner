const API_URL = process.env.SERVER_URL || 'http://localhost:53195';

export const uploadImage = async (formData: FormData): Promise<{ imageUrl: string }> => {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`${API_URL}/api/media/images/upload`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });

  if (!response.ok) {
    throw new Error('Failed to upload image');
  }

  return response.json();
};
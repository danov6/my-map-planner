const API_URL = process.env.SERVER_URL || 'http://localhost:53195';

export const loginUser = async (credentials: any) => {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(credentials),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Login failed');
  }

  return data;
};

export const registerUser = async (credentials: any) => {
  const response = await fetch(`${API_URL}/api/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(credentials),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Registration failed');
  }

  return data;
};

export const requestPasswordReset = async (email: string): Promise<void> => {
  const response = await fetch(`${API_URL}/api/auth/forgot-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || 'Password reset request failed');
  }
};

export const verifyResetToken = async (token: string): Promise<{ email: string }> => {
  const response = await fetch(`${API_URL}/api/auth/verify-reset-token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token })
  });

  if (!response.ok) {
    throw new Error('Reset token has expired. Please try again');
  }

  return response.json();
};

export const resetPassword = async (token: string, email: string, password: string): Promise<void> => {
  const response = await fetch(`${API_URL}/api/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, email, password })
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || 'Failed to reset password');
  }
};
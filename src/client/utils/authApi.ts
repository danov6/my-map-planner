interface LoginCredentials {
  email: string;
  password: string;
}

interface SignupCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: {
    email: string;
    firstName?: string;
    lastName?: string;
    profilePicture?: string;
  };
}

interface AuthResponse {
  token: string;
  error?: string;
}

const API_URL = process.env.SERVER_URL || 'http://localhost:53195';

export const loginUser = async (credentials: LoginCredentials): Promise<LoginResponse> => {
    console.log('Attempting to log in with credentials:', credentials);
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
    console.error('Login failed:', data.error || 'Unknown error');
    throw new Error(data.error || 'Login failed');
  }

  return data;
};

export const registerUser = async (credentials: SignupCredentials): Promise<LoginResponse> => {
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
import client from './client';

export const loginUser = async (email, password) => {
  // SimpleJWT defaults to looking for 'username'. 
  // We send both for maximum compatibility with my custom serializer.
  const response = await client.post('/api/auth/login/', {
    email,
    username: email,
    password
  });
  return response.data;
};

export const registerUser = async (userData) => {
  const response = await client.post('/api/auth/register/', userData);
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await client.get('/api/auth/me/');
  return response.data;
};

export const logoutUser = async () => {
  // Django doesn't have a default logout endpoint for JWT unless using blacklist
  return { success: true };
};

export const forgotPassword = async (email) => {
  // Placeholder as backend doesn't have this yet
  return { message: 'Reset link sent' };
};
export const login = loginUser;
export const register = registerUser;
export const logout = logoutUser;
export const me = getCurrentUser;

export const deleteAccount = async () => {
  const response = await client.delete('/api/auth/me/');
  return response.data;
};


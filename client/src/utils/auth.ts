export const BASE_URL = 'https://se-register-api.en.tripleten-services.com/v1';

const checkResponse = async (res: Response) => {
  if (res.ok) {
    return res.json();
  }
  const errorText = await res.text();
  throw new Error(`Error ${res.status}: ${errorText}`);
};

export const register = async (password: string, email: string) => {
  const res = await fetch(`${BASE_URL}/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ password, email })
  });
  return checkResponse(res);
};

export const login = async (password: string, email: string) => {
  const res = await fetch(`${BASE_URL}/signin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ password, email })
  });
  return checkResponse(res);
};

export const checkToken = async (token: string) => {
  const res = await fetch(`${BASE_URL}/users/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
  return checkResponse(res);
};
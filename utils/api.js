/**
 * Client-side API utilities.
 * All authenticated requests automatically attach the stored JWT.
 */

function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('vk_token');
}

async function request(url, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(url, { ...options, headers });

  let data;
  try {
    data = await res.json();
  } catch {
    throw new Error('Invalid server response.');
  }

  if (!res.ok) {
    throw new Error(data?.error || `Request failed (${res.status})`);
  }

  return data;
}

export const api = {
  get:    (url)        => request(url, { method: 'GET' }),
  post:   (url, body)  => request(url, { method: 'POST',   body: JSON.stringify(body) }),
  put:    (url, body)  => request(url, { method: 'PUT',    body: JSON.stringify(body) }),
  delete: (url)        => request(url, { method: 'DELETE' }),
};

export function setToken(token) {
  localStorage.setItem('vk_token', token);
}

export function removeToken() {
  localStorage.removeItem('vk_token');
}

export function isAuthenticated() {
  if (typeof window === 'undefined') return false;
  return Boolean(localStorage.getItem('vk_token'));
}

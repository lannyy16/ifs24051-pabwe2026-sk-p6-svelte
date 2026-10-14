import { apiPost } from '../../helpers/apiHelper.js';
export const loginApi = (email, password) => apiPost('/auth/login', { email, password });
export const registerApi = (name, email, password) => apiPost('/auth/register', { name, email, password });

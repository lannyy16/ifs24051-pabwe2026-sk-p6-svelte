import { apiGet, apiPut, apiPost } from '../../helpers/apiHelper.js';
export const getUsers = () => apiGet('/users');
export const getMyProfile = () => apiGet('/users/me');
export const updateMyProfile = (body) => apiPut('/users/me', body);
export const uploadProfilePhoto = (file) => { const form = new FormData(); form.append('photo', file); return apiPost('/users/me/photo', form); };
export const changePassword = (old_password, new_password) => apiPut('/users/me/password', { old_password, new_password });

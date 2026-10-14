import { writable } from 'svelte/store';
import { setToken } from '../../helpers/apiHelper.js';
export const authUser = writable(null);
export const authLoading = writable(false);
export function saveSession(token, user = null) { setToken(token); authUser.set(user); }
export function logout() { setToken(''); authUser.set(null); }

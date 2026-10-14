import { describe,it,expect,vi,beforeEach } from 'vitest';
import { resolveRoute,navigate,currentPath } from './router.js';
import { get } from 'svelte/store';
describe('router',()=>{
 it('resolves auth and main routes',()=>{expect(resolveRoute('/auth/login').page).toBe('login');expect(resolveRoute('/auth/register').page).toBe('register');expect(resolveRoute('/').page).toBe('home');expect(resolveRoute('/users').page).toBe('users');expect(resolveRoute('/profile').page).toBe('profile')});
 it('resolves detail IDs and query/trailing slash',()=>{expect(resolveRoute('/link-trees/ab%20cd/').linkTreeId).toBe('ab cd');expect(resolveRoute('/?x=1').page).toBe('home')});
 it('returns not-found for unknown paths',()=>{expect(resolveRoute('/nope')).toEqual({layout:'none',page:'not-found'})});
 it('navigates by updating history and store',()=>{const push=vi.spyOn(window.history,'pushState');navigate('/users');expect(push).toHaveBeenCalled();expect(get(currentPath)).toBe('/users')});
 it('supports replace navigation',()=>{const replace=vi.spyOn(window.history,'replaceState');navigate('/auth/login',{replace:true});expect(replace).toHaveBeenCalled()});
});

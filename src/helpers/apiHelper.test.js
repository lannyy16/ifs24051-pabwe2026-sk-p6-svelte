import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { buildUrl, getToken, setToken, apiRequest, apiGet, apiPost, apiPut, apiDelete } from './apiHelper.js';
beforeEach(()=>{localStorage.clear();vi.stubGlobal('fetch',vi.fn())});
afterEach(()=>vi.unstubAllGlobals());
describe('apiHelper',()=>{
 it('stores and clears token',()=>{setToken('abc');expect(getToken()).toBe('abc');setToken('');expect(getToken()).toBe('')});
 it('builds URL with query while omitting empty values',()=>{const url=new URL(buildUrl('/users',{q:'karina',empty:'',no:null,n:2}));expect(url.pathname).toContain('/users');expect(url.searchParams.get('q')).toBe('karina');expect(url.searchParams.get('n')).toBe('2');expect(url.searchParams.has('empty')).toBe(false)});
 it('returns successful payload and sends bearer header',async()=>{setToken('abc');fetch.mockResolvedValue({ok:true,json:async()=>({status:'success',data:{ok:true}})});await expect(apiGet('/users')).resolves.toMatchObject({status:'success'});expect(fetch.mock.calls[0][1].headers.Authorization).toBe('Bearer abc')});
 it('sends JSON body for POST and PUT',async()=>{fetch.mockResolvedValue({ok:true,json:async()=>({status:'success'})});await apiPost('/x',{a:1});await apiPut('/x',{a:2});expect(fetch.mock.calls[0][1].body).toBe('{"a":1}');expect(fetch.mock.calls[1][1].method).toBe('PUT')});
 it('sends DELETE',async()=>{fetch.mockResolvedValue({ok:true,json:async()=>({status:'success'})});await apiDelete('/x');expect(fetch.mock.calls[0][1].method).toBe('DELETE')});
 it('throws for HTTP failure, API failure and malformed JSON',async()=>{fetch.mockResolvedValueOnce({ok:false,status:401,json:async()=>({message:'unauthorized'})});await expect(apiGet('/x')).rejects.toThrow('unauthorized');fetch.mockResolvedValueOnce({ok:true,status:200,json:async()=>({status:'error'})});await expect(apiGet('/x')).rejects.toThrow('Permintaan gagal');fetch.mockResolvedValueOnce({ok:true,status:200,json:async()=>{throw Error('bad')}});await expect(apiGet('/x')).rejects.toThrow('Permintaan gagal')});
 it('sends multipart without JSON content type',async()=>{fetch.mockResolvedValue({ok:true,json:async()=>({status:'success'})});const form=new FormData();form.append('file','a');await apiRequest('/upload',{method:'POST',body:form});expect(fetch.mock.calls[0][1].headers['Content-Type']).toBeUndefined()});
});

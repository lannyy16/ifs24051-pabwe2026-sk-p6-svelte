import { describe,it,expect,vi,beforeEach } from 'vitest';
vi.mock('../../../helpers/apiHelper.js',()=>({apiGet:vi.fn(async(...a)=>a),apiPost:vi.fn(async(...a)=>a),apiPut:vi.fn(async(...a)=>a),apiDelete:vi.fn(async(...a)=>a),apiRequest:vi.fn(async(...a)=>a)}));
import { apiGet,apiPost,apiPut,apiDelete,apiRequest } from '../../../helpers/apiHelper.js';
import { getLinkTrees,getLinkTree,createLinkTree,updateLinkTree,uploadLinkTreeCover,deleteLinkTree,deleteAllLinkTrees,createLinkTreeItem,updateLinkTreeItem,deleteLinkTreeItem } from './linkTreeApi.js';
beforeEach(()=>vi.clearAllMocks());
describe('linkTreeApi',()=>{
 it('gets collections and details',async()=>{await getLinkTrees({q:'a'});await getLinkTree('a/b');expect(apiGet).toHaveBeenNthCalledWith(1,'/link-trees',{q:'a'});expect(apiGet).toHaveBeenNthCalledWith(2,'/link-trees/a%2Fb')});
 it('creates and updates a tree',async()=>{await createLinkTree({title:'x'});await updateLinkTree(1,{title:'y'});expect(apiPost).toHaveBeenCalledWith('/link-trees',{title:'x'});expect(apiPut).toHaveBeenCalledWith('/link-trees/1',{title:'y'})});
 it('uploads cover as multipart',async()=>{const file=new File(['x'],'cover.png');await uploadLinkTreeCover(1,file);const [path,opts]=apiRequest.mock.calls[0];expect(path).toBe('/link-trees/1/cover');expect(opts.method).toBe('POST');expect(opts.body).toBeInstanceOf(FormData)});
 it('deletes one or all trees',async()=>{await deleteLinkTree(3);await deleteAllLinkTrees();expect(apiDelete).toHaveBeenNthCalledWith(1,'/link-trees/3');expect(apiDelete).toHaveBeenNthCalledWith(2,'/link-trees')});
 it('mutates items',async()=>{await createLinkTreeItem(1,{title:'a'});await updateLinkTreeItem(1,2,{title:'b'});await deleteLinkTreeItem(1,2);expect(apiPost).toHaveBeenCalledWith('/link-trees/1/items',{title:'a'});expect(apiPut).toHaveBeenCalledWith('/link-trees/1/items/2',{title:'b'});expect(apiDelete).toHaveBeenCalledWith('/link-trees/1/items/2')});
});

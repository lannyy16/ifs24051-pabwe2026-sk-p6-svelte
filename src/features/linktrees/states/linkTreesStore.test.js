import { describe,it,expect } from 'vitest';
import { get } from 'svelte/store';
import { linkTrees,currentLinkTree,linkTreeLoading,linkTreeMutation,linkTreeCount,setLinkTrees,setCurrentLinkTree,setMutation,resetLinkTrees } from './linkTreesStore.js';
describe('linkTreesStore',()=>{
 it('sets collections and derives count',()=>{setLinkTrees([{id:1},{id:2}]);expect(get(linkTrees)).toHaveLength(2);expect(get(linkTreeCount)).toBe(2);setLinkTrees(null);expect(get(linkTrees)).toEqual([])});
 it('sets current tree',()=>{setCurrentLinkTree({id:4});expect(get(currentLinkTree).id).toBe(4);setCurrentLinkTree(null);expect(get(currentLinkTree)).toBe(null)});
 it('sets known mutation and ignores unknown key',()=>{setMutation('create',true);expect(get(linkTreeMutation).create).toBe(true);setMutation('unknown',true);expect(get(linkTreeMutation).unknown).toBeUndefined()});
 it('resets all state',()=>{setLinkTrees([{id:1}]);setCurrentLinkTree({id:1});setMutation('delete',true);resetLinkTrees();expect(get(linkTrees)).toEqual([]);expect(get(currentLinkTree)).toBe(null);expect(get(linkTreeLoading)).toBe(false);expect(get(linkTreeMutation).delete).toBe(false)});
});

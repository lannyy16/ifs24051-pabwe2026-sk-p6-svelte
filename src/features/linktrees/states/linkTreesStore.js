
import { writable, derived } from 'svelte/store';

export const linkTrees = writable([]);
export const currentLinkTree = writable(null);
export const linkTreeLoading = writable(false);

const initialMutationState = {
  create: false,
  update: false,
  cover: false,
  delete: false,
  deleteAll: false,
  itemCreate: false,
  itemUpdate: false,
  itemDelete: false,
};

export const linkTreeMutation = writable({ ...initialMutationState });
export const linkTreeCount = derived(linkTrees, ($items) => $items.length);

export function setLinkTrees(items) {
  linkTrees.set(Array.isArray(items) ? items : []);
}

export function setCurrentLinkTree(item) {
  currentLinkTree.set(item || null);
}

export function setMutation(name, value) {
  linkTreeMutation.update((state) =>
    Object.hasOwn(state, name)
      ? { ...state, [name]: Boolean(value) }
      : state
  );
}

export function resetLinkTrees() {
  linkTrees.set([]);
  currentLinkTree.set(null);
  linkTreeLoading.set(false);
  linkTreeMutation.set({ ...initialMutationState });
}

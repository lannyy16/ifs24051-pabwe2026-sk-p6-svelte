import {
  apiGet,
  apiPost,
  apiPut,
  apiDelete,
  apiRequest,
} from '../../../helpers/apiHelper.js';

const base = '/link-trees';

export const getLinkTrees = (query = {}) =>
  apiGet(base, query);

export const getLinkTree = (id) =>
  apiGet(`${base}/${encodeURIComponent(id)}`);

export const createLinkTree = (body) =>
  apiPost(base, body);

export const updateLinkTree = (id, body) =>
  apiPut(`${base}/${encodeURIComponent(id)}`, body);

export const uploadLinkTreeCover = (id, file) => {
  const form = new FormData();
  form.append('cover', file);

  return apiRequest(
    `${base}/${encodeURIComponent(id)}/cover`,
    {
      method: 'POST',
      body: form,
    },
  );
};

export const deleteLinkTree = (id) =>
  apiDelete(`${base}/${encodeURIComponent(id)}`);

export const deleteAllLinkTrees = () =>
  apiDelete(base);

export const createLinkTreeItem = (id, body) =>
  apiPost(`${base}/${encodeURIComponent(id)}/items`, body);

export const updateLinkTreeItem = (id, itemId, body) =>
  apiPut(
    `${base}/${encodeURIComponent(id)}/items/${encodeURIComponent(itemId)}`,
    body,
  );

export const deleteLinkTreeItem = (id, itemId) =>
  apiDelete(
    `${base}/${encodeURIComponent(id)}/items/${encodeURIComponent(itemId)}`,
  );
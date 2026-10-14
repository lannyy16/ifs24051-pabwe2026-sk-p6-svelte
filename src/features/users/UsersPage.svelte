<script>
 import { onMount } from 'svelte'; import { getUsers } from './usersApi.js'; import { showErrorDialog } from '../../helpers/toolsHelper.js';
 let users = $state([]); let loading = $state(true);
 onMount(async()=>{try{const r=await getUsers();users=r.data?.users||[]}catch(e){await showErrorDialog(e.message)}finally{loading=false}});
</script>
<h1 class="mb-2 text-3xl font-extrabold">Pengguna</h1><p class="mb-6 text-slate-500">Daftar pengguna yang terdaftar di Delcom.</p>
<div class="panel p-5">{#if loading}<p class="muted">Memuat pengguna...</p>{:else if !users.length}<p class="muted">Belum ada data pengguna.</p>{:else}<div class="divide-y divide-slate-100">{#each users as user (user.id)}<div class="flex items-center gap-3 py-4"><div class="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-700">{(user.name||'U').slice(0,1).toUpperCase()}</div><div><p class="font-bold">{user.name}</p><p class="text-sm text-slate-500">{user.email}</p></div></div>{/each}</div>{/if}</div>

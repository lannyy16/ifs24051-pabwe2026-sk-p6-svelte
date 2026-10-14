<script>
 import { Link2, LayoutDashboard, Users, UserRound, LogOut, ExternalLink } from 'lucide-svelte';
 import { navigate } from '../../../router.js'; import { logout } from '../../auth/authStore.js';
 let { children, path = '/' } = $props();
 function signOut(){logout();navigate('/auth/login')}
 const menu=[{label:'Semua Link Tree',path:'/',icon:LayoutDashboard},{label:'Pengguna',path:'/users',icon:Users},{label:'Profil',path:'/profile',icon:UserRound}];
</script>
<div class="min-h-screen">
<header class="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur"><div class="mx-auto flex max-w-[1400px] items-center justify-between px-5 py-4"><button class="flex items-center gap-3" onclick={()=>navigate('/')}><img src="/logo.svg" alt="" class="h-10 w-10"/><span class="text-lg font-extrabold">Delcom <span class="text-indigo-600">Link Tree</span></span></button><button class="btn btn-muted" onclick={signOut}><LogOut size={17}/> Keluar</button></div></header>
<div class="mx-auto grid max-w-[1400px] gap-6 px-5 py-7 md:grid-cols-[245px_1fr]">
<aside class="panel h-fit p-4"><p class="mb-3 px-3 text-xs font-extrabold uppercase tracking-wider text-slate-400">Menu utama</p>{#each menu as item}<a href={item.path} class:active={path===item.path} class="nav-link" onclick={(e)=>{e.preventDefault();navigate(item.path)}}><svelte:component this={item.icon} size={19}/>{item.label}</a>{/each}<div class="mt-5 rounded-2xl bg-indigo-50 p-4"><Link2 size={21} class="mb-2 text-indigo-600"/><p class="font-bold text-slate-800">Tautan dalam satu tempat</p><p class="mt-1 text-xs leading-5 text-slate-500">Buat halaman tautan untuk dibagikan.</p></div></aside>
<main class="min-w-0">{@render children?.()}</main>
</div><footer class="py-7 text-center text-xs text-slate-400">Delcom Link Tree · Kelola tautanmu dengan mudah</footer></div>

<script>
  import { UserRoundPlus } from 'lucide-svelte';
  import { registerApi } from './authApi.js';
  import { isValidEmail, showErrorDialog, showSuccessDialog } from '../../helpers/toolsHelper.js';
  import { navigate } from '../../router.js';
  let name = $state(''); let email = $state(''); let password = $state(''); let busy = $state(false);
  async function submit(e) {
    e.preventDefault();
    if (!name.trim() || !isValidEmail(email) || password.length < 6) { await showErrorDialog('Nama wajib diisi, email harus valid, dan kata sandi minimal 6 karakter.'); return; }
    busy = true;
    try { await registerApi(name.trim(), email, password); await showSuccessDialog('Akun berhasil dibuat. Silakan masuk.'); navigate('/auth/login'); }
    catch (error) { await showErrorDialog(error.message); }
    finally { busy = false; }
  }
</script>
<div class="mb-6 flex items-center gap-3 md:hidden"><img src="/logo.svg" alt="" class="h-10 w-10"><h1 class="text-xl font-extrabold">Delcom Link Tree</h1></div>
<div class="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-700"><UserRoundPlus size={25}/></div>
<h2 class="text-2xl font-extrabold">Buat akun baru</h2><p class="mb-6 mt-2 text-sm text-slate-500">Mulai rapikan tautanmu di satu tempat.</p>
<form onsubmit={submit} class="space-y-4">
  <label class="block text-sm font-bold">Nama lengkap<input class="field mt-2" bind:value={name} placeholder="Nama kamu" autocomplete="name" required/></label>
  <label class="block text-sm font-bold">Email<input class="field mt-2" type="email" bind:value={email} placeholder="nama@email.com" autocomplete="email" required/></label>
  <label class="block text-sm font-bold">Kata sandi<input class="field mt-2" type="password" bind:value={password} placeholder="Minimal 6 karakter" autocomplete="new-password" minlength="6" required/></label>
  <button class="btn btn-primary w-full" disabled={busy}>{busy ? 'Membuat akun...' : 'Daftar'}</button>
</form>
<p class="mt-6 text-center text-sm text-slate-500">Sudah punya akun? <a class="font-bold text-indigo-600" href="/auth/login" onclick={(e)=>{e.preventDefault();navigate('/auth/login')}}>Masuk</a></p>

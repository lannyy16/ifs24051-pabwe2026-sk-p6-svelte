
<script>
  import { UserRoundPlus } from 'lucide-svelte';
  import { registerApi } from './authApi.js';
  import {
    isValidEmail,
    showErrorDialog,
    showSuccessDialog,
  } from '../../helpers/toolsHelper.js';
  import { navigate } from '../../router.js';

  let name = $state('');
  let email = $state('');
  let password = $state('');
  let busy = $state(false);

  async function submit(event) {
    event.preventDefault();

    if (
      !name.trim() ||
      !isValidEmail(email) ||
      password.length < 6
    ) {
      await showErrorDialog(
        'Nama wajib diisi, email harus valid, dan kata sandi minimal 6 karakter.',
      );
      return;
    }

    busy = true;

    try {
      await registerApi(name.trim(), email, password);
      await showSuccessDialog(
        'Akun berhasil dibuat. Silakan masuk.',
      );
      navigate('/auth/login');
    } catch (error) {
      await showErrorDialog(
        error?.message || 'Pendaftaran gagal. Silakan coba lagi.',
      );
    } finally {
      busy = false;
    }
  }
</script>

<svelte:head>
  <title>Daftar Akun - Delcom Link Tree</title>
  <meta
    name="description"
    content="Buat akun Delcom Link Tree untuk mengatur dan membagikan tautan pentingmu."
  />
</svelte:head>

<main class="w-full" aria-labelledby="register-title">
  <div class="mb-6 flex items-center gap-3 md:hidden">
    <img
      src="/logo.svg"
      alt=""
      class="h-10 w-10"
      width="40"
      height="40"
    />
    <span class="text-xl font-extrabold">
      Delcom Link Tree
    </span>
  </div>

  <div
    class="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-700"
    aria-hidden="true"
  >
    <UserRoundPlus size={25} />
  </div>

  <h1 id="register-title" class="text-2xl font-extrabold">
    Buat akun baru
  </h1>

  <p class="mb-6 mt-2 text-sm text-slate-600">
    Mulai rapikan tautanmu di satu tempat.
  </p>

  <form onsubmit={submit} class="space-y-4">
    <div>
      <label
        for="register-name"
        class="block text-sm font-bold"
      >
        Nama lengkap
      </label>
      <input
        id="register-name"
        class="field mt-2"
        bind:value={name}
        placeholder="Nama kamu"
        autocomplete="name"
        required
      />
    </div>

    <div>
      <label
        for="register-email"
        class="block text-sm font-bold"
      >
        Email
      </label>
      <input
        id="register-email"
        class="field mt-2"
        type="email"
        bind:value={email}
        placeholder="nama@email.com"
        autocomplete="email"
        required
      />
    </div>

    <div>
      <label
        for="register-password"
        class="block text-sm font-bold"
      >
        Kata sandi
      </label>
      <input
        id="register-password"
        class="field mt-2"
        type="password"
        bind:value={password}
        placeholder="Minimal 6 karakter"
        autocomplete="new-password"
        minlength="6"
        required
      />
    </div>

    <button
      class="btn btn-primary w-full"
      type="submit"
      disabled={busy}
    >
      {busy ? 'Membuat akun...' : 'Daftar'}
    </button>
  </form>

  <p class="mt-6 text-center text-sm text-slate-600">
    Sudah punya akun?
    <a
      class="font-bold text-indigo-700"
      href="/auth/login"
      onclick={(event) => {
        event.preventDefault();
        navigate('/auth/login');
      }}
    >
      Masuk
    </a>
  </p>
</main>

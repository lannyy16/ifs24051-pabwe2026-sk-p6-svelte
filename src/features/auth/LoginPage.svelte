
<script>
  import { Link2 } from 'lucide-svelte';
  import { loginApi } from './authApi.js';
  import { saveSession } from './authStore.js';
  import {
    isValidEmail,
    showErrorDialog,
  } from '../../helpers/toolsHelper.js';
  import { navigate } from '../../router.js';

  let email = $state('');
  let password = $state('');
  let busy = $state(false);

  async function submit(event) {
    event.preventDefault();

    if (!isValidEmail(email) || !password) {
      await showErrorDialog(
        'Masukkan email yang valid dan kata sandi.',
      );
      return;
    }

    busy = true;

    try {
      const result = await loginApi(email, password);
      const data = result?.data || {};

      const token =
        data.token ||
        data.access_token ||
        data.accessToken;

      if (!token) {
        throw new Error(
          'Token login tidak ditemukan pada respons API.',
        );
      }

      saveSession(token, data.user || null);
      navigate('/');
    } catch (error) {
      await showErrorDialog(
        error?.message || 'Login gagal. Silakan coba lagi.',
      );
    } finally {
      busy = false;
    }
  }
</script>

<main class="w-full" aria-labelledby="login-title">
  <div class="mb-6 flex items-center gap-3 md:hidden">
    <img
      src="/logo.svg"
      alt="Logo Delcom Link Tree"
      class="h-10 w-10"
    />
    <span class="text-xl font-extrabold">
      Delcom Link Tree
    </span>
  </div>

  <div
    class="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-700"
    aria-hidden="true"
  >
    <Link2 size={25} />
  </div>

  <h1 id="login-title" class="text-2xl font-extrabold">
    Selamat datang kembali
  </h1>

  <p class="mb-6 mt-2 text-sm text-slate-600">
    Masuk untuk mengelola kumpulan tautanmu.
  </p>

  <form onsubmit={submit} class="space-y-4">
    <div>
      <label
        for="login-email-input"
        class="block text-sm font-bold"
      >
        Email
      </label>

      <input
        id="login-email-input"
        class="field mt-2 w-full"
        type="email"
        bind:value={email}
        placeholder="nama@email.com"
        autocomplete="email"
        required
      />
    </div>

    <div>
      <label
        for="login-password-input"
        class="block text-sm font-bold"
      >
        Kata sandi
      </label>

      <input
        id="login-password-input"
        class="field mt-2 w-full"
        type="password"
        bind:value={password}
        placeholder="Masukkan kata sandi"
        autocomplete="current-password"
        required
      />
    </div>

    <button
      id="login-submit-button"
      class="btn btn-primary w-full"
      type="submit"
      disabled={busy}
    >
      {busy ? 'Memproses...' : 'Masuk'}
    </button>
  </form>

  <p class="mt-6 text-center text-sm text-slate-600">
    Belum punya akun?
    <a
      class="font-bold text-indigo-700"
      href="/auth/register"
      onclick={(event) => {
        event.preventDefault();
        navigate('/auth/register');
      }}
    >
      Daftar sekarang
    </a>
  </p>
</main>

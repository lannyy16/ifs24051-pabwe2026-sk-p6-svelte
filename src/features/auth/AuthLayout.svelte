
<script>
  import { Link2, Sparkles } from 'lucide-svelte';

  let { children } = $props();
</script>

<div
  class="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-violet-50 px-5 py-10"
>
  <main
    id="main-content"
    class="mx-auto grid min-h-[80vh] max-w-5xl items-center gap-10 md:grid-cols-2"
  >
    <section class="hidden md:block" aria-labelledby="auth-heading">
      <div class="mb-6 flex items-center gap-3">
        <img
          src="/logo.svg"
          alt=""
          width="48"
          height="48"
          class="h-12 w-12"
        />
        <span class="text-2xl font-extrabold">
          Delcom Link Tree
        </span>
      </div>

      <span class="badge mb-4">
        <Sparkles size={14} class="mr-1 inline" aria-hidden="true" />
        Satu halaman, semua tautan
      </span>

      <h2
        id="auth-heading"
        class="mb-4 text-5xl font-extrabold leading-tight"
      >
        Bagikan hal pentingmu dengan lebih mudah.
      </h2>

      <p class="max-w-md text-lg leading-8 text-slate-600">
        Susun kumpulan tautan sosial media, portofolio, dan karya
        dalam satu halaman yang rapi.
      </p>

      <div class="mt-8 flex gap-3 text-indigo-700">
        <Link2 size={25} aria-hidden="true" />
        <span class="font-bold">
          Semua tautanmu, satu tempat.
        </span>
      </div>
    </section>

    <section
      class="panel p-7 md:p-9"
      aria-label="Formulir autentikasi"
    >
      {@render children?.()}
    </section>
  </main>
</div>

<script>
  import { Link2, Sparkles } from 'lucide-svelte';
  let { children } = $props();
</script>
<div class="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-violet-50 px-5 py-10">
  <div class="mx-auto grid min-h-[80vh] max-w-5xl items-center gap-10 md:grid-cols-2">
    <div class="hidden md:block">
      <div class="mb-6 flex items-center gap-3"><img src="/logo.svg" alt="Delcom Link Tree" class="h-12 w-12"><span class="text-2xl font-extrabold">Delcom Link Tree</span></div>
      <span class="badge mb-4"><Sparkles size={14} class="mr-1 inline"/> Satu halaman, semua tautan</span>
      <h1 class="mb-4 text-5xl font-extrabold leading-tight">Bagikan hal pentingmu dengan lebih mudah.</h1>
      <p class="max-w-md text-lg leading-8 text-slate-600">Susun kumpulan tautan sosial media, portofolio, dan karya dalam satu halaman yang rapi.</p>
      <div class="mt-8 flex gap-3 text-indigo-600"><Link2 size={25}/><span class="font-bold">Semua tautanmu, satu tempat.</span></div>
    </div>
    <div class="panel p-7 md:p-9">{@render children?.()}</div>
  </div>
</div>

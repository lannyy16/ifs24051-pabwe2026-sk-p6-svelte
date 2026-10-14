<script>
  let { title = 'Form', onClose = () => {}, children } = $props();
</script>
<div class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4" role="presentation" onclick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
  <section class="panel w-full max-w-lg p-6" role="dialog" aria-modal="true" aria-label={title}>
    <div class="mb-5 flex items-center justify-between"><h2 class="text-xl font-extrabold">{title}</h2><button class="btn btn-muted" aria-label="Tutup modal" onclick={onClose}>✕</button></div>
    {@render children?.()}
  </section>
</div>

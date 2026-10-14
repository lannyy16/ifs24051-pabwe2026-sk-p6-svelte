<script>
 let { onClose, onSave } = $props(); let file=$state(null);
 async function submit(e){e.preventDefault();if(file)await onSave(file)}
</script>
<form class="space-y-4" onsubmit={submit}><label class="block text-sm font-bold">Pilih sampul<input class="field mt-2" type="file" accept="image/*" required onchange={(e)=>file=e.currentTarget.files?.[0]||null}/></label><div class="flex justify-end gap-2"><button type="button" class="btn btn-muted" onclick={onClose}>Batal</button><button class="btn btn-primary" disabled={!file}>Unggah sampul</button></div></form>

<script lang="ts">
import CodeMirror from '$lib/CodeMirror.svelte'
import MarkdownPreview from '$lib/MarkdownPreview.svelte'
import { ToastMark } from '$lib/toastmark';
import { Renderer } from '$lib/toastmark/html/renderer';


/** @type {import('./$types').PageData} */
export let data;
export let yjsHost = (location.protocol == "https:" ? "wss" : "ws") + "://" + location.host
</script>
{#if data.mode == "edit"}
  <CodeMirror yjsHost={yjsHost} yjsName={data.name || "/"} />
{:else}
  <MarkdownPreview yjsHost={yjsHost} yjsName={data.name || "/"} />
{/if}

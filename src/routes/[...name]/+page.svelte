<script lang="ts">
import CodeMirror from '$lib/CodeMirror.svelte'
import MarkdownPreview from '$lib/MarkdownPreview.svelte'
import { ToastMark } from '$lib/toastmark';
import { Renderer } from '$lib/toastmark/html/renderer';


/** @type {import('./$types').PageData} */
export let data;
</script>

<h1>{JSON.stringify(data)}</h1>
{#if data.mode == "edit"}
  <CodeMirror yjsHost="ws://192.168.130.104:1234" yjsName="my-roomname"/>
{:else}
  <MarkdownPreview yjsHost="ws://192.168.130.104:1234" yjsName="my-roomname"/>
{/if}

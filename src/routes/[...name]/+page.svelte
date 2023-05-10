<script lang="ts">
import CodeMirror from '$lib/CodeMirror.svelte'

/** @type {import('./$types').PageData} */
export let data;
</script>

<h1>{JSON.stringify(data)}</h1>
{#if data.mode == "edit"}
<CodeMirror yjsHost="ws://192.168.130.104:1234" yjsName="my-roomname"/>
{/if}

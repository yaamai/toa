<script lang="ts">
import CodeMirror from './CodeMirror.svelte'
export let params = {}
console.log(params)

</script>

<CodeMirror yjsHost="ws://192.168.130.104:1234" yjsName={params.wild}/>

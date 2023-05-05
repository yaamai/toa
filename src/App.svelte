<script lang="ts">
  import Router from 'svelte-spa-router'
  import Page from './Page.svelte'

  const routes = {
    '/*': Page,
  }

//  <CodeMirror yjsHost="ws://192.168.130.104:1234" yjsName="my-roomname"/>
</script>

<main>
  <Router {routes}/>
</main>

<script>
  import { onMount, createEventDispatcher } from 'svelte';
  import { basicSetup, EditorView } from 'codemirror';
  import { vim } from "@replit/codemirror-vim"

  import * as Y from 'yjs'
  import { yCollab } from 'y-codemirror.next'
  import { WebsocketProvider } from 'y-websocket'


  const doc = new Y.Doc()
  const wsProvider = new WebsocketProvider('ws://192.168.130.104:1234', 'my-roomname', doc)
  const ytext = doc.getText('body')
  const undoManager = new Y.UndoManager(ytext)

  const dispatch = createEventDispatcher()

  onMount(() => {
    const minHeightEditor = EditorView.theme({
      ".cm-content, .cm-gutter": {minHeight: "100vh"}
    })
/*
      ".cm-editor .cm-content, .cm-editor .cm-gutter": { minHeight: "200px" },
      ".cm-scrollbar": { overflow: "auto" },
      "&": {width: "100%"},
      ".cm-content, .cm-gutter": {minHeight: "100"}
*/
      // "&": {width: "calc(100vw - (100vw - 100%))"},

    let view = new EditorView({
      doc: ytext.toString(),
      extensions: [
        vim(), 
        basicSetup, 
		minHeightEditor,
        yCollab(ytext, wsProvider.awareness, { undoManager })
      ],
      parent: document.querySelector('.editor'),
    })

  })


  /*
  // exported for scroll sync
  export let cm: any = null
  let self: HTMLElement

  onMount(() => {
    // CodeMirror 5.x does not support esm, snowpack can't handle imports properly.
    let opt = {
      mode: 'markdown',
      keyMap: 'vim',
      theme: 'wiki',
      lineNumbers: true,
    }
    cm = window.CodeMirror(self, opt);
    cm.on('change', (_: any, change: any) => dispatch('change', change))
    cm.on('scroll', () => dispatch('scroll'))
  })
*/

</script>

<div class="editor"></div>

<style>
</style>


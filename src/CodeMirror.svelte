<script>
  import { onMount } from 'svelte';
  import { basicSetup, EditorView } from 'codemirror';

  // for vim key binding
  import { vim } from "@replit/codemirror-vim"

  // for yjs
  import * as Y from 'yjs'
  import { yCollab } from 'y-codemirror.next'
  import { WebsocketProvider } from 'y-websocket'

  // prepare default params
  let self = undefined
  let doc = ""
  let extensions = [
    basicSetup,
    EditorView.theme({
      ".cm-content, .cm-gutter": {minHeight: "100vh"}
    })
  ]

  // enable keymap extension
  export let keymap = "vim"
  if (keymap == "vim") {
      extensions.splice(0, 0, vim())
  }

  // initialize yjs connection
  export let yjsHost = undefined
  export let yjsName = undefined
  if (yjsHost && yjsName) {
    const ydoc = new Y.Doc()
    const wsProvider = new WebsocketProvider(yjsHost, yjsName, ydoc)
    const ytext = ydoc.getText('body')
    const undoManager = new Y.UndoManager(ytext)

    doc = ytext.toString()
    extensions.push(yCollab(ytext, wsProvider.awareness, { undoManager }))
  }

  onMount(() => {
    let view = new EditorView({
      doc: doc,
      extensions: extensions,
      parent: self,
    })

    view.focus()
  })
</script>

<div bind:this={self}></div>

<script lang="ts">
  import { ToastMark } from './toastmark';
  import { Renderer } from './toastmark/html/renderer';
  import type { Node } from './toastmark/commonmark/node';
  import type { Change } from '$lib/utils.ts';
  import { delta2ChangeObj } from '$lib/utils.ts'

  // for yjs
  import * as Y from 'yjs'
  import { WebsocketProvider } from "/node_modules/y-websocket/src/y-websocket.js";

  const renderer = new Renderer({ gfm: true, nodeId: true });

  // exported for scroll sync
  export let parser = new ToastMark();
  export let self: HTMLElement = null;

  export function refresh(changeObj: Change) {
      console.log(changeObj)
      const { from, to, text } = changeObj;
      const changed = parser.editMarkdown(
          [from.line + 1, from.ch + 1],
          [to.line + 1, to.ch + 1],
          text.join('\n')
      );

      changed.forEach((result) => {
          const { nodes, removedNodeRange } = result;
          const html = renderer.render(parser.getRootNode());

          if (!removedNodeRange) {
              self.innerHTML = html;
              return
          }

          const [startNodeId, endNodeId] = removedNodeRange.id;
          const startEl = self.querySelector(`[data-nodeid="${startNodeId}"]`);
          const endEl = self.querySelector(`[data-nodeid="${endNodeId}"]`);
          const newHtml = nodes.map((node: Node) => renderer.render(node)).join('');

          // insert html to beforebgin and remove old elements(startEl to endEl)?
          if (startEl) {
              startEl.insertAdjacentHTML('beforebegin', newHtml);
             
              let el = startEl;
              while (el !== endEl) {
                  const nextEl = el.nextElementSibling;
                  el.remove();
                  el = nextEl;
              }
              el.remove();
          }

          if (!nodes.length) {
              return;
          }
      })
  }

  // initialize yjs connection
  export let yjsHost = undefined
  export let yjsName = undefined
  if (yjsHost && yjsName) {
    const ydoc = new Y.Doc()
    const wsProvider = new WebsocketProvider(yjsHost, yjsName, ydoc)
    const ytext = ydoc.getText('body')
    const undoManager = new Y.UndoManager(ytext)

  let rowLenList: number[] = []

    function handleChange(event) {
        console.log(event)
        let [changeObj, _] = delta2ChangeObj(rowLenList, event.delta, (...e: any) => {console.log(...e)})
        changeObj.forEach((e: Change) => refresh(e))
    }
    ytext.observe(handleChange)
  }

</script>

<svelte:options accessors={true}/>
<div class="markdown-body" bind:this={self}></div>

<style>
  div {
    overflow: auto;
    border-radius: 0.4em;
    padding: 1em;
  }

  /* fix task list item in markdown preview */
  div :global(label) {
    display: block;
  }
  
  div :global(label > p) {
    display: inline-block;
  }

  div :global(label) {
    display: grid;
    grid-template-columns: 1em auto;
    gap: 0.5em;
  }

  div :global(input[type="checkbox"]) {
    /* Remove most all native input styles */
    appearance: none;
    /* For iOS < 15 */
    background-color: var(--form-background);
    /* Not removed via appearance */
    margin: 0;
    margin-top: 0.3em;
  
    font: inherit;
    color: currentColor;
    width: 1.15em;
    height: 1.15em;
    border: 0.15em solid currentColor;
    border-radius: 0.15em;
    transform: translateY(-0.075em);
  
    display: grid;
    place-content: center;
  }

  div :global(input[type="checkbox"]::before) {
    content: "";
    width: 0.65em;
    height: 0.65em;
    clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
    transform: scale(0);
    transform-origin: bottom left;
    transition: 120ms transform ease-in-out;
    box-shadow: inset 1em 1em var(--form-control-color);
    /* Windows High Contrast Mode */
    background-color: CanvasText;
  }
  
  div :global(input[type="checkbox"]:checked::before) {
    transform: scale(1);
  }
</style>

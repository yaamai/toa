import * as path from 'path'
import express from 'express'
import ws from 'ws'
import * as http from 'http'

import { setupWSConnection } from './utils.js'

const host = process.env.HOST || 'localhost'
const port = process.env.PORT || 1234
const assets = process.env.ASSETS || 'build'

const app = express();

app.use("/", express.static(assets));
app.get('*', function (request, response) {
  response.sendFile(path.resolve(assets, 'index.html'));
});

const wss = new ws.Server({ noServer: true })
wss.on('connection', setupWSConnection)

const server = app.listen(port);
process.on('SIGTERM', () => {
  server.close(() => {
    console.log('HTTP server closed')
  })
})
process.on('SIGINT', () => {
  server.close(() => {
    console.log('HTTP server closed')
  })
})

server.on('upgrade', (request, socket, head) => {
    console.log("upgrade")
  // You may check auth of request here..
  // See https://github.com/websockets/ws#client-authentication
  /**
   * @param {any} ws
   */
  const handleAuth = ws => {
    wss.emit('connection', ws, request)
  }
  wss.handleUpgrade(request, socket, head, handleAuth)
})

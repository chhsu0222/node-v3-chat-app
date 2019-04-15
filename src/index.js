const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')

const app = express()
// create the server outside of the Express library
// and configure it to use our Express app.
const server = http.createServer(app)
// initialize a new instance of socket.io by passing the HTTP server object.
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

// listen on the connection event for incoming sockets
io.on('connection', () => {
    console.log('New Websocket connection')
})

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})

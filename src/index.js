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

let count = 0
// listen on the connection event for incoming sockets
io.on('connection', (socket) => { 
    // socket contains information about that new connection
    // We can use methods on socket to communicate with that
    // specific client.
    // If we have 5 clients connecting to the server, this callback
    // function is going to run 5 different times, one time for each
    // connection.
    console.log('New Websocket connection')

    socket.emit('countUpdated', count)

    socket.on('increment', () => {
        count++
        // emit event to that specific connection
        // socket.emit('countUpdated', count)

        // Broadcasting - send an event to everyone
        io.emit('countUpdated', count)
    })
})

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})

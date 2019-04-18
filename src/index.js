const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage, generateLocationMessage } = require('./utils/messages')
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users')

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
io.on('connection', (socket) => { 
    // socket contains information about that new connection
    // We can use methods on socket to communicate with that
    // specific client.
    // If we have 5 clients connecting to the server, this callback
    // function is going to run 5 different times, one time for each
    // connection.
    console.log('New Websocket connection')

    socket.on('join', (options, callback) => {
        // Every single connection to the server has a unique ID generated for it.
        const { error, user } = addUser({ id: socket.id, ...options })

        if (error) {
            return callback(error)
        }

        // Using the trimed username and room
        socket.join(user.room)
        socket.emit('message', generateMessage('Admin', 'Welcome!'))
        // send a message to everyone in the room except for this socket
        socket.broadcast.to(user.room).emit('message', generateMessage('Admin', `${user.username} has joined!`))

        callback()
    })

    socket.on('sendMessage', (message, callback) => {
        const filter = new Filter()

        if (filter.isProfane(message)) {
            return callback('Profanity is not allowed!')
        }

        const user = getUser(socket.id)
        io.to(user.room).emit('message', generateMessage(user.username, message))
        // acknowledgement
        callback()
    })

    socket.on('sendLocation', (coords, callback) => {
        const user = getUser(socket.id)
        io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, `https://google.com/maps?q=${coords.latitude},${coords.longitude}`))

        // acknowledgement
        callback()
    })
    // Each socket fires a special disconnect event
    // when the browser tab is closed
    socket.on('disconnect', () => {
        const user = removeUser(socket.id)

        // Maybe user was not added successfully
        if (user) {
            io.to(user.room).emit('message', generateMessage('Admin', `${user.username} has left!`))
        }
    })
})

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})

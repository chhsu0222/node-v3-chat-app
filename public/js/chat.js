const socket = io()
const form = document.querySelector('#message-form')
const input = document.querySelector('#message-input')

socket.on('message', (message) => {
    console.log(message)
})

form.addEventListener('submit', (event) => {
    event.preventDefault()

    const message = input.value

    socket.emit('sendMessage', message)
})

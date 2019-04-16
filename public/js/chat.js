const socket = io()
const form = document.querySelector('#message-form')
const input = document.querySelector('#message-input')
const locationButton = document.querySelector('#send-location')

socket.on('message', (message) => {
    console.log(message)
})

form.addEventListener('submit', (event) => {
    event.preventDefault()

    const message = input.value

    socket.emit('sendMessage', message)
})

locationButton.addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser.')
    }

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        })
    })
})

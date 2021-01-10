import React, { useState, useEffect } from 'react'
import queryString from 'query-string'
import io from 'socket.io-client'

let socket

function Chat({ location }) {

    const [name, setName] = useState('')
    const [room, setRoom] = useState('')
    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState([])
    const ENDPOINT = 'http://localhost:5000'

    useEffect(() => {
        const { name, room } = queryString.parse(location.search)
        socket = io(ENDPOINT)
        setName(name)
        setRoom(room)

        socket.emit('join', { name, room })

        return () => {
            socket.emit('disconnected')
            socket.off()
        }
    }, [ENDPOINT, location.search])

    useEffect(() => {
        socket.on('message', (message) => {
            setMessages([...messages, message])
        })
    }, [messages])

    const sendMessage = (e) => {

        if (message) {
            socket.emit('sendMessage', message, () => {
                setMessage('')
            })
        }
    }

    console.log(message, messages)
    return (
        <div>
            <div className="messagesContainer">
                {
                    messages.map((m) => {
                        return <div>{m.user + " : " + m.text}</div>
                    })
                }
            </div>
            <input type='text' onChange={(e) => setMessage(e.target.value)} />
            <button type='submit' onClick={(e) => sendMessage(e)}>Send</button>
        </div>
    )
}

export default Chat

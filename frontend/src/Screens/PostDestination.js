import { React, useState } from 'react'
import { useHistory } from 'react-router-dom'

function PostDestination() {


    const history = useHistory()
    const [destination, setDestination] = useState('')
    const [description, setDescription] = useState('')
    const [age, setAge] = useState()
    const [coo, setCoo] = useState('')
    const [url, setUrl] = useState('')

    const clicked = () => {

        // fetch('http://localhost:5000/api/test/dest_send', {
        //     method: "POST",
        //     header: {
        //         "Content-Type": "application/json",
        //         "x-auth-token": localStorage.getItem('jwt')
        //     },
        //     body: JSON.stringify({ destination: destination })
        // }).then((res) => res.json())
        //     .then((res) => {
        //         console.log(res)
        //     }).catch(err => console.log(err))

        fetch('http://localhost:5000/api/posts', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-auth-token": localStorage.getItem('jwt'),
                "privatekey" : (JSON.parse(localStorage.getItem('user')).privateKey).toString()
            },
            body: JSON.stringify({
                destination, description, age, coo, image_url: url
            })
        })
            .then((res) => res.json())
            .then(res => {
                if (res.err) {
                    alert('asfdalfk')
                }
                console.log(res)
                history.push('/home')
            })
            .catch(err => console.log(err))
    }

    const style = {
        margin: '40px auto',
        maxWidth: '600px',
        borderRadius: '10px',
        padding: '30px',
        textAlign: 'left',
        backgroundColor: '#444',
        color: 'white'
    }
    return (
        <div>
            <div className='card' style={style}>
                <h2 style={{ textAlign: "center", color: "white" }}>Let the world know</h2>
                <h5>Your Dream Destination</h5>
                <input style={{ color: "white" }} type="text" placeholder='Name' value={destination} onChange={(e) => { setDestination(e.target.value) }}></input>
                <input style={{ color: "white" }} type="text" placeholder='Description' value={description} onChange={(e) => { setDescription(e.target.value) }}></input>
                <input style={{ color: "white" }} type="text" placeholder='Age' pattern="[0-9]*" value={age} onChange={(e) => { setAge(e.target.value) }}></input>
                <input style={{ color: "white" }} type="text" placeholder='Country of Origin' value={coo} onChange={(e) => { setCoo(e.target.value) }}></input>
                <input style={{ color: "white" }} type="text" placeholder='Valid Image URL' value={url} onChange={(e) => { setUrl(e.target.value) }}></input><br /><br />
                <button onClick={() => clicked()} className="waves-effect waves-light btn">Post!</button><br /><br />
            </div>
        </div>
    )
}

export default PostDestination

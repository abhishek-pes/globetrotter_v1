import { React, useState } from 'react'
import { useHistory } from 'react-router-dom'

function PostDestination() {


    const history = useHistory()
    const [destination, setDestination] = useState('')
    const [description, setDescription] = useState('')
    const [url, setUrl] = useState('')

    const clicked = () => {
        fetch('http://localhost:5000/api/posts', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-auth-token": localStorage.getItem('jwt')
            },
            body: JSON.stringify({
                destination, description, image_url: url
            })
        })
            .then((res) => res.json())
            .then(res => {
                console.log(res)
                history.push('/home')
            })
            .catch(err => console.log(err))
    }

    const style = {
        textAlign: 'center',
        margin: '40px auto',
        maxWidth: '600px',
        borderRadius: '10px',
        padding: '30px',
        textAlign: 'left',
        backgroundColor: '#080004',
        color: 'white'
    }
    return (
        <div>
            <div className='card' style={style}>
                <h2 style={{ textAlign: "center", color: "#12BDA6" }}>Let the world know</h2>
                <h5>Your Dream Destination</h5>
                <input type="text" placeholder='Name' value={destination} onChange={(e) => { setDestination(e.target.value) }}></input>
                <input type="text" placeholder='Description' value={description} onChange={(e) => { setDescription(e.target.value) }}></input>
                <input type="text" placeholder='Valid Image URL' value={url} onChange={(e) => { setUrl(e.target.value) }}></input><br /><br />
                <button onClick={() => clicked()} className="waves-effect waves-light btn">Sell!</button><br /><br />
            </div>
        </div>
    )
}

export default PostDestination

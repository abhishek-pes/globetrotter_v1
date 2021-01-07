import React, { useState } from 'react'
import { Link, useHistory } from 'react-router-dom'

function Signin() {

    const history = useHistory()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [type, setType] = useState('password')

    const togglePassword = () => {
        if (type === "password") {
            setType('text')
        } else {
            setType('password')
        }
    }

    const clicked = () => {
        fetch('http://localhost:5000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        })
            .then(res => res.json())
            .then(res => {
                if (res.error) {
                    console.log(res.error)
                }
                else {
                    localStorage.setItem('jwt', res.token)
                    localStorage.setItem('user', JSON.stringify(res.user))
                    console.log(res)
                    history.push('/home')
                }
            })
            .catch((err) => {
                console.log(err)
            })
    }

    const style = {
        textAlign: 'center',
        maxWidth: '400px',
        marginLeft: '20px',
        borderRadius: '10px',
        padding: '30px',
        backgroundColor: '#444',
        color: 'white'
    }

    return (
        <div style={{ display: 'flex', margin: '10px auto', justifyContent: 'center' }}>
            <div className='card' style={style}>
                <h2>SkyRocket</h2>
                <h4>Sign In</h4>
                <input style={{ color: "white" }} type="text" placeholder='Enter your Email' value={email} onChange={(e) => setEmail(e.target.value)}></input>
                <input style={{ color: "white" }} type={type} id="passwrd" placeholder='Enter your Password' value={password} onChange={(e) => setPassword(e.target.value)}></input><br /><br />
                <div style={{ color: 'white' }} onClick={() => togglePassword()}>
                    Click here to show/hide Password
                </div>
                <br></br><br></br>
                <button onClick={() => clicked()} className="waves-effect waves-light btn">Sign In</button><br /><br />
                Don't have an account? <br></br>
                <Link to='/signup'>Sign Up here!</Link>
            </div>
        </div>
    )
}

export default Signin
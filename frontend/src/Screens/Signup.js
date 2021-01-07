import React, { useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import Select from 'react-select'

function Signup() {


    const history = useHistory();

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [actype, setActype] = useState('')

    const style = {
        textAlign: 'center',
        maxWidth: '400px',
        marginLeft: '20px',
        borderRadius: '10px',
        padding: '30px',
        backgroundColor: '#444',
        color: 'white'
    }

    const clicked = () => {
        fetch('http://localhost:5000/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password, actype })
        })
            .then(res => res.json())
            .then(res => {
                if (res.error) {
                    console.log(res.error)
                }
                else {
                    console.log('signup success')
                    history.push('/signin')
                }
            })
            .catch((err) => {
                console.log(err)
            })
        console.log(JSON.stringify({ name, email, password, actype }))
    }

    return (
        <div style={{ display: 'flex', margin: '10px auto', justifyContent: 'center', color: 'white' }}>
            <div className='card' style={style}>
                <h2>Globetrotter</h2>
                <h4>Register</h4>
                <input type="text" style={{ color: "white" }} placeholder='Enter your Name' value={name} onChange={(e) => setName(e.target.value)}></input>
                <input type="text" style={{ color: "white" }} placeholder='Enter your Email' value={email} onChange={(e) => setEmail(e.target.value)}></input>
                <input type="text" style={{ color: "white" }} placeholder='Enter your Password' value={password} onChange={(e) => setPassword(e.target.value)}></input><br /><br />

                {/* <div style={{ color: "black", marginBottom: "100px" }}>
                    <Select onChange={(e) => setActype(e.value)} options={[
                        { value: 'normal', label: 'Normal' },
                        { value: 'guide', label: 'Guide' },
                    ]}></Select>
                </div> */}

                <button onClick={() => clicked()} className="waves-effect waves-light btn">Register</button><br /><br />
                Already have an account?
                <br></br>
                <Link to='/signin'> Click here to Sign In</Link>
            </div>
        </div>
    )
}

export default Signup
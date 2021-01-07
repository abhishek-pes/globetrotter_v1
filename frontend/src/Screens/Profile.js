import { React, useEffect } from 'react'

function Profile() {
    useEffect(() => {
        fetch('http://localhost:5000/api/users/me', {
            method: "GET",
            headers: {
                "x-auth-token": localStorage.getItem('jwt'),
                "Content-Type": "application/json",
                "id": (JSON.parse(localStorage.getItem('user'))._id).toString()
            }
        }).then(res => res.json())
            .then(res => console.log(res))
            .catch(err => console.log(err))
    }, [])
    const jumbotronStyle = {
        paddingBottom: '150px',
        boxShadow: "0px 0px 0px 0px rgba(0,0,0,0)"
    }
    return (
        <div className="card-panel grey lighten-3" style={jumbotronStyle}>
            <div className="container">
                <h1>Profile</h1>
                <p>Your Travel App</p>
            </div>
        </div>
    )
}

export default Profile

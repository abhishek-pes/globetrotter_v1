import { React, useEffect, useState } from 'react'

function Profile() {
    const [name, setName] = useState('')
    const [type, setType] = useState('')
    const [avatar, setAvatar] = useState('')
    const [email, setEmail] = useState('')
    useEffect(() => {
        fetch('http://localhost:5000/api/users/me', {
            method: "GET",
            headers: {
                "x-auth-token": localStorage.getItem('jwt'),
                "Content-Type": "application/json",
                "id": (JSON.parse(localStorage.getItem('user'))._id).toString()
            }
        }).then(res => res.json())
            .then(res => {
                setAvatar(res[0].avatar);
                setName(res[0].name);
                setEmail(res[0].email);
                setType(res[0].accountType);
            })
            .catch(err => console.log(err))
    }, [])

    const jumbotronStyle = {
        paddingBottom: '150px',
        boxShadow: "0px 0px 0px 0px rgba(0,0,0,0)"
    }
    if (avatar) {
        return (
            <div className="card-panel grey lighten-3" style={jumbotronStyle}>
                <div className="container">

                    <img src={avatar} />
                    <h1>{name}</h1>
                    <h4>{type} | {email} </h4>
                </div>
            </div>
        )
    }
    else {
        return (
            <div class="progress">
                <div class="indeterminate"></div>
            </div>
        )
    }

}

export default Profile

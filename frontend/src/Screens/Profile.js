import { React, useEffect, useState } from 'react'
import "../Components/styles/center.css"
function Profile() {
    const [name, setName] = useState('')
    const [type, setType] = useState('')
    const [avatar, setAvatar] = useState('')
    const [email, setEmail] = useState('')
    const [coins,setCoins] = useState()

    useEffect(() => {
        const ac = new AbortController();
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
        return () => ac.abort();
    }, [])

    const clicked = () => {
        fetch("http://localhost:5000/api/test/coins", {
          method: "POST",
          headers: {
            "privatekey" : (JSON.parse(localStorage.getItem('user')).privateKey).toString()
          }
        }).then(res => res.json()).then((data) => {
          console.log(data)
          setCoins(data.coins)
        })
      }
    
      const withdraw = () => {
        fetch("http://localhost:5000/api/test/withdraw", {
          method: "GET",
          headers: {
            "privatekey" : (JSON.parse(localStorage.getItem('user')).privateKey).toString()
          }
        })
      }

    const jumbotronStyle = {
        paddingBottom: '150px',
        boxShadow: "0px 0px 0px 0px rgba(0,0,0,0)"
    }
    if (avatar) {
        return (
            <div>
            <div className="card-panel grey lighten-3" style={jumbotronStyle}>
                <div className="container">

                    <img src={avatar} alt="user" />
                    <h1>{name}</h1>
                    <h4>{type} | {email} </h4>
                </div>
            </div>
            <div>
      <br></br>
      <div className="wallet">
      <h4>YOUR EARNINGS</h4>
        <button type="submit" onClick={()=>clicked()}>SHOW EARNINGS</button>
        <br></br><br></br>
        DATA COINS : {coins}
        &nbsp;&nbsp;&nbsp;<button onClick={()=>withdraw()}>WITHDRAW COINS</button>
      </div>
    </div>
            </div>
        )
    }
    else {
        return (
            <div className="progress">
                <div className="indeterminate"></div>
            </div>
        )
    }

}

export default Profile

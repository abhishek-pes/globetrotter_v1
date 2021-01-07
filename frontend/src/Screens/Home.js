import { React, useEffect, useContext } from 'react'
import { UserContext } from '../App'

function Home() {

    useEffect(() => {
        //fetch the logged in user details
        fetch("http://localhost:5000/api/login", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "x-auth-token": localStorage.getItem('jwt')
            }
        }).then(res => res.json())
            .then(res => { console.log(res) })
            .catch(err => console.log(err))
    }, [])
    const { state } = useContext(UserContext)

    return (
        <div>
            Welcome, {state ? state.name : 'loading'}
        </div>
    )
}

export default Home

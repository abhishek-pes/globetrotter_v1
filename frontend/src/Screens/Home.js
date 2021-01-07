import { React, useEffect, useContext } from 'react'
import { UserContext } from '../App'

function Home() {

    const { state, dispatch } = useContext(UserContext)
    useEffect(() => {
        //fetch the logged in user details
        fetch("http://localhost:5000/api/login", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "x-auth-token": localStorage.getItem('jwt')
            }
        }).then(res => res.json())
            .then(res => {
                console.log(res)
            })
            .catch(err => console.log(err))
    }, [])
    console.log(state);
    return (
        <div>
            Welcome, {state ? state.name : 'loading'}

        </div>
    )
}

export default Home

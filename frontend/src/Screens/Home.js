import { React, useEffect, useContext } from 'react'
import { UserContext } from '../App'
import Card from '../Components/Card'

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
    return ([
        <Card destination="somewhere" description="something" />,
        <Card destination="everywhere" description="something" />,
        <Card destination="nowhere" description="something" />,

    ]
    )
}

export default Home

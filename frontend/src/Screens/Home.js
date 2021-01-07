import { React, useEffect, useContext, useState } from 'react'
import { UserContext } from '../App'
import Card from '../Components/Card'

function Home() {

    const [dests, setDests] = useState([])
    const { state, dispatch } = useContext(UserContext)
    useEffect(() => {
        fetch("http://localhost:5000/api/posts", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "x-auth-token": localStorage.getItem('jwt'),
                "id": (JSON.parse(localStorage.getItem('user'))._id).toString()
            }
        }).then(res => res.json())
            .then(res => {
                setDests(res)
            })
            .catch(err => alert('soettext'))
    }, [])
    return (
        <div>
            {
                dests.map((d) => {
                    return <Card key={d._id} destination={d.destination} description={d.description} url={d.image_url} />
                })
            }
        </div>
    )
}

export default Home

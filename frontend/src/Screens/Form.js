import React,{useState,useEffect} from 'react'
const StreamrClient = require('streamr-client')

function Form(){

const STREAM_ID = '0xcedd0024aa729244f33f13348e0bf7601f933fad/test_globetrotter'
const API = '206656bcf576be28697407f0b363d85b125bf5dc75baa0a19578aa6797f78064'

const [name,setName] = useState();



const clicked = () => {
    fetch("http://localhost:5000/api/test/form", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
          name: name
      })
    })
      .then((res) => res.json())
      .catch((err) => console.log(err));
  }

return(
    <div>
        <label>name :</label>
        <input type="text" value={name} onChange={(e)=> {setName(e.target.value)}}></input>
        <button type="submit" onClick={()=>clicked()}>SUBMIT</button>
    </div>
)


}

export default Form
import React,{useState,useEffect} from 'react'
const StreamrClient = require('streamr-client')

function Form(){

const [coins,setCoins] = useState()

const STREAM_ID = '0xcedd0024aa729244f33f13348e0bf7601f933fad/test_globetrotter'
const API = '206656bcf576be28697407f0b363d85b125bf5dc75baa0a19578aa6797f78064'

const [name,setName] = useState();



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

return(
    <div>
      <br></br>
        <button type="submit" onClick={()=>clicked()}>SHOW EARNINGS</button>
        <br></br><br></br>
        DATA COINS : {coins}
        &nbsp;&nbsp;&nbsp;<button onClick={()=>withdraw()}>WITHDRAW COINS</button>
    </div>
)


}

export default Form
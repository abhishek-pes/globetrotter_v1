import { React } from "react";
import { Link } from 'react-router-dom'
import FavoriteIcon from '@material-ui/icons/ThumbUpOutlined';
import PeopleOutlineIcon from '@material-ui/icons/PeopleOutline';
import "./styles/center.css"

function Card(props) {


  const sendFriendRequest = (fid) => {
    fetch("http://localhost:5000/api/users/friend/send", {
      method: "PUT",
      headers: {
        "x-auth-token": localStorage.getItem("jwt"),
        "Content-Type": "application/json",
        uid: JSON.parse(localStorage.getItem("user"))._id.toString(),
        "fid": fid,
      },
    })
      .then((res) => res.json()).then(() => {
        alert("friend request sent")
      })
      .catch((err) => console.log(err));
  }

  const add_reccomend = (dest) => {
    fetch("http://localhost:5000/api/test/reccomend", {
      method: "POST",
      headers: {
        "x-auth-token": localStorage.getItem("jwt"),
        "Content-Type": "application/json",
        "dest": dest,
        "privatekey": (JSON.parse(localStorage.getItem('user')).privateKey).toString()
      },
    })
  }
  // console.log("friend list : ", localStorage.getItem("user").friendlist)
  let frarray = JSON.parse(localStorage.getItem("user")).friendlist;
  // console.log("this: ", frarray)
  let fr_id;
  let fr_array = [];
  try {
    fr_id = localStorage.getItem("friends").split(",");
    for (var t in fr_id) {
      // console.log(fr_id[t].split(";")[0])
      fr_array.push(fr_id[t].split(";")[0])
    }
    // console.log("friend list : ", fr_array)
  }
  catch {
    console.log("")
  }
  // let load = (!frarray.includes(props.fid) || !fr_array.includes(props.fid))
  // console.log("load :", load)

  if (frarray.includes(props.fid) || fr_array.includes(props.fid)) {
    // console.log("reached");
    return (
      <div>


        <div className="card hoverable" style={{ maxWidth: "700px", margin: "20px" }}>
          <div className="card-image">
            <img src={props.url} alt='dest' style={{ width: '400px', height: "300px" }} />
            <span className="card-title" ><strong>{props.destination}</strong></span>
          </div>

          <div className="card-content">
            {props.description}
            <Link to={'/userdetails/' + props.user._id} >
              <div style={{ paddingTop: "20px", display: 'flex', alignItems: 'center' }}>
                <img alt='user' src={props.user.avatar} style={{ height: '40px', width: '40px', borderRadius: "20px", marginRight: "10px" }} /> {props.user.name}
              </div>
            </Link>
          </div>
          <div className="card-action">
            <PeopleOutlineIcon />FRIENDS&nbsp;&nbsp;
               <button onClick={() => add_reccomend(props.destination)}> <FavoriteIcon /> </button>
          </div>
        </div>
      </div>


    )
  }
  else if (!frarray.includes(props.fid) || !fr_array.includes(props.fid)) {
    return (
      <div>

        <div className="card hoverable" style={{ maxWidth: "700px", margin: "20px" }}>
          <div className="card-image">
            <img src={props.url} alt='dest' style={{ width: '400px', height: "300px" }} />
            <span className="card-title" ><strong>{props.destination}</strong></span>
          </div>
          <div className="card-content">
            {props.description}
            <Link to={'/userdetails/' + props.user._id}>
              <div style={{ paddingTop: "20px", display: 'flex', alignItems: 'center' }}>
                <img alt='user' src={props.user.avatar} style={{ height: '40px', width: '40px', borderRadius: "20px", marginRight: "10px" }} /> {props.user.name}
              </div>
            </Link>
          </div>
          <div className="card-action">
            <button value={props.fid} onClick={() => sendFriendRequest(props.fid)}>SEND FRIEND REQUEST</button>&nbsp;&nbsp;
              <button onClick={() => add_reccomend(props.destination)}><FavoriteIcon /></button>
          </div>
        </div>
      </div>


    );
  }


}

export default Card;

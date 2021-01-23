import { React } from "react";
import { Link } from 'react-router-dom'

function Card(props) {


  const sendFriendRequest = (fid, dest) => {
    fetch("http://localhost:5000/api/users/friend/send", {
      method: "PUT",
      headers: {
        "x-auth-token": localStorage.getItem("jwt"),
        "Content-Type": "application/json",
        uid: JSON.parse(localStorage.getItem("user"))._id.toString(),
        "fid": fid,
        "dest": dest,
        "privatekey": (JSON.parse(localStorage.getItem('user')).privateKey).toString()
      },
    })
      .then((res) => res.json()).then(() => {
        alert("friend request sent")
      })
      .catch((err) => console.log(err));
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
      < div className="row " >

        <div className="col s12 m7">

          <div className="card hoverable ">
            <div className="card-image">
              <img src={props.url} alt='dest' />
              <span className="card-title" >{props.destination}</span>
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
              <button style={{ background: "green", color: "white" }}>FRIEND</button> <i class="material-icons">thumb_up</i>
            </div>
          </div>
        </div>
      </div >

    )
  }
  else if (!frarray.includes(props.fid) || !fr_array.includes(props.fid)) {
    return (

      <div className="row ">
        <div className="col s12 m7">
          <div className="card hoverable ">
            <div className="card-image">
              <img src={props.url} alt='dest' />
              <span className="card-title" >{props.destination}</span>
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
              <button value={props.fid} onClick={() => sendFriendRequest(props.fid, props.destination)}>SEND FRIEND REQUEST</button> <i class="material-icons">thumb_up</i>
            </div>
          </div>
        </div>
      </div>

    );
  }


}

export default Card;

import { React, useState, useEffect } from "react";
import { Link } from 'react-router-dom'

function Friends() {
  const [friendList, setFriendList] = useState([]);
  const [room, setRoom] = useState('');

  function getFriendlist() {
    fetch("http://localhost:5000/api/users/friend", {
      method: "GET",
      headers: {
        "x-auth-token": localStorage.getItem("jwt"),
        "Content-Type": "application/json",
        uid: JSON.parse(localStorage.getItem("user"))._id.toString(),
      },
    })
      .then((res) => res.json())
      .then((res) => {
        // console.log(res[0].split(";")[0])
        setFriendList(res);
      })
      .catch((err) => console.log(err));
  }

  const unfriend = (frid) => {
    fetch("http://localhost:5000/api/users/unfriend", {
      method: "PUT",
      headers: {
        "x-auth-token": localStorage.getItem("jwt"),
        "Content-Type": "application/json",
        "uid": JSON.parse(localStorage.getItem("user"))._id.toString(),
        "frid": frid
      },
    })
      .then((res) => res.json())
      .then(res => {
        alert(res.msg)
        getFriendlist()
      })
      .catch((err) => console.log(err));
  }

  useEffect(() => {
    getFriendlist()
  }, []);

  if (friendList.length != 0) {

    return (
      <div>
        <div>
          <h2>
            This is Friend list :)
          <hr></hr>
          </h2>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap" }}>


          {friendList.map((f) => {
            return (
              <div key={f.split(";")[0]}>
                <div className="card hoverable" style={{ margin: "20px", maxWidth: "700px" }}>
                  <div className="card-image">
                    <img src={'https://robohash.org/' + f.split(";")[0]} style={{ width: '150px', height: "150px", borderRadius: "100%" }}
                      alt="destinationpostedbyyou" />
                  </div>
                  <div className="card-title" style={{ color: "black", marginLeft: "30px" }}><p>{f.split(";")[1]}</p>
                  </div>
                  <div className="card-content">
                    <button value="unfriend" onClick={() => unfriend(f.split(";")[0])}>UNFRIEND</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <input type='text' onChange={(e) => setRoom(e.target.value)} />
        <Link to={`/chat?name=${JSON.parse(localStorage.getItem('user')).name}&room=${room}`}>
          <button value="chat">Join Chat</button>
        </Link>
      </div >
    );
  }
  else {
    return (
      [<div className="progress">
        <div className="indeterminate"></div>
      </div>, <h2>No Friends :(</h2>]
    )
  }

}

export default Friends;

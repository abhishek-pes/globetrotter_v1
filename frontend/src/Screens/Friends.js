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

  return (
    <div>
      <div>
        <h4>
          This is Friend list
          <hr></hr>
        </h4>
      </div>

      {friendList.map((f) => {
        return (
          <div key={f.split(";")[0]}>
            <p>{f.split(";")[1]}</p>
            <button value="unfriend" onClick={() => unfriend(f.split(";")[0])}>UNFRIEND</button>
            <hr></hr>
          </div>
        );
      })}
      <input type='text' onChange={(e) => setRoom(e.target.value)} />
      <Link to={`/chat?name=${JSON.parse(localStorage.getItem('user')).name}&room=${room}`}>
        <button value="chat">Join Chat</button>
      </Link>
    </div >
  );
}

export default Friends;

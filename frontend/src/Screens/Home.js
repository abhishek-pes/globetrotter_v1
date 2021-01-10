import { React, useEffect, useContext, useState } from "react";
import { UserContext } from "../App";
import Card from "../Components/Card";

function Home() {
  const [dests, setDests] = useState([]);
  const { state, dispatch } = useContext(UserContext);
  // const [friendList, setFriendList] = useState([]);

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
        // setFriendList(res);
        localStorage.setItem("friends", res)
      })
      .catch((err) => console.log(err));
  }
  useEffect(() => {
    getFriendlist()
  }, []);
  useEffect(() => {
    fetch("http://localhost:5000/api/posts", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": localStorage.getItem("jwt"),
        id: JSON.parse(localStorage.getItem("user"))._id.toString(),
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setDests(res);
      })
      .catch((err) => alert("somettext"));
  }, []);
  return (
    <div>
      {
        dests.map((d) => {
          return (
            <Card
              key={d._id}
              user={d.user}
              fid={d.user._id}
              destination={d.destination}
              description={d.description}
              name={d.user.name}
              url={d.image_url}
            />
          );
        })
      }
    </div >

  );
}

export default Home;

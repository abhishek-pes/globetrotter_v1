import { React, useState, useEffect } from "react";

function Inbox() {
  const [reqId, setreqId] = useState([]);

  const getInbox = () => {
    fetch("http://localhost:5000/api/users/inbox", {
      method: "GET",
      headers: {
        "x-auth-token": localStorage.getItem("jwt"),
        "Content-Type": "application/json",
        uid: JSON.parse(localStorage.getItem("user"))._id.toString(),
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setreqId(res);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getInbox();
  }, []);
  const onAccept = (frid, val) => {
    const accepted = val;
    fetch("http://localhost:5000/api/users/inbox/request", {
      method: "PUT",
      headers: {
        "x-auth-token": localStorage.getItem("jwt"),
        "Content-Type": "application/json",
        accepted: accepted,
        uid: JSON.parse(localStorage.getItem("user"))._id.toString(),
        frid: frid,
      },
    })
      .then(res => res.json())
      .then(res => { alert(res.msg) })
      .then(() => {
        getInbox();
      })
      .catch((err) => console.log(err));
  };
  return (
    <div>
      <div>
        <h4>
          This is Inbox
          <hr></hr>
        </h4>
      </div>

      {reqId.map((d) => {
        return (
          <div key={d.split(";")[0]}>
            <p>{d.split(";")[1]}</p>
            &nbsp;
            <button value="true" onClick={() => onAccept(d.split(";")[0], "true")}>
              ACCEPT
            </button>
            &nbsp;
            <button value="reject" onClick={() => onAccept(d.split(";")[0], "false")} > REJECT</button>
            <hr></hr>
          </div>
        );
      })}
    </div>
  );
}

export default Inbox;

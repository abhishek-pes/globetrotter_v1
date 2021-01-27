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


  // const loader = () => {
  //   return (
  //     <div className="progress">
  //       <div className="indeterminate"></div>
  //     </div>
  //   )
  // }

  if (reqId.length != 0) {

    return (
      <div>
        <div>
          <h2>
            This is Inbox
            <hr></hr>
          </h2>
        </div>

        {reqId.map((d) => {
          return (
            <div key={d.split(";")[0]}>
              <div className="card hoverable" style={{ margin: "20px", maxWidth: "700px", height: "110px" }}>
                <div className="card-image" style={{ paddingLeft: "20px" }}>
                  <img src={'https://robohash.org/' + d.split(";")[0]} style={{ width: '50px', height: "50px", borderRadius: "100%" }}
                    alt="destinationpostedbyyou" />
                </div>

                <div style={{ fontSize: "18px", marginLeft: "30px" }}>{d.split(";")[1]}</div>
                <button value="true" style={{ marginLeft: "15px" }} onClick={() => onAccept(d.split(";")[0], "true")}>
                  ACCEPT
              </button>
                <button value="reject" style={{ marginLeft: "5px" }} onClick={() => onAccept(d.split(";")[0], "false")} > REJECT</button>
              </div>
            </div>
          );
        })}
      </div>
    );
  } else {
    return (
      [<div className="progress">
        <div className="indeterminate"></div>
      </div>, <h2>Empty Inbox</h2>]
    )
  }
}

export default Inbox;

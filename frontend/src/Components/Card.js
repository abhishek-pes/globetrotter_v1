import React from 'react'

function Card(props) {
    return (
        <div className="row ">
            <div className="col s12 m7">
                <div className="card hoverable">
                    <div className="card-image">
                        <img src={props.url} />
                        <span className="card-title" >{props.destination}</span>
                    </div>
                    <div className="card-content">
                        {props.description}
                        <div style={{ paddingTop: "20px", display: 'flex', alignItems: 'center' }}>
                            <img src={props.user.avatar} style={{ height: '40px', width: '40px', borderRadius: "20px", marginRight: "10px" }} /> {props.user.name}
                        </div>
                    </div>
                    <div className="card-action">
                        <a href="#">Invite {props.user.name}</a>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default Card

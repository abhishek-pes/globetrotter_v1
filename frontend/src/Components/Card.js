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
                    </div>
                    <div className="card-action">
                        <a href="#">This is a link</a>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default Card

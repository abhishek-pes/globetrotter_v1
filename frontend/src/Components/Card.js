import React from 'react'

function Card(props) {
    return (
        <div class="row ">
            <div class="col s12 m7">
                <div class="card hoverable">
                    <div class="card-image">
                        <img src="https://www.diabetes.co.uk/wp-content/uploads/2019/01/iStock-10019278401.jpg" />
                        <span class="card-title" >{props.destination}</span>
                    </div>
                    <div class="card-content">
                        {props.description}
                    </div>
                    <div class="card-action">
                        <a href="#">This is a link</a>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default Card

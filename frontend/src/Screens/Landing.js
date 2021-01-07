import React from 'react';

const jumbotronStyle = {
    paddingBottom: '150px',
    boxShadow: "0px 0px 0px 0px rgba(0,0,0,0)"
}

const Landing = () => {
    return (
        <div className="card-panel grey lighten-3" style={jumbotronStyle}>
            <div className="container">
                <h1>GlobeTrotter</h1>
                <p>Your Travel App</p>
            </div>
        </div>
    );
}

export default Landing;
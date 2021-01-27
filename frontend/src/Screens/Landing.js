import React from 'react';
import img1 from './Assets/1.png'
import img2 from './Assets/2.png'
import img3 from './Assets/3.png'


const jumbotronStyle = {
    paddingBottom: '150px',
    boxShadow: "0px 0px 0px 0px rgba(0,0,0,0)"
}

const Landing = () => {
    return (
        <div>
            <img src={img1} style={{width:"100%",marginLeft:"0%"}}></img>
        <div style={{marginTop:"0%"}}>
            <img src={img2} style={{width:"80%"}}></img>
            <img src={img3} style={{width:"80%",marginLeft:"20%"}}></img>
        </div>
        </div>
    );
}

export default Landing;
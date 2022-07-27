import React from 'react'
//import { Link } from 'react-router-dom'

function Home(){
    return(
    <body>
        <div id="all">
            <h1> Welcome to our FT_Transcendance !</h1>
            <p>If you want to play to a simple pong please use the map 1.</p>
            <ul><a href="/pong"> simple map</a></ul>
        </div>
    </body>
    );
}

window.addEventListener("load", function(){
    let all: any = this.document.querySelector("#all");
    all.style.textAlign= "center";
});
export default Home;
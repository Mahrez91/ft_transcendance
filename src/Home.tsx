import React from 'react'
//import { Link } from 'react-router-dom'

function Home(){
    return(
    <body>
        <div id="all">
            <h1> Welcome to our FT_Transcendance !</h1>
            <p>If you want to play to a simple pong please use the map 1.</p>
        </div>
    </body>
    );
}

window.addEventListener("click", function(){
    let supp: any = this.document.querySelector("#all");
    supp.style.display= "none";
});
export default Home;
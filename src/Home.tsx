import React from 'react'
//import { Link } from 'react-router-dom'

function Home(){
    return(
        <div id="all">
            <h1 id="bandeau"> Welcome to our FT_Transcendance !</h1>
            <p id ="to-play">If you want to play to a simple pong please use the map 1.</p>
            <div id="choice">
            <form id="pong1" action="/pong" data-style="font-family: OCR A Std;">
                <input type="submit" value="simple map" />
            </form>
            <form id="pong2" action="/pong2">
                <input type="submit" value="night map" />
            </form>
            <form id="pong3" action="/pong3">
                <input type="submit" value="tennis map" />
            </form>
            </div>
        </div>
    );
}

window.addEventListener("load", function(){
    let all: any = this.document.querySelector("#all");
    let pong1: any = this.document.querySelector("#pong1");
    let pong2: any = this.document.querySelector("#pong2");
    let pong3: any = this.document.querySelector("#pong3");
    all.style.textAlign= "center";
    pong1.style.marginRight = "2%";
    pong1.style.marginTop = "10%";
    pong1.style.marginBottom = "37%";
    pong2.style.marginRight = "2%";
    pong2.style.marginBottom = "37%";
    pong3.style.marginRight = "2%";
    all.style.backgroundColor= "#4682B4";
});
export default Home;
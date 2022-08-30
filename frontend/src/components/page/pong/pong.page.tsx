import { useState } from 'react'
//import { Link } from 'react-router-dom'

import './../../../style/pong.css';
import Pong from './pong.component';

//<h1 id="bandeau">Welcome to our FT_Transcendance !</h1>

function PongPage()
{
	const [map, setMap] = useState<'simple' | 'hard' | 'tennis' | null>(null);
	// might not store the type of map

	return (
		<div className='pong'>
			{!map ? (
				<div>
					<div style={{ height: "3rem" }} />
					<div style={{ display: "flex", justifyContent: "center" }}>
						<p className='to-play'>If you want to play to a simple pong please use the map 1.</p>
					</div>
					<div className=/*'card card--border*/'choice' /* should probably be a card */>
						<button onClick={() => { setMap('simple') }}>
							simple pong
						</button>
						<button onClick={() => { setMap('hard') }}>
							hard pong
						</button>
						<button onClick={() => { setMap('tennis') }}>
							tennis pong
						</button>
					</div>
				</div>
			) : (
				<div>
					<Pong map={{ type: map }} goBack={() => { setMap(null) }} />
				</div>
			)}
		</div>
	);
}
//<Navigate to="/play/pong" />


/*window.addEventListener("load", function ()
{
	let pong1 = this.document.querySelector("#pong1")! as HTMLElement;
	let pong2 = this.document.querySelector("#pong2")! as HTMLElement;
	let pong3 = this.document.querySelector("#pong3")! as HTMLElement;
	
	pong1.style.fontFamily = "OCR A Std";
	pong2.style.fontFamily = "OCR A Std";
	pong3.style.fontFamily = "OCR A Std";
	pong1.style.fontSize = "18px";
	pong2.style.fontSize = "18px";
	pong3.style.fontSize = "18px";

	pong1.style.marginRight = "2%";
	pong1.style.marginTop = "10%";
	pong1.style.marginBottom = "37%";
	pong2.style.marginRight = "2%";
	pong2.style.marginBottom = "37%";
	pong3.style.marginRight = "2%";
});*/

export default PongPage;
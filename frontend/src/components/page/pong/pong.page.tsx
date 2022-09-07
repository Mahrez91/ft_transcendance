import { useState, useContext, useEffect } from 'react'
//import { Link } from 'react-router-dom'

import './../../../style/pong.css';
import Pong from './pong.component';
import { io } from 'socket.io-client';
import { ApiUrlContext } from '../../../context/apiUrl.context';

// function Users(props: { users: i_user[] })
// {
// 	let ret: JSX.Element[] = [];

// 	for (let i = 0; i < props.users.length; i++)
// 	{ ret.push(<UserBtn key={i} user={props.users[i]} />); }

// 	return (
// 		<div>
// 			{ret}
// 		</div>
// 	);
// }

function Matches(props: { matches: string[] })
{
	let ret: JSX.Element[] = [];

	for (let i = 0; i < props.matches.length; i++)
	{ ret.push(<MatchBtn key={i} match={props.matches[i]} />); }

	return (
		<div>
			{ret}
		</div>
	);
}

function MatchBtn(props: { match: string})
{
	const [map, setMap] = useState<'simple' | 'hard' | 'tennis' | null>(null);

	return (
		<div>
			<button className='card card--border card--btn' style={{ marginLeft: "4px" }} onClick={() => { 
				window.location.href = "/playbg";
				}}>
				<span className='span--card--user truncate'>{props.match}</span>
			</button>
		</div >
	);
}

function ViewMatch(versus: string)
{
	const { apiUrl } = useContext(ApiUrlContext);
	const socket = io(apiUrl);
	
	
}

function PongPage()
{
	let i = 0;
	const { apiUrl } = useContext(ApiUrlContext);
	const [map, setMap] = useState<'simple' | 'hard' | 'tennis' | null>(null);
	const [gameLive, setGameLive] = useState<string[]>([]);
	
	const socket = io(apiUrl);

	useEffect(() =>
	{
		socket.on('live', data => {
			console.log(data);
			setGameLive(current => [...current, data.toString()]);
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	// might not store the type of map
	
	return (
		<div className='pong'>
			{!map ? (
				<div>
					<div style={{ height: "3rem" }} />
					<div style={{ display: "flex", justifyContent: "center" }}>
						<p className='to-play'>If you want to play to a simple pong please use the map 1.</p>
					</div>
					<div className=/*'card card--border*/'menu' /* should probably be a card */>
						<div className=/*'card card--border*/'choice' /* should probably be a card */>
							<div id="select">
							<p id="select-css"> Select Mode </p>
								<span id="choiceButton">
									<button onClick={() => { setMap('simple') }}>
										simple pong
									</button>
									<button onClick={() => { setMap('hard') }}>
										hard pong
									</button>
									<button onClick={() => { setMap('tennis') }}>
										tennis pong
									</button>
								</span>
							</div>
						</div>
							<div className=/*'card card--border*/'choice2' /* should probably be a card */>
								<p id="live-game-msg">Live game</p>
								<Matches matches={gameLive}/>
						</div>
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



export default PongPage;
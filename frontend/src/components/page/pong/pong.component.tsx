import { useContext, useEffect, useState } from 'react';
import axios from 'axios';

import './../../../style/pong.css';

import { AuthContext } from '../../../context/auth.context';

import i_map from '../../../interface/map.interface'
import { ReactComponent as Back } from '../../../icon/left-svgrepo-com.svg'
import tennis from './tennis_pong.jpg'

import Error from '../../request_answer_component/error.component';
import { useReqUser } from '../../../request/user.request';

import { io, Socket } from 'socket.io-client';
import { ApiUrlContext } from '../../../context/apiUrl.context';

function Pong(props: { map: i_map, goBack: () => void })
{
	const { apiUrl } = useContext(ApiUrlContext);
	const { user } = useContext(AuthContext);
	const { reqUser, loading, error } = useReqUser(2);
	const [inGame, setInGame] = useState(false);
	const [inPlay, setInPlay] = useState(false);
	const [gameLaunch, setGameLaunch] = useState(0);
	const [socket] = useState(io(apiUrl));

	useEffect(() =>
	{
		handleCanvas(apiUrl, true, props.map, bdd_pong, 0, socket);
	});

	if (!user || !user.name)
		return (<Error msg="failed to get connected user" />);
	else if (error)
		return (<Error msg={error.message} />);

	props.map.p1 = user.name;
	props.map.p2 = (loading ? "..." : reqUser.name);

	let saloon = {
		player1: "",
		player2: "",
		clientRoom: ""
	};

	let nameP1 = user.name;
	let bdd_pong: any[] = [];


	// 	props.socket.on('chatToClient', (msg: i_msg) =>
	// 	{
	// 		console.log("received at:", msg.chanId, msg);
	// 		setIcomingMsg(msg);
	// 	});



	function backFunction()
	{
		props.goBack();
		socket.emit('back');
		socket.disconnect();
	}


	return (
		<div className='pong'>
			<div className='pong--header'>
				<button className='btn--back'
					onClick={backFunction}>
					<Back />
				</button>
				<h1>Pong</h1>
				<button className='btn--back' style={{ visibility: "hidden" }}>
					<Back />
				</button>
			</div>
			<script src="https://cdn.socket.io/4.3.2/socket.io.min.js"></script>
			<br />
			[DEBUG] map chosen: {props.map.type}
			<p className='pong--player'> <span id="p1-name">{props.map.p1}</span> vs <span id="p2-name">...</span></p>
			<div style={{ height: "3rem" }}>
				{!inGame &&
					<div style={{ display: "flex", justifyContent: "center" }}>
						<button className='pong--btn--play' id="lets-go" onClick={() => setInPlay(true)}>
							<span id="play-pong">play</span>
						</button>
						<br />
					</div>
				}
				<p id="score" style={{ visibility: (inGame ? "visible" : "hidden") }}>
					<span id="scoreP1HTML" />-<span id="scoreP2HTML" />
				</p>
			</div>
			{props.map.type === 'tennis' && <img id='tennis' src={tennis} alt='tennis' style={{ display: "none" }} />}
			<canvas id="canvas" height="580" width="740" />
			<img id="win" src="https://ak7.picdn.net/shutterstock/videos/34233727/thumb/1.jpg" alt="win" />
			<img id="lose" src="https://www.freesoundslibrary.com/wp-content/uploads/2020/07/game-lose-2-720x340.jpg" alt="lose" />
			{inPlay && <LaunchGame map={props.map} nameP1={nameP1} saloon={saloon} incGameLaunch={() => { setGameLaunch(gameLaunch + 1); return gameLaunch; }} setInGame={setInGame} socket={socket} />}
		</div >
	);
}

function LaunchGame(props: { map: i_map, nameP1: string, saloon: any, incGameLaunch: () => number, setInGame: React.Dispatch<React.SetStateAction<boolean>>, socket: Socket })
{
	const { apiUrl } = useContext(ApiUrlContext);
	props.socket.connect();
	let client_Room: string;
	let joueur: any;
	let playbtn = document.querySelector("#lets-go")! as HTMLElement;
	let bdd_pong: any[] = [];
	playbtn.style.display = "none";
	console.log("hello\n ca va");
	useEffect(() =>
	{
		if (props.map.type)
		{
			props.socket.emit('newPlayer', props.map.type.toString());
			props.socket.on('serverToRoom', (data: string) =>
			{
				console.log(`je suis ds la room data ${data}`);
				client_Room = data;
				props.socket.emit('joinRoom', client_Room, props.nameP1, window.innerWidth / 2);
			});
			props.socket.on('switchFromServer', (data: []) =>
			{
				joueur = data!;
				props.saloon.player1 = joueur[0].toString()!;
				props.saloon.player2 = joueur[1].toString()!;
				props.saloon.clientRoom = client_Room;
				console.log(props.saloon);
				bdd_pong.push(props.saloon);
			});
			props.socket.on('start', () =>
			{
				console.table(bdd_pong);
				props.setInGame(true);
				handleCanvas(apiUrl, false, props.map, bdd_pong, props.incGameLaunch(), props.socket);
			});
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}
	}, []);
	return <div />
}

function handleCanvas(apiUrl: string, init: boolean, map: i_map, bdd: any[] = [], room: number, socket: Socket)
{
	let canvas = document.querySelector("#canvas")! as HTMLCanvasElement;
	canvas.style.display = "block";
	canvas.style.margin = "auto";
	const PLAYER_HEIGHT = (map.type === 'hard' ? 50 : 100);
	const PLAYER_WIDTH = 5;
	const win = document.querySelector("#win")! as HTMLImageElement;
	const lose = document.querySelector("#lose")! as HTMLImageElement;
	lose.style.display = "none";
	win.style.display = "none";

	let game = {
		player: {
			y: canvas.height / 2 - PLAYER_HEIGHT / 2
		},
		computer: {
			y: canvas.height / 2 - PLAYER_HEIGHT / 2
		},
		ball: {
			x: canvas.width / 2,
			y: canvas.height / 2,
			r: 5,
			ratio: 1,
			speed: {
				x: 1,
				y: 1
			}
		},
		score: {
			p1_temp: -1,
			p2_temp: -1,
			p1: 0,
			p2: 0,
			ball_start: false
		}
	};

	let scoreP1HTML = document.querySelector("#scoreP1HTML")! as HTMLElement;
	let scoreP2HTML = document.querySelector("#scoreP2HTML")! as HTMLElement;
	let scoreP1 = 0;
	let scoreP2 = 0;
	scoreP1HTML.innerText = "0";
	scoreP2HTML.innerText = "0";

	draw();
	if (init)
		return;
	console.log(bdd[room]);
	let parsing_player: string;
	let p1name = document.querySelector("#p1-name")!;
	let p2name = document.querySelector("#p2-name")!;
	let info = {
		player: {
			height: PLAYER_HEIGHT
		},
		clientRoom: {
			name: bdd[room].clientRoom
		},
		who: {
			player: 0
		},
		mouseLocation: {
			coordonne: 0
		},
		canvas: {
			height: 0
		}
	};

	function Move_player(event: any)
	{
		// Get the mouse location in the canvas
		var canvasLocation = canvas.getBoundingClientRect();
		var mouseLocation = event.clientY - canvasLocation.y;
		if (map.p1! === bdd[room].player1)
		{
			info.who.player = 1;
			info.mouseLocation.coordonne = mouseLocation;
			socket.emit('movePlayer', info, mouseLocation, game, canvas.height);
		}
		else
		{
			info.who.player = 2;
			info.mouseLocation.coordonne = mouseLocation;
			socket.emit('movePlayer', info, mouseLocation, game, canvas.height);
		}
	}

	if (map.p1 === bdd[room].player1)
		parsing_player = bdd[room].player2;
	else
		parsing_player = bdd[room].player1;

	p1name.innerHTML = bdd[room].player1;
	p2name.innerHTML = bdd[room].player2;
	console.log(`p1 = ${bdd[room].player1}, p2 = ${bdd[room].player2} et parsing-player = ${parsing_player}`);

	play();

	function play()
	{
		socket.emit('play', game, PLAYER_WIDTH, canvas.height, canvas.width, PLAYER_HEIGHT, map.type.toString(), bdd[room].clientRoom);
		socket.on('returnPlay', (data) =>
		{
			game = data;
			if (game.score.p1 !== game.score.p1_temp || game.score.p2 !== game.score.p2_temp)
			{
				if (game.score.p1 !== game.score.p1_temp)
				{
					game.score.p1_temp++;
					scoreP1HTML.innerText = game.score.p1.toString();
				}
				else
				{
					game.score.p2_temp++;
					scoreP2HTML.innerText = game.score.p2.toString();
				}
			}
			if (game.score.p1 >= 11 || game.score.p2 >= 11)
			{
				scoreP1 = 11;
				scoreP2 = 11;
			}
		});
		if (scoreP1 >= 11 || scoreP2 >= 11)
		{
			let context = canvas.getContext('2d')! as CanvasRenderingContext2D;
			if (game.score.p1 >= 11)
			{
				if (bdd[room].player1 === map.p1)
				{
					context.drawImage(win, 0, 0, canvas.width, canvas.height);
				}
				else
				{
					context.drawImage(lose, 0, 0, canvas.width, canvas.height);
				}
			}
			if (game.score.p2 >= 11)
			{
				if (bdd[room].player2 === map.p1)
				{
					context.drawImage(win, 0, 0, canvas.width, canvas.height);
				}
				else
				{
					context.drawImage(lose, 0, 0, canvas.width, canvas.height);
				}
			}
			//canvas.style.display = "none";
			console.log(map.p1);
			postResults(apiUrl, game.score.p1, game.score.p2, bdd[room].player1, bdd[room].player2);
			return;
		}
		draw();
		setTimeout(play, 1000 / 200);
	}

	canvas.addEventListener('mousemove', Move_player);


	function draw()
	{
		const img = document.querySelector("#tennis")! as HTMLImageElement;
		let context = canvas.getContext('2d')! as CanvasRenderingContext2D;
		if (map.type === 'simple' || map.type === 'hard')
		{
			// Draw field
			context.fillStyle = 'black';
			context.fillRect(0, 0, canvas.width, canvas.height);
			// Draw middle line
			context.strokeStyle = 'white';
			context.beginPath();
			context.moveTo(canvas.width / 2, 0);
			context.lineTo(canvas.width / 2, canvas.height);
			context.stroke();
		}
		else
		{
			try
			{
				if (init)
				{
					img.addEventListener('load', function ()
					{
						context.drawImage(img, 0, 0, canvas.width, canvas.height);
						drawMovingPart();
					});
				}
				else
					context.drawImage(img, 0, 0, canvas.width, canvas.height);
			}
			catch (e)
			{
				//console.log(e);
				//window.location.href = '/youlose';
				game.score.p2 = 11;
				return;
			}
		}

		function drawMovingPart()
		{

			// Draw players
			// socket.emit('bdd[room].player2-go', game.player.y);
			// socket.on('bdd[room].player2-go', (data)=>{
			// 		game.computer.y = data;
			// 		console.log(data);
			// });

			socket.on('move-player-draw', (data) =>
			{
				game = data;
			});
			context.fillStyle = (map.type === 'hard' ? 'red' : 'white');
			context.fillRect(5, game.player.y, PLAYER_WIDTH, PLAYER_HEIGHT);
			context.fillRect(canvas.width - 5 - PLAYER_WIDTH, game.computer.y, PLAYER_WIDTH, PLAYER_HEIGHT);
			context.beginPath();
			context.fillStyle = (map.type === 'hard' ? 'red' : 'white');
			context.arc(game.ball.x, game.ball.y, game.ball.r, 0, Math.PI * 2, false);
			context.fill();
			// Draw ball

		}
		drawMovingPart();

	}

	socket.on('disconnection', (data) =>
	{
		if (data === bdd[room].player1)
		{
			scoreP2HTML.innerText = "11";
			scoreP1 = 11;
			game.score.p2 = 11;
		}
		else
		{
			scoreP1HTML.innerText = "11";
			scoreP2 = 11;
			game.score.p1 = 11;
		}
	});
}

function postResults(apiUrl: string, scoreP1: number, scoreP2: number, player1: string, player2: string)
{
	// only the winner will post the match to the api
	if (scoreP1 === 11)
	{
		if (player1 || player2)
			return;
		console.log("end of match", player1, scoreP1, player2, scoreP2);
		const match_stats = {
			winner: player1,
			loser: player2,
			scoreWinner: scoreP1,
			scoreLoser: scoreP2
		}
		axios.post(apiUrl + "/user/match", match_stats);
		axios.post(apiUrl + "/pong/match", match_stats);
	}
}

export default Pong;

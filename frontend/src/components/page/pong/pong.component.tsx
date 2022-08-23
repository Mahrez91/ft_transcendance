import { useContext, useEffect, useState } from 'react';
import axios from 'axios';

import './../../../style/pong.css';

import { AuthContext } from '../../../context/auth.context';

import i_map from '../../../interface/map.interface';

import { ReactComponent as Back } from '../../../icon/left-svgrepo-com.svg'
import tennis from './tennis_pong.jpg'

import Error from '../../request_answer_component/error.component';
import { useReqUser } from '../../../request/user.request';

import { io } from 'socket.io-client';



function Pong(props: { map: i_map, goBack: () => void })
{
	const { reqUser, loading, error } = useReqUser(2);
	const [inGame, setInGame] = useState(false);
	const { user } = useContext(AuthContext);

	useEffect(() =>
	{
		handleCanvas(true, props.map);
	});

	if (!user || !user.name)
		return (<Error msg="failed to get connected user" />);
	else if (error)
		return (<Error msg={error.message} />);

	props.map.p1 = user.name;
	props.map.p2 = (loading ? "..." : reqUser.name);

	let test: number;
	function launchGame()
	{
		socket.emit('newPlayer', "");
		socket.on('start', data=>{
				setInGame(true);
				handleCanvas(false, props.map);
		});
	}

	return (
		<div className='pong'>
			<div className='pong--header'>
				<button className='btn--back'
					onClick={() => props.goBack()}>
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
			<p className='pong--player'>{props.map.p1} vs {props.map.p2}</p>
			<div style={{ height: "3rem" }}>
				{!inGame &&
					<div style={{ display: "flex", justifyContent: "center" }}>
						<button className='pong--btn--play' onClick={launchGame}>
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
			<canvas id="canvas" />
		</div >
	);
}

const socket = io('http://localhost:3000');



function handleCanvas(init: boolean, map: i_map)
{
	let canvas = document.querySelector("#canvas")! as HTMLCanvasElement;
	canvas.style.display = "block";
	canvas.style.margin = "auto";
	canvas.width = window.innerWidth / 2;
	canvas.height = window.innerHeight / 2.5;

	const PLAYER_HEIGHT = (map.type === 'hard' ? 50 : 100);
	const PLAYER_WIDTH = 5;
	
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
			speed: {
				x: 2,
				y: 2
			}
		}
	};
	let ball_start = false;
	let scoreP1HTML = document.querySelector("#scoreP1HTML")! as HTMLElement;
	let scoreP2HTML = document.querySelector("#scoreP2HTML")! as HTMLElement;
	let scoreP1 = 0;
	let scoreP2 = 0;

	scoreP1HTML.innerText = "0";
	scoreP2HTML.innerText = "0";

	draw();
	if (init)
		return;

	play();

	canvas.addEventListener('mousemove', Move_player);


	function draw()
	{
		canvas.width = window.innerWidth / 2;
		canvas.height = window.innerHeight / 2.5;
		let context = canvas.getContext('2d')!;
		const img = document.querySelector("#tennis")! as HTMLImageElement;
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
				scoreP2 = 11;
				return;
			}
		}

		function drawMovingPart()
		{

			// Draw players
			// socket.emit('player2-go', game.player.y);
			// socket.on('player2-go', (data)=>{
			// 		game.computer.y = data;
			// 		console.log(data);
			// });

			context.fillStyle = (map.type === 'hard' ? 'red' : 'white');
			context.fillRect(5, game.player.y, PLAYER_WIDTH, PLAYER_HEIGHT);
			context.fillRect(canvas.width - 5 - PLAYER_WIDTH, game.computer.y, PLAYER_WIDTH, PLAYER_HEIGHT);
			// Draw ball
			context.beginPath();
			context.fillStyle = (map.type === 'hard' ? 'red' : 'white');
			context.arc(game.ball.x, game.ball.y, game.ball.r, 0, Math.PI * 2, false);
			context.fill();
		}
		drawMovingPart();
		
	}

	function Move_ball()
	{
		// Rebounds on top and bottom
		if (game.ball.y > canvas.height || game.ball.y < 0)
			game.ball.speed.y *= -1;
		if (game.ball.x + 5 > canvas.width - PLAYER_WIDTH)
		{
			collision(game.computer, game);
		}
		else if (game.ball.x - 5 < PLAYER_WIDTH)
		{
			collision(game.player, game);
		}
		game.ball.x += game.ball.speed.x;
		game.ball.y += game.ball.speed.y;
	}

	function play()
	{
		if (scoreP1 >= 11 || scoreP2 >= 11)
		{
			canvas.style.display = "none";
			postResults(map, scoreP1, scoreP2);
			return;
		}

		draw();
		Move_ball();
		requestAnimationFrame(play);
	}

	function Angle_Direction(playerPosition: any)
	{
		var impact = game.ball.y - playerPosition - PLAYER_HEIGHT / 2;
		var ratio = 100 / (PLAYER_HEIGHT / 2);
		// Get a value between 0 and 10
		game.ball.speed.y = Math.round(impact * ratio / 10);
	}

	function collision(player: any, game: any)
	{
		// The player does not hit the ball
		if (game.ball.y < player.y || game.ball.y > player.y + PLAYER_HEIGHT)
		{
			// Set ball and players to the center
			if (game.ball.x > window.innerHeight / 2.5)
			{
				ball_start = false;
				scoreP1++
				scoreP1HTML.innerText = scoreP1.toString();
			}
			else
			{
				ball_start = true;
				scoreP2++
				scoreP2HTML.innerText = scoreP2.toString();
			}
			game.ball.x = canvas.width / 2;
			game.ball.y = canvas.height / 2;
			game.player.y = canvas.height / 2 - PLAYER_HEIGHT / 2;
			game.computer.y = canvas.height / 2 - PLAYER_HEIGHT / 2;

			// Reset speed

			if (!ball_start)
				game.ball.speed.x = -2;
			else
				game.ball.speed.x = 2;
		}
		else
		{
			// Increase speed and change direction
			game.ball.speed.x *= (map.type === 'hard' ? -1.5 : -1.2);
			Angle_Direction(player.y);
		}
	}

	function Move_player(event: any)
	{
		// Get the mouse location in the canvas
		var canvasLocation = canvas.getBoundingClientRect();
		var mouseLocation = event.clientY - canvasLocation.y;
		
		if (map.p1! > map.p2!){
			if (mouseLocation < PLAYER_HEIGHT / 2)
				game.player.y = 0;
			else if (mouseLocation > canvas.height - PLAYER_HEIGHT / 2)
				game.player.y = canvas.height - PLAYER_HEIGHT;
			else
				game.player.y = mouseLocation - PLAYER_HEIGHT / 2;
		}
		else
		{
			if (mouseLocation < PLAYER_HEIGHT / 2)
				game.computer.y = 0;
			else if (mouseLocation > canvas.height - PLAYER_HEIGHT / 2)
				game.computer.y = canvas.height - PLAYER_HEIGHT;
			else
				game.computer.y = mouseLocation - PLAYER_HEIGHT / 2;
		}
	}
}

function postResults(map: i_map, scoreP1: number, scoreP2: number)
{
	// only the winner will post the match to the api
	if (scoreP1 === 11)
	{
		if (!map.p1 || !map.p2)
			return;
		const match_stats = {
			winner: map.p1,
			loser: map.p2,
			scoreWinner: scoreP1,
			scoreLoser: scoreP2
		}
		axios.post("http://localhost:3000/user/match", match_stats);
		axios.post("http://localhost:3000/pong/match", match_stats);
	}
}

export default Pong;

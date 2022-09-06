import { IoAdapter } from "@nestjs/platform-socket.io";
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Console } from "console";
import { Server, Socket } from 'socket.io';
//import i_map from '../../../frontend/src/interface/map.interface'

let player = 0;
let clientNb_simple = 0;
let clientNb_hard = 100;
let clientNb_tennis = 50;
let joueur_simple = [];
let joueur_hard = [];
let joueur_tennis = [];
let bdd = [];
let bdd_game = [];

function Move_player(game: any, mouseLocation: number, PLAYER_HEIGHT: number, canvas_height: number, who: number)
{
	// Get the mouse location in the canvas

	if (who === 1)
	{
		if (mouseLocation < PLAYER_HEIGHT / 2)
			game.player.y = 0;
		else if (mouseLocation > canvas_height - PLAYER_HEIGHT / 2)
			game.player.y = canvas_height - PLAYER_HEIGHT;
		else
			game.player.y = mouseLocation - PLAYER_HEIGHT / 2;
	}
	else
	{
		if (mouseLocation < PLAYER_HEIGHT / 2)
			game.computer.y = 0;
		else if (mouseLocation > canvas_height - PLAYER_HEIGHT / 2)
			game.computer.y = canvas_height - PLAYER_HEIGHT;
		else
			game.computer.y = mouseLocation - PLAYER_HEIGHT / 2;
	}
	return (game);
}

function Move_ball(game: any, PLAYER_WIDTH: number, canvas_height: number, canvas_width: number, PLAYER_HEIGHT: number, type: string)
{
	// Rebounds on top and bottom
	if (game.ball.y > canvas_height || game.ball.y < 0)
		game.ball.speed.y *= -1;
	if (game.ball.x + 5 > canvas_width - PLAYER_WIDTH)
	{
		game = collision(game.computer, game, canvas_height, canvas_width, PLAYER_HEIGHT, type);
	}
	else if (game.ball.x - 5 < PLAYER_WIDTH)
	{
		game = collision(game.player, game, canvas_height, canvas_width, PLAYER_HEIGHT, type);
	}
	game.ball.x += game.ball.speed.x;
	game.ball.y += game.ball.speed.y;
	return (game);
}


function collision(player: any, game: any, canvas_height: number, canvas_width: number, PLAYER_HEIGHT: number, type: string)
{
	// The player does not hit the ball
	if (game.ball.y < player.y || game.ball.y > player.y + PLAYER_HEIGHT)
	{
		// Set ball and players to the center
		if (game.ball.x > canvas_width - 10)
		{
			game.score.ball_start = false;
			game.score.p1++
		}
		else
		{
			game.score.ball_start = true;
			game.score.p2++
		}
		game.ball.x = canvas_width / 2;
		game.ball.y = canvas_height / 2;
		game.player.y = canvas_height / 2 - PLAYER_HEIGHT / 2;
		game.computer.y = canvas_height / 2 - PLAYER_HEIGHT / 2;

		// Reset speed

		if (!game.score.ball_start)
			game.ball.speed.x = -0.5;
		else
			game.ball.speed.x = 0.5;
		game.ball.speed.y = 0.5;
		return (game);
	}
	else
	{
		// Increase speed and change direction
		game.ball.speed.x *= (type === "hard" ? -1.4 : -1.05);
		game = Angle_Direction(player.y, game, PLAYER_HEIGHT);
	}
	return (game);
}



function Angle_Direction(playerPosition: any, game: any, PLAYER_HEIGHT: number,)
{
	var impact = game.ball.y - playerPosition - PLAYER_HEIGHT / 2;
	var ratio = 100 / (PLAYER_HEIGHT / 2);
	// Get a value between 0 and 10
	game.ball.speed.y = Math.round(impact * ratio / 25);
	return (game);
}


@WebSocketGateway({
	cors: {
		origin: '*',
	}
})

export class Matchmaking
{
	@WebSocketServer()
	server: Server;

	//connexion
	handleConnection(client: Socket)
	{
		client.on('newPlayer', (type) =>
		{
			player++;
			//console.log("New client connected: "+client.id);
			//console.log("type: "+type);
			if (type === "simple")
			{
				clientNb_simple++;
				client.join(Math.round(clientNb_simple / 2).toString());
				client.emit('serverToRoom', Math.round(clientNb_simple / 2).toString());
				client.on('joinRoom', (clientRoom, nameP1, canvas_size) =>
				{
					if (nameP1 !== joueur_simple[0] && joueur_simple[1] === undefined)
					{
						joueur_simple.push(nameP1);
						bdd.push(clientRoom, nameP1, client.id);
					}
					if (clientNb_simple % 2 === 0)
					{
						this.server.to(clientRoom).emit('switchFromServer', joueur_simple);
						this.server.to(clientRoom).emit('start');
						console.log(`joueur_simple = ${joueur_simple[0]}`);
						console.log(`joueur_simple = ${joueur_simple[1]}`);
						joueur_simple.pop();
						joueur_simple.pop();
						bdd_game.push(clientRoom, type, "start");
					}
				});
			}
			if (type === "hard")
			{
				clientNb_hard++;
				client.join(Math.round(clientNb_hard / 2).toString());
				client.emit('serverToRoom', Math.round(clientNb_hard / 2).toString());
				client.on('joinRoom', (clientRoom, nameP1) =>
				{
					//console.log(nameP1);
					if (nameP1 !== joueur_hard[0])
					{
						joueur_hard.push(nameP1);
						console.log(`joueur_hard = ${joueur_hard[0]}`);
						console.log(`joueur_hard = ${joueur_hard[1]}`);
						bdd.push(clientRoom, nameP1, client.id);
					}
					if (clientNb_hard % 2 === 0)
					{
						this.server.to(clientRoom).emit('switchFromServer', joueur_hard);
						this.server.to(clientRoom).emit('start');
						joueur_hard.pop();
						joueur_hard.pop();
						bdd_game.push(clientRoom, type, "start");
					}
				});
			}
			if (type === "tennis")
			{
				clientNb_tennis++;
				client.join(Math.round(clientNb_tennis / 2).toString());
				client.emit('serverToRoom', Math.round(clientNb_tennis / 2).toString());
				client.on('joinRoom', (clientRoom, nameP1) =>
				{
					//console.log(nameP1);
					if (nameP1 !== joueur_tennis[0])
					{
						joueur_tennis.push(nameP1);
						console.log(`joueur_tennis = ${joueur_tennis[0]}`);
						console.log(`joueur_tennis = ${joueur_tennis[1]}`);
						bdd.push(clientRoom, nameP1, client.id);
					}
					if (clientNb_tennis % 2 === 0)
					{
						this.server.to(clientRoom).emit('switchFromServer', joueur_tennis);
						this.server.to(clientRoom).emit('start');
						joueur_tennis.pop();
						joueur_tennis.pop();
						bdd_game.push(clientRoom);
					}
				});
			}
		})
		client.on('play', (game, PLAYER_WIDTH, canvas_height, canvas_width, PLAYER_HEIGHT, type, clientRoom) =>
		{
			game = Move_ball(game, PLAYER_WIDTH, canvas_height, canvas_width, PLAYER_HEIGHT, type);
			this.server.to(clientRoom).emit('returnPlay', game);

		});
		client.on('movePlayer', (info, mouseLocation, game, canvas_height) =>
		{
			game = Move_player(game, mouseLocation, info.player.height, canvas_height, info.who.player);
			this.server.to(info.clientRoom.name).emit('move-player-draw', game);

		});
		client.on('back', () =>
		{
			let pos = bdd.indexOf(client.id);
			let restart_room = bdd_game.indexOf(bdd[pos - 2]);
			console.table(`client disconnected : ${bdd[pos - 1]}`);
			//console.table(`client room : ${bdd[pos - 2]}`);
			console.log(`statu of the room : ${restart_room}`);
			if (restart_room === -1)
			{
				if (bdd[pos - 2] < 50)
				{
					clientNb_simple--;
					joueur_simple.pop();
				}
				else if (bdd[pos - 2] < 100)
				{
					clientNb_tennis--;
					joueur_tennis.pop();
				}
				else
				{
					clientNb_hard--;
					joueur_hard.pop();
				}
				return;
			}
			this.server.to(bdd[pos - 2]).emit('disconnection', bdd[pos - 1]);
		});
	}

	handleDisconnect(client: Socket)
	{
		let pos = bdd.indexOf(client.id);
		let restart_room = bdd_game.indexOf(bdd[pos - 2]);
		console.table(`client disconnected : ${bdd[pos - 1]}`);
		console.log(`statu of the room : ${restart_room}`);
		if (restart_room === -1)
		{
			if (bdd[pos - 2] < 50)
			{
				clientNb_simple--;
				joueur_simple.pop();
			}
			else if (bdd[pos - 2] < 100)
			{
				clientNb_tennis--;
				joueur_tennis.pop();
			}
			else
			{
				clientNb_hard--;
				joueur_hard.pop();
			}
			return;
		}
		this.server.to(bdd[pos - 2]).emit('disconnection', bdd[pos - 1]);
		player--;
	}

}

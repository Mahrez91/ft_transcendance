import { IoAdapter } from "@nestjs/platform-socket.io";
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';
//import i_map from '../../../frontend/src/interface/map.interface'

let player = 0;
let clientNb = 0;
let joueur= [];    


	function Move_player( game: any, mouseLocation: number, PLAYER_HEIGHT: number, canvas_height: number, who: number)
	{
		// Get the mouse location in the canvas
		
		if (who === 1){
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
        return(game);
	}

@WebSocketGateway({
    cors:{
        origin: '*',
    }
})

export class Matchmaking{
    @WebSocketServer()
    server: Server;
    
    //connexion
    handleConnection(client: Socket){
        client.on('newPlayer', ()=>{
            player++;
            console.log("New client connected: "+client.id);
            clientNb++;
            client.join(Math.round(clientNb/2).toString());
            client.emit('serverToRoom', Math.round(clientNb/2).toString());
            client.on('joinRoom', (clientRoom, nameP1) => {
                console.log(nameP1);
                joueur.push(nameP1);
                console.log(`joueur = ${joueur[0]}`);
                console.log(`joueur = ${joueur[1]}`);
                if(clientNb % 2 === 0){
                    this.server.to(clientRoom).emit('switchFromServer', joueur);
                    this.server.emit('start');
                    joueur.pop();
                    joueur.pop();
                }
            })
            
        })
        client.on('movePlayer', (info, mouseLocation, game, canvas_height) =>{
            console.log(mouseLocation);
            game = Move_player(game, mouseLocation, info.player.height, canvas_height, info.who.player);
            this.server.to(info.clientRoom.name).emit('move-player-draw', game);
            
        });
    }
    
    handleDisconnect(client: Socket){
        console.log(`client disconnected : ${client.id}`);
        player--;
  
    }

}

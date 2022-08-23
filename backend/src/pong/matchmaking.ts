import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';

let player = 0;

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
            console.log("Nb of player: "+ player);

            if(player === 2)
                this.server.emit('start', 0);
            
        })
        client.on('player2-go', (data)=>{
            console.log(data);
            this.server.emit('player2-go', data);
        });
        // client.on('game', (data) =>{
        //     console.log(`${data.x} -- ${data.y}`);
        // });
    }
    
    handleDisconnect(client: Socket){
        console.log(`client disconnected : ${client.id}`);
        player--;
  
    }

}
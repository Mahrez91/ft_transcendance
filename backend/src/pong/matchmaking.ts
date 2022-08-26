import { IoAdapter } from "@nestjs/platform-socket.io";
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';


let player = 0;
let clientNb = 0;
let joueur= [];    

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
        client.on('player2-go', (clientRoom, data)=>{
            client.broadcast.to(clientRoom).emit('player2-go', data);
            
        });
    }
    
    handleDisconnect(client: Socket){
        console.log(`client disconnected : ${client.id}`);
        player--;
  
    }

}

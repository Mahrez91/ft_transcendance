import { IoAdapter } from "@nestjs/platform-socket.io";
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';
import pong_data from './pong.interface'


let player = 0;
let clientNb = 0;
var joueur= new Array(2);    

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
            clientNb++;
            client.join(Math.round(clientNb/2).toString());
            client.emit('serverToRoom', Math.round(clientNb/2).toString());
            client.on('joinRoom', (clientRoom, nameP1) => {
                console.log(nameP1);
                joueur.push(nameP1);
                console.log(`joueur = ${joueur[1]}`);
                if(clientNb % 2 === 0){
                    this.server.to(clientRoom).emit('switchFromServer', joueur);
                    this.server.emit('start');
                }
            })
            
        })
        // client.on('player2-go', (data)=>{
        //     console.log(data);
        //     this.server.emit('player2-go', data);
        // });
        // client.on('game', (data) =>{
        //     console.log(`${data.x} -- ${data.y}`);
        // });
    }
    
    handleDisconnect(client: Socket){
        console.log(`client disconnected : ${client.id}`);
        player--;
  
    }

}

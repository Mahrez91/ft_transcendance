import React from 'react';
import './App.css';

function Pong3() {
  return (
    <body>
    <h1 id="pong-pong">Pong</h1>
    <p id ="player-pong"><span id="joueur1-pong">wassim</span><span id="joueur2-pong"> gildas</span></p>
      <main>
          <canvas id="canvas" width="740" height="580"></canvas>
          <p> <span id="score-pong"> 0</span><span id="score2-pong"> 0</span></p>
      </main>
    <p id ="play-pong3">Click here to play</p>
    <img id='tennis' alt="nadal king" src='https://us.123rf.com/450wm/sermax55/sermax551811/sermax55181100034/127713212-court-de-tennis-champ-de-couverture-d-herbe-illustration-vectorielle-vue-de-dessus-avec-grille-et-om.jpg?ver=6' />
    </body>
  );
}



window.addEventListener("load", function () {
    let canvas: any;
    let game: any;
    let score : any = this.document.querySelector("#score-pong");
    let score2 : any = this.document.querySelector("#score2-pong");
    let score1 : number = 0;
    let scorej2 : number = 0;
    let ball_start : number = 0;
    let PLAYER_HEIGHT: number = 100;
    let PLAYER_WIDTH: number = 5;
    let pong: any = document.querySelector("#pong-pong");
    let click: any = document.querySelector("#play-pong3");
    let image: any = document.getElementById('tennis');

    image.style.display = "none";
    pong.style.textAlign = "center";
    pong.style.fontSize = "400%";
    pong.style.fontFamily = "OCR A Std";
    click.style.textAlign = "center";
    click.style.fontSize = "250%";
    click.style.fontFamily = "OCR A Std";

    
    function draw() {
        console.log("gildas le bg");
        var context = canvas.getContext('2d');
        context.drawImage(image, 0, 0, canvas.width, canvas.height);

        context.fillStyle = 'white';
        context.fillRect(5, game.player.y, PLAYER_WIDTH, PLAYER_HEIGHT);
        context.fillRect(canvas.width - 5 - PLAYER_WIDTH, game.computer.y, PLAYER_WIDTH, PLAYER_HEIGHT);
        // Draw ball
        context.beginPath();
        context.fillStyle = 'yellow';
        context.arc(game.ball.x, game.ball.y, game.ball.r, 0, Math.PI * 2, false);
        context.fill();
    }

    function Move_ball() {
        // Rebounds on top and bottom
        if (game.ball.y > canvas.height || game.ball.y < 0) 
            game.ball.speed.y *= -1;
            if (game.ball.x + 5 > canvas.width - PLAYER_WIDTH) 
            collision(game.computer);
        else if (game.ball.x - 5 < PLAYER_WIDTH) 
            collision(game.player);
        game.ball.x += game.ball.speed.x;
        game.ball.y += game.ball.speed.y;
    }
        
    function play() {
        draw();
        Move_ball();
        requestAnimationFrame(play);
    }

    function Angle_Direction(playerPosition: any) {
        var impact = game.ball.y - playerPosition - PLAYER_HEIGHT / 2;
        var ratio = 100 / (PLAYER_HEIGHT / 2);
        // Get a value between 0 and 10
        game.ball.speed.y = Math.round(impact * ratio / 10);
    }
    
    function collision(player: any) {
        // The player does not hit the ball
        if (game.ball.y < player.y || game.ball.y > player.y + PLAYER_HEIGHT) {
            // Set ball and players to the center
            if (game.ball.x > 400 ){
                ball_start = 0;
                score1++;
                score.innerHTML = score1;    
            }
            else  {
                ball_start = 1;
                scorej2++;
                score2.innerHTML = scorej2; 
            }
            game.ball.x = canvas.width / 2;
            game.ball.y = canvas.height / 2;
            game.player.y = canvas.height / 2 - PLAYER_HEIGHT / 2;
            game.computer.y = canvas.height / 2 - PLAYER_HEIGHT / 2;
            
            // Reset speed
            if (ball_start === 0)
                game.ball.speed.x = -2;
            else    
                game.ball.speed.x = 2;
        } else {
            // Increase speed and change direction
            game.ball.speed.x *= -1.25;
            Angle_Direction(player.y);
        }
    }

        click.innerHTML = "Play";
        canvas = document.getElementById('canvas');
        canvas.style.display = "block";
        canvas.style.margin = "auto";
        game = {
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
        canvas.addEventListener('mousemove', Move_player);
        function Move_player(event: any) {
            // Get the mouse location in the canvas
            var canvasLocation = canvas.getBoundingClientRect();
            var mouseLocation = event.clientY - canvasLocation.y;
            if (mouseLocation < PLAYER_HEIGHT / 2) 
                game.player.y = 0;
            else if (mouseLocation > canvas.height - PLAYER_HEIGHT / 2) 
                game.player.y = canvas.height - PLAYER_HEIGHT;
            else 
                game.player.y = mouseLocation - PLAYER_HEIGHT / 2;
        }
        draw();
        click.addEventListener('click', function () {
            click.style.display = "none";
            play();
        });
  });


export default Pong3;
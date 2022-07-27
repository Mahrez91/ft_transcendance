import React from 'react';
import './App.css';

function Pong() {
  return (
    <body>
    <h1 id="pong">Pong</h1>
    <main>
        <canvas id="canvas" width="740" height="580"></canvas>
    </main>
    <p id ="texte">WELCOME TO THE PONG !</p>
    <p id ="play">Click to play</p>
    </body>
  );
}



window.addEventListener("load", function () {
    let canvas: any;
    let game: any;
    let PLAYER_HEIGHT: number = 100;
    let PLAYER_WIDTH: number = 5;
    let text: any = document.querySelector("#texte");
    let pong: any = document.querySelector("#pong");
    let click: any = document.querySelector("#play");
    pong.style.textAlign = "center";
    pong.style.fontSize = "400%";
    pong.style.fontFamily = "Apple Chancery";
    text.style.textAlign = "center";
    text.style.fontSize = "250%";
    text.style.fontFamily = "Apple Chancery";
    click.style.textAlign = "center";
    click.style.fontSize = "250%";
    click.style.fontFamily = "Apple Chancery";
    //canvas.style.textAlign = "center";
    console.log("gildas le pd");
    function draw() {
        console.log("gildas le bg");
        var context = canvas.getContext('2d');
        // Draw field
        context.fillStyle = 'black';
        context.fillRect(0, 0, canvas.width, canvas.height);
        // Draw middle line
        context.strokeStyle = 'white';
        context.beginPath();
        context.moveTo(canvas.width / 2, 0);
        context.lineTo(canvas.width / 2, canvas.height);
        context.stroke();
        // Draw players
        context.fillStyle = 'white';
        context.fillRect(5, game.player.y, PLAYER_WIDTH, PLAYER_HEIGHT);
        context.fillRect(canvas.width - 5 - PLAYER_WIDTH, game.computer.y, PLAYER_WIDTH, PLAYER_HEIGHT);
        // Draw ball
        context.beginPath();
        context.fillStyle = 'white';
        context.arc(game.ball.x, game.ball.y, game.ball.r, 0, Math.PI * 2, false);
        context.fill();
    }
        function ballMove() {
          // Rebounds on top and bottom
          if (game.ball.y > canvas.height || game.ball.y < 0) {
              game.ball.speed.y *= -1;
          }
          if (game.ball.x > canvas.width - PLAYER_WIDTH) {
              collide(game.computer);
          } else if (game.ball.x < PLAYER_WIDTH) {
              collide(game.player);
          }
          
          game.ball.x += game.ball.speed.x;
          game.ball.y += game.ball.speed.y;
      }
        function play() {
          draw();
          ballMove();
          requestAnimationFrame(play);
      }
      function changeDirection(playerPosition: any) {
          var impact = game.ball.y - playerPosition - PLAYER_HEIGHT / 2;
          var ratio = 100 / (PLAYER_HEIGHT / 2);
          // Get a value between 0 and 10
          game.ball.speed.y = Math.round(impact * ratio / 10);
      }
      function collide(player: any) {
        // The player does not hit the ball
        if (game.ball.y < player.y || game.ball.y > player.y + PLAYER_HEIGHT) {
            // Set ball and players to the center
            game.ball.x = canvas.width / 2;
            game.ball.y = canvas.height / 2;
            game.player.y = canvas.height / 2 - PLAYER_HEIGHT / 2;
            game.computer.y = canvas.height / 2 - PLAYER_HEIGHT / 2;
            
            // Reset speed
            game.ball.speed.x = 2;
        } else {
            // Increase speed and change direction
            game.ball.speed.x *= -1.2;
            changeDirection(player.y);
        }
    }
    document.addEventListener('click', function () {
        console.log("gildas le moche");
        text.style.display = "none";
        click.style.display = "none";
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
      canvas.addEventListener('mousemove', playerMove);
      function playerMove(event: any) {
      // Get the mouse location in the canvas
        var canvasLocation = canvas.getBoundingClientRect();
        var mouseLocation = event.clientY - canvasLocation.y;
        if (mouseLocation < PLAYER_HEIGHT / 2) {
            game.player.y = 0;
        } else if (mouseLocation > canvas.height - PLAYER_HEIGHT / 2) {
            game.player.y = canvas.height - PLAYER_HEIGHT;
        } else {
            game.player.y = mouseLocation - PLAYER_HEIGHT / 2;
        }
      }
  
        
        draw();
        document.addEventListener('click', function () {
          play();
        });
    });
  });


export default Pong;

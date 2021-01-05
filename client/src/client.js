     var canvas = document.getElementById("myCanvas");
      var ctx = canvas.getContext("2d");
      var image = new Image();
      image.src =
        "https://img.freepik.com/free-vector/space-with-stars-universe-space-infinity-background_78474-99.jpg?size=626&ext=jpg";
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      var ballRadius = 10;
      var x = canvas.width / 2;
      var y = canvas.height - 30;
      var dx = 3;
      var dy = -3;
      var dx1 = 0,
        dx2 = 0;
      var paddleHeight = 10;
      var paddleWidth = 150;
      var paddleX = (canvas.width - paddleWidth) / 2;
      var rightPressed = false;
      var leftPressed = false;
      var score = 0;
      var paddleHeight1 = 10;
      var paddleWidth1 = 150;
      var paddleX1 = (canvas.width - paddleWidth1) / 2;
      var rightPressed1 = false;
      var leftPressed1 = false;
      var score1 = 0;
      var dip = 0;
      var sindip, cosdip;
      var mag;
      var color = "#F0F8FF";
      var flag=0;
      function keyDownHandler(e) {
        if (e.key == "Right" || e.key == "ArrowRight") {
          rightPressed = true;
          //dx1 += 1.5;
        } else if (e.key == "Left" || e.key == "ArrowLeft") {
          leftPressed = true;
         // dx1 -= 1.5;
        }

        if (e.key == "A" || e.key == "a") {
          leftPressed1 = true;
         // dx2 -= 1.5;
        } else if (e.key == "D" || e.key == "d") {
          rightPressed1 = true;
         // dx2 += 1.5;
        }
        //const text1="keyDown";
        //sock.emit('message1',text1);
      }

      function keyUpHandler(e) {
        if (e.key == "Right" || e.key == "ArrowRight") {
          rightPressed = false;
         // dx1 -= 1.5;
        } else if (e.key == "Left" || e.key == "ArrowLeft") {
          leftPressed = false;
         // dx1 += 1.5;
        }

        if (e.key == "A" || e.key == "a") {
          leftPressed1 = false;
         // dx2 += 1.5;
        } else if (e.key == "D" || e.key == "d") {
          rightPressed1 = false;
         // dx2 -= 1.5;
        }
        //const text2="keyUp";
        //sock.emit('message2',text2);
      }


      const sock=io();
      document.addEventListener("keydown", keyDownHandler, false);
      document.addEventListener("keyup", keyUpHandler, false);
      var Player1="NULL";
        var Player2="NULL";
        var clients=0;
        sock.on("broadcast", (data) => {
          Player1=data.ID1;
          Player2=data.ID2;
          clients=data.count;
        });
        sock.on('message2',(rec)=>{
          if(rec.ID==Player1){
            if(flag){
            x=rec.ballx
            y=rec.bally
            dx=rec.ballx
            dy=rec.bally}
            score=rec.ballscore
            paddleX=rec.ballpaddleX
          }else if(rec.ID==Player2){
            score1=rec.ballscore1
            paddleX1=rec.ballpaddleX1
          }
        });
       /* sock.on('message3',(rec)=>{
          if(rec.ID==Player1){ 
            score=rec.ballscore
            paddleX=rec.ballpaddleX
          }else if(rec.ID==Player2){
            score1=rec.ballscore1
            paddleX1=rec.ballpaddleX1
          }
        }); */
      function drawBall() {
        ctx.beginPath();
        ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.closePath();
      }
      function drawPaddle() {
        ctx.beginPath();
        ctx.rect(
          paddleX,
          canvas.height - paddleHeight,
          paddleWidth,
          paddleHeight
        );
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
      }
      function drawPaddle1() {
        ctx.beginPath();
        ctx.rect(paddleX1, 0, paddleWidth1, paddleHeight1);
        ctx.fillStyle = "#FF3E43";
        ctx.fill();
        ctx.closePath();
      }
      function drawScore() {
        ctx.beginPath();
        ctx.font = "16px Arial";
        ctx.fillStyle = "#0095DD";
        ctx.fillText("Score: " + score, 8, 20);
        ctx.closePath();
      }
      function drawScore1() {
        ctx.beginPath();
        ctx.font = "16px Arial";
        ctx.fillStyle = "#FF3E43";
        ctx.fillText("Score: " + score1, 500, 20);
        ctx.closePath();
      }
      function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        drawBall();
        drawPaddle();
        drawPaddle1();
        drawScore();
        drawScore1();
        
        //collision with wall
        if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
          dx = -dx;
        }
        if (y + dy < ballRadius) {
          flag=1;
          if (x > paddleX1 && x < paddleX1 + paddleWidth1) {
            //score1 += 1;
            dip = (paddleX1 + paddleWidth / 2 - x) / (paddleWidth / 2);
            mag = Math.sqrt(dx * dx + dy * dy);
            sindip = dip / Math.sqrt(dip * dip + 1);
            cosdip = 1 / Math.sqrt(dip * dip + 1);
            dx = mag * sindip;
            dy = mag * cosdip;
            color = "#FF3E43";
            //dx += dx2;
          } else {
            score += 1;
            dy = -dy;
          }
        } else if (y + dy > canvas.height - ballRadius) {
          flag=1;
          if (x > paddleX && x < paddleX + paddleWidth) {
            //score += 1;
            dip = (paddleX + paddleWidth / 2 - x) / (paddleWidth / 2);
            mag = Math.sqrt(dx * dx + dy * dy);
            sindip = dip / Math.sqrt(dip * dip + 1);
            cosdip = 1 / Math.sqrt(dip * dip + 1);
            dx = mag * sindip;
            dy = -mag * cosdip;
            color = "#0095DD";
            //dx += dx1;
          } else {
            score1 += 1;
            dy = -dy;
          }
          /*else {
            alert("GAME OVER");
            document.location.reload();
            clearInterval(interval); // Needed for Chrome to end game
          }*/
        
        }
        // control of paddle
        if (rightPressed && paddleX < canvas.width - paddleWidth) {
          paddleX += 7;
         
        } else if (leftPressed && paddleX > 0) {
          paddleX -= 7;
          
        }
        if (rightPressed1 && paddleX1 < canvas.width - paddleWidth1) {
          paddleX1 += 7;
         
        } else if (leftPressed1 && paddleX1 > 0) {
          paddleX1 -= 7;
         
        }
        const v1={
          Identity:sock.id,
          ballflag:flag,
          ballx:x,
          bally:y,
          ballvx:dx,
          ballvy:dy,
          ballscore:score,
          ballscore1:score1,
          ballpaddleX:paddleX,
          ballpaddleX1:paddleX1
        }
        sock.emit('message1',v1);
        flag=0;
        //movement of ball
        if(clients==2){
        x += dx;
        y += dy;
        }
      }

      var interval = setInterval(draw, 10);
    
const canvas=document.getElementById("pong");
const context=canvas.getContext("2d");

let paddlesound=new Audio();
let wallsound=new Audio();
let scoresound=new Audio();

paddlesound.src="sounds/paddle.mp3";
wallsound.src="sounds/wall.mp3";
scoresound.src="sounds/score.mp3";
const user={
     x:50,
     y:(canvas.height-100)/2,
     width:10,
     height:70,
     color:"#8A2BE2",
     score:0
}
const cpu={
     x:canvas.width-50,
     y:(canvas.height-100)/2,
     width:10,
     height:70,
     score:0,
     color:"#8A2BE2"
     
}
const ball={
  x:canvas.width/2,
  y:canvas.height/2,
  radius:9,
  speed:7,
  velocityx:5,
  velocityy:5,
  color:"#8A2BE2"

}
const net={
  x:canvas.width/2-1,
  y:0,
  width:1,
  height:8,
  color:"#8A2BE2"
}

function drawnet(){
  for(let i=0;i<=canvas.height;i+=15)
  {
          drawrect(net.x,net.y+i,net.width,net.height,net.color);
  }
}
function drawrect(x,y,w,h,color){
       context.fillStyle=color;
       context.fillRect(x,y,w,h);
}


function drawball(x,y,r,color)
{
  context.fillStyle=color;
  context.beginPath();
  context.arc(x,y,r,0,Math.PI*2,true);
  context.closePath();
  context.fill();
}

function drawtext(text,x,y,color){
  context.fillStyle=color;
  context.font="75px fantasy";
  context.fillText(text,x,y);
}



function render(){

      drawrect(0,0,canvas.width,canvas.height,"#282828");
      drawnet();
      drawtext(user.score,canvas.width/4,canvas.height/5,"#8A2BE2");
      drawtext(cpu.score,3*canvas.width/4,canvas.height/5,"#8A2BE2");
      drawrect(user.x,user.y,user.width,user.height,user.color);
      drawrect(cpu.x,cpu.y,cpu.width,cpu.height,cpu.color);
      drawball(ball.x,ball.y,ball.radius,ball.color);
}

canvas.addEventListener("mousemove",movePaddle);

function movePaddle(event)
{
      let rect=canvas.getBoundingClientRect();
      user.y=event.clientY-rect.top-user.height/2;
}
function collision(b,p){
      b.top=b.y-b.radius;
      b.bottom=b.y+b.radius;
      b.left=b.x-b.radius;
      b.right=b.x+b.radius;

      p.top=p.y;
      p.bottom=p.y+p.height;
      p.left=p.x;
      p.right=p.x+p.width;

      return b.right>p.left && b.bottom>p.top && b.left< p.right && b.top<p.bottom;
}
function resetBall(){
        ball.x=canvas.width/2;
        ball.y=canvas.height/2;
        ball.speed=7;
        ball.velocityx=-ball.velocityx;
}
function update(){
  ball.x += ball.velocityx;
  ball.y += ball.velocityy;

  cpu.y+=(ball.y-(cpu.y+cpu.height/2))*0.1;

  if(ball.y + ball.radius>canvas.height || ball.y-ball.radius <0){
    wallsound.play();
  ball.velocityy=-ball.velocityy;
  }

  let player=(ball.x<canvas.width/2)?user:cpu;
  if(collision(ball,player))
  {
    paddlesound.play();
    let collidePoint=ball.y-(player.y+player.height/2);
    collidePoint=collidePoint/(player.height/2);
    let angleRad=collidePoint*Math.PI/4;
    let direction=(ball.x<canvas.width/2)?1:-1;
    ball.velocityx=direction*ball.speed*Math.cos(angleRad);
    ball.velocityy=ball.speed*Math.sin(angleRad);
    ball.speed+=0.2;
  }

  if(ball.x-ball.radius<0)
  {
    cpu.score++;
    scoresound.play();
    resetBall();

  }
  else if(ball.x+ball.radius>canvas.width)
  {
    user.score++;
    scoresound.play();
    resetBall();
  }
}

function gameinit(){
      update();
      render();
}

const framePerSecond=50;
let loop=setInterval(gameinit,1000/framePerSecond);
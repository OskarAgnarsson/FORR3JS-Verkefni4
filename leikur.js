const FPS = 60;

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let yes = new Skip(30,50,"lime");

document.addEventListener("keydown",keyDown);
document.addEventListener("keyup",keyUp);

function Asteroid(x,y,velX,velY,color,size) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
    this.color = color;
    this.size = size;
}


function Skip(speed,size,color) {
    this.x = canvas.width / 2;
    this.y = canvas.height / 2;
    this.speed = speed;
    this.angle = 90 / 180 * Math.PI;
    this.radius = size / 2;
    this.size = size;
    this.rotation = 0;
    this.color = color;
    this.thrusting = false;
    this.velocity = [0,0];
}

Skip.prototype.draw = function() {
    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.size / 20;
    ctx.beginPath();
    ctx.moveTo(this.x + 4 / 3 * this.radius * Math.cos(this.angle),this.y - 4 / 3 * this.radius * Math.sin(this.angle));
    ctx.lineTo(this.x - this.radius * (2 / 3 * Math.cos(this.angle) + Math.sin(this.angle)),this.y + this.radius * (2 / 3 * Math.sin(this.angle) - Math.cos(this.angle)));
    ctx.lineTo(this.x - this.radius * (2 / 3 * Math.cos(this.angle) - Math.sin(this.angle)), this.y + this.radius * (2 / 3 * Math.sin(this.angle) + Math.cos(this.angle)));
    ctx.closePath();
    ctx.stroke();
    console.log(this.x - this.radius * (2 / 3 * Math.cos(this.angle) + Math.sin(this.angle)),this.y + this.radius * (2 / 3 * Math.sin(this.angle) - Math.cos(this.angle)));
    console.log(this.x - this.radius * (2 / 3 * Math.cos(this.angle) - Math.sin(this.angle)), this.y + this.radius * (2 / 3 * Math.sin(this.angle) + Math.cos(this.angle)));
    console.log(this.x + 4 / 3 * this.radius * Math.cos(this.angle),this.y - 4 / 3 * this.radius * Math.sin(this.angle));
}

Skip.prototype.addRotation = function() {
    this.angle += this.rotation;
}

function keyDown(e,skip = yes) {
    switch(e.keyCode) {
        case 37:
            skip.rotation = 360 / 180 * Math.PI * FPS;
            break;
        case 39:
            skip.rotation = -360 / 180 * Math.PI * FPS;
            break;
        case 38:
            skip.thrusting = true;
            break;
    }
}

function keyUp(e,skip = yes) {
    switch(e.keyCode) {
        case 37 || 65:
            skip.rotation = 0;
            break;
        case 39 || 68:
            skip.rotation = 0;
            break;
        case 38 || 87:
            skip.thrusting = false;
            break;
    }
}

setInterval(update,1000 / FPS);

function update(){
  ctx.fillStyle = "black";
  ctx.fillRect(0,0,canvas.width,canvas.height);
  yes.addRotation();
  yes.draw();
}
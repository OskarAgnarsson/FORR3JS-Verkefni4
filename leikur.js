const FPS = 60;
const FRICTION = 0.6;
const MAX_SPEED = 20;

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let yes = new Skip(20,50,"lime");

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
    this.angle += this.rotation;
    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.size / 20;
    ctx.beginPath();
    ctx.moveTo(
    this.x + 4 / 3 * this.radius * Math.cos(this.angle),
    this.y - 4 / 3 * this.radius * Math.sin(this.angle)
    );
    ctx.lineTo(
    this.x - this.radius * (2 / 3 * Math.cos(this.angle) + Math.sin(this.angle)),
    this.y + this.radius * (2 / 3 * Math.sin(this.angle) - Math.cos(this.angle))
    );
    ctx.lineTo(
    this.x - this.radius * (2 / 3 * Math.cos(this.angle) - Math.sin(this.angle)),
    this.y + this.radius * (2 / 3 * Math.sin(this.angle) + Math.cos(this.angle))
    );
    ctx.closePath();
    ctx.stroke();
}

Skip.prototype.fly = function() {
    if (this.thrusting && this.velocity[0] <= MAX_SPEED && this.velocity[0] >= -MAX_SPEED && this.velocity[1] <= MAX_SPEED && this.velocity[1] >= -MAX_SPEED){
        this.velocity[0] += this.speed * Math.cos(this.angle) / FPS;
        this.velocity[1] -= this.speed * Math.sin(this.angle) / FPS;
    } else {
        this.velocity[0] -= FRICTION * this.velocity[0] / FPS;
        this.velocity[1] -= FRICTION * this.velocity[1] / FPS;
    }
    this.x += this.velocity[0];
    this.y += this.velocity[1];
    if (this.x < 0 - this.radius) {
        this.x = canvas.width + this.radius;
    } else if (this.x > canvas.width + this.radius) {
        this.x = 0 - this.radius;
    }
    if (this.y < 0 - this.radius) {
        this.y = canvas.height + this.radius;
    } else if (this.y > canvas.height + this.radius) {
        this.y = 0 - this.radius;
    }
}

function keyDown(e,skip = yes) {
    switch(e.keyCode) {
        case 37:
            skip.rotation = 360 / 180 * Math.PI / FPS;
            break;
        case 39:
            skip.rotation = -360 / 180 * Math.PI / FPS;
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
  yes.fly();
  yes.draw();
  console.log(yes.velocity);
}
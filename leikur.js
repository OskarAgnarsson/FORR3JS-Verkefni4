const FPS = 60;
const FRICTION = 0.8;
const MAX_SPEED = 15;
const ROID_COLORS = ["white","lightgray","darkred","red"];

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
const yes = new Skip(20,50,"lime");

document.addEventListener("keydown",keyDown);
document.addEventListener("keyup",keyUp);

function Asteroid(x,y,speed,color,size) {
    this.x = x;
    this.y = y;
    this.velX = Math.random() * speed / FPS * (Math.random() < 0.5 ? 1 : -1);
    this.velY = Math.random() * speed / FPS * (Math.random() < 0.5 ? 1 : -1);
    this.color = color;
    this.radius = size;
    this.angle = Math.random() * Math.PI * 2;
}

Asteroid.prototype.draw = function() {
    break;
}

function Belt(size) {
    this.level = 0;
    this.belt = [];
    this.roidNum = size;
    this.roidsLeft = this.roidNum;
}

Belt.prototype.create = function() {
    let x,y;
    let roidSize = Math.ceil(Math.random()*50);
    for (let i = 0; i < this.roidNum + this.level; i++) {
        while (distBetweenPoints(yes.x,yes.y,x,y) < roidSize * 2 + yes.radius) {
            x = Math.floor(Math.random() * canvas.width);
            y = Math.floor(Math.random() * canvas.height);
        }
        this.belt.push(new Asteroid(x,y,MAX_SPEED,ROID_COLORS[Math.floor(Math.random()*ROID_COLORS.length)],Math.ceil(roidSize / 2)));
    }
}

Belt.prototype.drawAsteroids = function() {
    break;
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
        case 65:
            yes.rotation = 360 / 180 * Math.PI / FPS;
            break;
        case 68:
            yes.rotation = -360 / 180 * Math.PI / FPS;
            break;
        case 87:
            yes.thrusting = true;
            break;
    }
}

function keyUp(e) {
    switch(e.keyCode) {
        case 65:
            yes.rotation = 0;
            break;
        case 68:
            yes.rotation = 0;
            break;
        case 87:
            yes.thrusting = false;
            break;
    }
}

function distBetweenPoints(x1,y1,x2,y2) {
    return Math.sqrt(Math.pow(x2 - x1,2) + Math.pow(y2 - y1,2));
}

setInterval(update,1000 / FPS);

function update(){
  ctx.fillStyle = "black";
  ctx.fillRect(0,0,canvas.width,canvas.height);
  yes.fly();
  yes.draw();
  console.log(yes.velocity);
}
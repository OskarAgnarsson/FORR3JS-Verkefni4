let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

function Asteroid(x,y,velX,velY,color,size) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
    this.color = color;
    this.size = size;
}

Asteroid.prototype.draw = function() {
    ctx.moveTo(this.x,this.y);
    ctx.fillStyle = this.color;
    ctx.lineTo(this.x+1.7*this.size,this.y+0.5*this.size);
    ctx.lineTo(this.x+2.4*this.size,this.y+1.5*this.size);
    ctx.lineTo(this.x+4*this.size,this.y+1.2*this.size);
    ctx.lineTo(this.x+4.4*this.size,this.y-0.3*this.size);
    ctx.lineTo(this.x+5.7*this.size,this.y-1*this.size);
    ctx.lineTo(this.x+6.3*this.size,this.y-3.5*this.size);
    ctx.lineTo(this.x+5*this.size,this.y-5*this.size);
    ctx.lineTo(this.x+3*this.size,this.y-6*this.size);
    ctx.lineTo(this.x+2*this.size,this.y-4.5*this.size);
    ctx.lineTo(this.x+0.5*this.size,this.y-5*this.size);
    ctx.lineTo(this.x-0.5*this.size,this.y-3.7*this.size);
    ctx.lineTo(this.x+0.3*this.size,this.y-2.5*this.size);
    ctx.lineTo(this.x-0.8*this.size,this.y-1.7*this.size);
    ctx.lineTo(this.x,this.y);
    ctx.stroke();
    ctx.fill();
}

function yes(){
    yes = new Asteroid(640,360,5,5,"blue",20);
    yes.draw();
    yes1 = new Asteroid(100,100,5,5,"purple",12);
    yes1.draw();
    yes2 = new Asteroid(300,200,5,5,"gray",10);
    yes2.draw();
}

/*for (let i = 100; i<=1060; i+=10)
        {
          ctx.fillStyle = 'rgb(200, 0, 0)';
          ctx.fillRect(i,100+Math.cos(i*360)*30*Math.tan(i*360),Math.cos(i*360)*2*Math.tan(i*360),Math.cos(i*360)*-60*Math.tan(i*360));
          ctx.lineTo(i,100+Math.cos(i*360)*Math.tan(i*360)*30);
        }
        ctx.stroke();

        ctx.moveTo(100,115);
        for (let i = 100; i<=1060; i+=10) {
          ctx.lineTo(i,100+Math.cos(i*360)*Math.tan(i*360)*-30);
        }
        ctx.stroke();*/
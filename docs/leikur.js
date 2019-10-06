const SHOW_BOUNDING = false;

const FPS = 60;//Hversu oft update fallið keyrir á sekúndu
const FRICTION = 0.8;//Viðnám svo skip hægi á sér
const MAX_SPEED = 15;//Max hraði á skipi
const SHIP_LIVES = 3;//Líf skips
const ROID_COLORS = ["crimson","maroon","darkred","red"];//Litir fyrir loftsteina
const ROID_VERT = 10;//Hversu margar hliðar eru á loftsteinum
const ROID_JAG = 0.4;//Hversu óreglulegur loftsteinn er
const ROID_SPEED = 40;//Hraði á loftsteinum
const CRAZY_MODE = false;//Experimental physics
const BLINK_DUR = 0.1;//Hversu lengi blikk endast
const IFRAMES = 2;//Hversu lengi skipið blikkar þegar það missir líf eða spawnar
const LASERS_MAX = 15;//Hversu margir geislar geta verið í einu
const LASER_COLORS = ["red","orange","yellow","green","cyan","blue","blueviolet"];//Litir fyrir geisla
const LARGE_POINTS = 500;//Hversu mörg stig fyrir stóra lofsteina
const MED_POINTS = 250;//etc
const SMALL_POINTS = 100;//etc
const SAVE_KEY_SCORE = "highscore";//Geymir high score með local storage
const TEXT_FADE_TIME = 2;//Hversu langan tíma það tekur fyrir level textann að hverfa

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let ship = new Skip(20,50,"lime");//Skipið
let score = 0;//teljari fyrir score
let highScore = 0;//teljari fyrir high score
let text,textAlpha;//texti sem kemur upp eftir level og alpha fyrir þann texta

document.addEventListener("keydown",keyDown);//hlustar á hvort það er ýtt á takka
document.addEventListener("keyup",keyUp);

//ASTEROID
//Setur allar breytur fyrir Asteroid
function Asteroid(x,y,speed,color,size,ogRadius = size) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.velX = (Math.random() * (speed - speed * 0.2) + speed * 0.2) / FPS * (Math.random() > 0.5 ? 1 : -1);//Random hraði
    this.velY = (Math.random() * (speed - speed * 0.2) + speed * 0.2) / FPS * (Math.random() > 0.5 ? 1 : -1);
    this.color = color;
    this.colColor = "lime";
    this.radius = size;
    this.mass = 1;
    this.ogRadius = ogRadius;
    this.angle = Math.random() * Math.PI * 2;//angle til að vita hvaða átt asteroid snýr
    this.vert = Math.floor(Math.random() * (ROID_VERT + 1) + ROID_VERT / 2);//stærðfræði
    this.offs = [];
    
    for (let i = 0; i < this.vert; i++) {//Meiri stærðfræði
        this.offs.push(Math.random() * ROID_JAG * 2 + 1 - ROID_JAG);
    }
}

//Teiknar
Asteroid.prototype.draw = function() {
    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.size / 10;
    ctx.beginPath();
    ctx.moveTo(this.x + this.radius * this.offs[0] * Math.cos(this.angle), this.y + this.radius * this.offs[0] * Math.sin(this.angle));
    for (let i = 1; i < this.vert; i++) {
        ctx.lineTo(
            this.x + this.radius * this.offs[i] * Math.cos(this.angle + i * Math.PI * 2 / this.vert),
            this.y + this.radius * this.offs[i] * Math.sin(this.angle + i * Math.PI * 2 / this.vert)
        );
    }
    ctx.closePath();
    ctx.stroke();

    if (SHOW_BOUNDING) {
        ctx.strokeStyle = this.colColor;
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.radius,0,Math.PI * 2, false);
        ctx.stroke();
        this.colColor = "lime";
    }
}

Asteroid.prototype.move = function() {//hreyfir loftsteininn
    this.x += this.velX;
    this.y += this.velY;

    if (this.x < 0 - this.radius) {//Þess if statement láta asteroid aldrei fara fyrir utan canvas
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



//ASTEROID BELT

//Setur allar breytur fyrir beltið
function Belt(size) {
    this.level = 0;
    this.belt = [];//Listi fyrir loftsteina
    this.roidNum = size;
    this.roidsLeft = this.roidNum;
}

Belt.prototype.create = function(skip) {
    let x,y;
    let roidSize;
    this.skip = skip;
    for (let i = 0; i < this.roidNum + this.level; i++) {
        x = Math.floor(Math.random() * canvas.width);//Random x og y staðsetningar
        y = Math.floor(Math.random() * canvas.height);
        roidSize = Math.ceil(Math.random() * (100 - 70) + 70);
        while (distBetweenPoints(skip.x,skip.y,x,y) < roidSize * 2 + skip.radius) {//finnur x og y sem er ekki fyrir skipinu
            x = Math.floor(Math.random() * canvas.width);
            y = Math.floor(Math.random() * canvas.height);
        }
        this.belt.push(new Asteroid(x,y,ROID_SPEED,ROID_COLORS[Math.floor(Math.random()*ROID_COLORS.length)],Math.ceil(roidSize / 2)));//Býr til loftstein og setur í belti
    }
}

Belt.prototype.drawAsteroids = function() {//teiknar alla loftsteinana
    for (let i = 0; i < this.belt.length; i++) {
        this.belt[i].draw();
    }
}

Belt.prototype.moveAsteroids = function() {//hreyfir alla loftsteinana
    for (let i = 0; i < this.belt.length; i++) {
        this.belt[i].move();
    }
}

Belt.prototype.destroy = function(i) {
    let x = this.belt[i].x;//óþarfi, gleymdi að breyta, enginn tími
    let y = this.belt[i].y;
    let speed = this.belt[i].speed;
    let color = this.belt[i].color;
    let ogRadius = this.belt[i].ogRadius;
    let radius = this.belt[i].radius;
    console.log(speed);
    if (radius == ogRadius) {//splittar loftsteinum í tvennt
        this.belt.push(new Asteroid(x,y,speed,color,Math.ceil(ogRadius/2),ogRadius));
        this.belt.push(new Asteroid(x,y,speed,color,Math.ceil(ogRadius/2),ogRadius));
        score += LARGE_POINTS;
    } else if (radius == Math.ceil(ogRadius/2)) {
        this.belt.push(new Asteroid(x,y,speed,color,Math.ceil(ogRadius/4),ogRadius));
        this.belt.push(new Asteroid(x,y,speed,color,Math.ceil(ogRadius/4),ogRadius));
        score += MED_POINTS;
    } else {
        score += SMALL_POINTS;
    }

    if (score > highScore) {
        highScore = score;
        localStorage.setItem(SAVE_KEY_SCORE,highScore);//geymir high score í local storage
    }

    this.belt.splice(i, 1);//eyðir loftstein

    this.roidsLeft--;
}



//LASER

function Laser(x,y,speed,color,radius,angle) {//Setur allar breytur fyrir Laser
    this.x = x;
    this.y = y;
    this.angle = angle;//áttin sem laser snýr
    this.speed = speed;
    this.color = color;
    this.radius = radius;//Stærð lasers
    this.velX = speed * Math.cos(this.angle) / FPS;//Hraði lasers
    this.velY = -speed * Math.sin(this.angle) / FPS;
    this.explodeTime = 0;//nota ekki, enginn tími
    this.dist = 0;//Hversu langt laser er búinn að ferðast
}

//teiknar laser
Laser.prototype.draw = function() {
    if (this.explodeTime == 0) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.radius,0,Math.PI * 2, false);
        ctx.fill();
    }
}

Laser.prototype.move = function() {

    this.x += this.velX;
    this.y += this.velY;

    this.dist += Math.sqrt(Math.pow(this.velX, 2) + Math.pow(this.velY, 2));//telur hversu langt laser er búinn að ferðast

    //Lætur laser ekki fara fyrir utan skjá
    if (this.x < 0) {
        this.x = canvas.width;
    } else if (this.x > canvas.width) {
        this.x = 0;
    }
    if (this.y < 0) {
        this.y = canvas.height;
    } else if (this.y > canvas.height) {
        this.y = 0;
    }
}

//Tjékkar hvort laser hitti asteroid
Laser.prototype.checkHit = function(astBelt) {
    for (let i = 0; i < astBelt.belt.length; i++) {
        if (distBetweenPoints(this.x,this.y,astBelt.belt[i].x,astBelt.belt[i].y) < this.radius + astBelt.belt[i].radius) {
            astBelt.destroy(i);
            return true;
        }
    }
}


//SKIP


//Setur allar breytur fyrir skipið
function Skip(speed,size,color) {
    this.x = canvas.width / 2;
    this.y = canvas.height / 2;
    this.speed = speed;
    this.angle = 90 / 180 * Math.PI;
    this.radius = size / 2;
    this.size = size;
    this.mass = size*3;//Bara notað í CRAZY_MODE fyrir eðlisfræði
    this.lives = SHIP_LIVES;
    this.dead = false;
    this.rotation = 0;
    this.color = color;
    this.thrusting = false;//Segir til um hvort player er að fara áfram
    this.velocity = [0,0];//Heldur utan um hraða skipsins
    this.blinkNum = Math.ceil(IFRAMES / BLINK_DUR);
    this.blinkTime = Math.ceil(BLINK_DUR * FPS);
    this.blinkOn = this.blinkNum % 2 == 0;
    this.lasers = [];//Listi yfir all lasera
    this.canShoot = true;
}
//Teiknar skipið, fullt af óskiljanlegri stærðfræði
Skip.prototype.draw = function() {
    this.blinkOn = this.blinkNum % 2 == 0;
    if (this.blinkOn && !this.dead) {
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
    //Lætur skipið blikka
    if (this.blinkNum > 0) {
        this.blinkTime--;

        if (this.blinkTime == 0) {
            this.blinkTime = Math.ceil(0.1 * 60);
            this.blinkNum--;
        }
    }
    //Sýnir collider
    if (SHOW_BOUNDING && !this.dead) {
        ctx.strokeStyle = "lime";
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.radius,0,Math.PI * 2, false);
        ctx.stroke();
    }
}
//Færir skipið
Skip.prototype.fly = function() {
    if (!this.dead){
        if (this.thrusting && this.velocity[0] <= MAX_SPEED && this.velocity[0] >= -MAX_SPEED && this.velocity[1] <= MAX_SPEED && this.velocity[1] >= -MAX_SPEED){
            this.velocity[0] += this.speed * Math.cos(this.angle) / FPS;//Bætir við hröðun
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
}

//Lækkar líf ef player verðr hittur og resetar staðsetningu hans
Skip.prototype.damage = function() {
    this.lives--;
    if (this.lives > 0) {
        this.reset();
    } else {
        this.dead = true;
    }
}

//Gáir hvort player hefur hitt eitthvað
Skip.prototype.checkCollisions = function(belt) {
    if (this.blinkNum == 0 && !this.dead) {
        for (let i = 0; i < belt.length; i++) {
            if (distBetweenPoints(this.x,this.y,belt[i].x,belt[i].y) < this.radius + belt[i].radius) {
                if (CRAZY_MODE) {//Loftsteinar skoppa af player
                    let vx2 = ((2 * this.mass) / (this.mass + belt[i].mass) * this.velocity[0] + (belt[i].mass - this.mass) / (this.mass + belt[i].mass) * belt[i].velX);
                    let vy2 = ((2 * this.mass) / (this.mass + belt[i].mass) * this.velocity[1] + (belt[i].mass - this.mass) / (this.mass + belt[i].mass) * belt[i].velY);
                    if (vx2 > 0 && vx2 > ROID_SPEED*2) {
                        vx2 = ROID_SPEED*2;
                    } else if (vx2 < 0 && vx2 < -ROID_SPEED*2) {
                        vx2 = -ROID_SPEED*2;
                    }

                    if (vy2 > 0 && vy2 > ROID_SPEED*2) {
                        vy2 = ROID_SPEED*2;
                    } else if (vy2 < 0 && vy2 < -ROID_SPEED*2) {
                        vy2 = -ROID_SPEED*2;
                    }
                    belt[i].velX = vx2;
                    belt[i].velY = vy2;
                }
                belt[i].colColor = "blue";
                this.damage();
            }
        }
    }
}

Skip.prototype.shoot = function() {//Skýtur laser
    if (this.canShoot && this.lasers.length < LASERS_MAX) {
        let laserColor = LASER_COLORS[Math.floor(Math.random() * LASER_COLORS.length)];
        this.lasers.push(//Býr til laser object og setur í laser listann
            new Laser(
            (this.x + 4/3 * this.radius * Math.cos(this.angle)),
            (this.y - 4/3 * this.radius * Math.sin(this.angle)),
            MAX_SPEED * 30,
            laserColor,
            this.size / 15,
            this.angle
            ));
        this.canShoot = false;
    }
}

//teiknar alla lasera
Skip.prototype.drawLasers = function() {
    if (this.lasers.length > 0){
        for (let i = 0; i < this.lasers.length; i++) {
            this.lasers[i].draw();
        }
    }
}

//hreyfir alla lasera og eyðir eftir einhverja vegalengd
Skip.prototype.moveLasers = function() {
    for (let i = 0; i < this.lasers.length; i++) {
        if (this.lasers[i].dist > 0.01 * FPS * canvas.width) {
            this.lasers.splice(i,1);
            continue;
        } 
    
        if (this.lasers[i].explodeTime > 0) {
            this.lasers[i].explodeTime--;
    
            if (this.lasers[i].explodeTime == 0) {
                this.lasers.splice(i,1);
                continue;
            }
        } else { 
            this.lasers[i].move();
        }
    }
}

//Gáir hvort einhver laser hefur hitt eitthvað
Skip.prototype.checkHits = function(astBelt) {
    if (this.lasers.length != 0) {
        for (let i = 0; i < this.lasers.length; i++) {
            if (this.lasers[i].checkHit(astBelt)) {
                this.lasers.splice(i,1);
            }
        }
    }
}

//Færir skipið í byrjunarstöðu
Skip.prototype.reset = function() {
    this.x = canvas.width / 2;
    this.y = canvas.height / 2;
    this.blinkNum = Math.ceil(IFRAMES / BLINK_DUR);
    this.blinkTime = Math.ceil(BLINK_DUR * FPS);
    this.velocity = [0,0];
    this.angle = 90 / 180 * Math.PI;
}

function keyDown(e) {

    if (ship.dead) {
        return;
    }

    switch(e.keyCode) {
        case 65://Snýr skipinu ef þú ýtir á A eða D
            ship.rotation = 360 / 180 * Math.PI / FPS;
            break;
        case 68:
            ship.rotation = -360 / 180 * Math.PI / FPS;
            break;
        case 87://Færir skipið áfram ef þú ýtir á W
            ship.thrusting = true;
            break;
        case 32://Skýtur ef þú ýtir á Space
            ship.shoot();
            break;
    }
}

function keyUp(e) {

    if (ship.dead) {
        return;
    }

    switch(e.keyCode) {
        case 65:
            ship.rotation = 0;
            break;
        case 68:
            ship.rotation = 0;
            break;
        case 87:
            ship.thrusting = false;
            break;
        case 32:
            ship.canShoot = true;
            break;
    }
}

//Segir til um hvað er langt á milli punkta
function distBetweenPoints(x1,y1,x2,y2) {
    return Math.sqrt(Math.pow(x2 - x1,2) + Math.pow(y2 - y1,2));
}

//gerir nýtt level eftir að player deyr eða drepur alla loftsteinana
function newLevel(astBelt,skip) {
    if (astBelt.belt.length == 0) {
        skip.reset();

        astBelt.level++;
        astBelt.create(skip);
        text = "Level " + astBelt.level;
        textAlpha = 1.0;
    } else if (skip.dead) {
        astBelt.belt = [];
        skip.dead = false;
        skip.lives = SHIP_LIVES;
        skip.reset();
        astBelt.create(skip);
        text = "Level " + astBelt.level;
        textAlpha = 1.0;
    }
}

function gameOver() {
    ship.dead = true;
    text = "Game Over";
    textAlpha = 1.0;
}

function newGame(astBelt,skip) {
    astBelt.level = 0;
    skip.lives = SHIP_LIVES;
    score = 0;
    skip.reset();

    let scoreStr = localStorage.getItem(SAVE_KEY_SCORE);
    if (scoreStr == null) {
        highScore = 0;
    } else {
        highScore = parseInt(scoreStr);
    }
}
//teiknar level texta
function drawText() {
    if (textAlpha > 0) {
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillstyle = "rgba(255,255,255," + textAlpha + ")";
        ctx.font = "small-caps 60px dejavu sans mono";
        ctx.fillText(text,canvas.width / 2,canvas.height * 0.85);
        textAlpha -= (1.0 / TEXT_FADE_TIME / FPS);
    } else if (ship.dead) {
        newGame(belti,ship);
    }
}
//Teiknar score
function drawScore() {
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "white";
    ctx.font = "60px dejavu sans mono";
    ctx.fillText(score, canvas.width * 0.8, canvas.height * 0.15);
}
//teiknar high score
function drawHighScore() {
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "white";
    ctx.font = "45px dejavu sans mono";
    ctx.fillText("HIGH SCORE "+ highScore,canvas.width * 0.75, canvas.height * 0.9);
}
//Teiknar hversu mörg líf player hefur
function drawLives() {
    ctx.textAlign = "center";
    ctx.textBaseLine = "middle";
    ctx.fillStyle = "white";
    ctx.font = "60px dejavu sans mono";
    ctx.fillText("LIVES " + ship.lives,canvas.width * 0.2,canvas.height * 0.15);
}

setInterval(update,1000 / FPS);

let belti = new Belt(3);    
newGame(belti,ship);
console.log(belti.belt[0]);
function update(){//keyrir allt
    newLevel(belti,ship);
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    belti.moveAsteroids();
    belti.drawAsteroids();
    ship.checkCollisions(belti.belt);
    ship.fly();
    ship.draw();
    ship.drawLasers();
    ship.moveLasers();
    ship.checkHits(belti);
    drawText();
    drawHighScore();
    drawScore();
    drawLives();
}
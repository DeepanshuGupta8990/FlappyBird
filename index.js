const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
const CW = canvas.width = window.innerWidth;
const CH = canvas.height = 893;

let lastTime = 0;

let spacePressed = false;
let score = 0;


class Player {
    constructor(game) {
        this.game = game;
        this.x = 200;
        this.y = 100;
        this.spriteWidth = 253;
        this.spriteHeight = 207;
        this.width = this.spriteWidth / 2;
        this.height = this.spriteHeight / 2;
        this.image = document.getElementById("bird")
        this.speedX = 0;
        this.speedY = 0;
        this.gravity = 3;
        this.maxSpeedY = 8;
        this.framX = 0;
        this.maxFrame = 14;
        this.frameInterval = 10;
        this.frameTimer = 0;
        this.angle = 0;
        this.particleTimer = 0;
        this.particleInterval = 20;
    }
    update(deltaTime) {
        this.x += this.speedX;
        this.y += this.speedY + this.gravity + (Math.sin(this.angle) * 4);
        this.angle += 0.3;
        if (spacePressed) {
            this.speedY = -this.maxSpeedY;
        } else { this.speedY = 0; }

        for(let i=0; i<3; i++){
            this.game.particles.push(new Particle(this.game, this.x + this.width / 4, this.y + this.height / 2));
        }

        if (this.framX >= this.maxFrame) { this.framX = 0; }
        else { this.framX++ }
    }
    draw(ctx) {
        ctx.drawImage(this.image, this.framX * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height)
    }
}

class Particle {
    constructor(game, x, y) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.size = Math.random() * 10 + 3;
        this.speedY = (Math.random() * 4) - 2;
        this.markedForDeletion = false;
        this.color = `hsl(${this.game.hue},100%,50%)`
        this.game.hue += 2;
        // console.log(this.game.particles)
    }
    update() {
   
        this.x -= this.game.gameSpeed;
        this.y += this.speedY;
        this.size -= 0.1
        if (this.size < 0.5) { this.markedForDeletion = true }
    
        if (this.markedForDeletion) {
            this.game.particles.splice(this.game.particles.indexOf(this), 1)
        }
    }
    draw(ctx) {
  
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill();
    }
}

class PillarsUp{
    constructor(game){
        this.game = game;
        this.x = Math.random() * 20 +this.game.width;
        this.y = 0
        this.width = Math.random() * 40 + 10;
        this.height = Math.random() * 120 + this.game.height/5;
        this.color = `hsl(${Math.random() * 360},100%,50%)`
        this.markedForDeletion = false;
    }
    draw(ctx){
       ctx.fillStyle = this.color;
       ctx.fillRect(this.x,this.y,this.width,this.height)
    }
    update(){
       this.x -= this.game.gameSpeed;
       if(this.x < -this.width){
        this.markedForDeletion = true
    }
       if(this.markedForDeletion){
        this.game.pillarsArray.splice(this.game.pillarsArray.indexOf(this),1);
       }
    }

}
class PillarsDown{
    constructor(game){
        this.game = game;
        this.x = Math.random() * 20 +this.game.width;;
        this.y = this.game.height/1.3 - Math.random() *100-50;
        this.width = Math.random() * 40 + 10;
        this.height = this.game.height - this.y;
        this.color = `hsl(${Math.random() * 360},100%,50%)`
        this.markedForDeletion = false;
        // console.log(this.game.pillarsArray)
    }
    draw(ctx){
       ctx.fillStyle = this.color;
       ctx.fillRect(this.x,this.y,this.width,this.height)
    }
    update(){
       this.x -= this.game.gameSpeed;
       if(this.x < -this.width){
        this.markedForDeletion = true
    }
       if(this.markedForDeletion){
        this.game.pillarsArray.splice(this.game.pillarsArray.indexOf(this),1);
       }
    }

}

class BackGround {
    constructor(game) {
        this.game = game;
        this.image = document.getElementById("background")
        this.width = 1800;
        this.height = 893;
        this.x = 0;
        this.x1 = this.width;
        this.y = 0;
    }
    draw(ctx) {
        ctx.drawImage(this.image, 0, 0, this.width, this.height, this.x, this.y, this.width, this.height);
        ctx.drawImage(this.image, 0, 0, this.width, this.height, this.x1, this.y, this.width, this.height);
    }
    update() {
        if (this.x < -this.width) { this.x = this.width - this.game.gameSpeed*2 }
        else { this.x -= this.game.gameSpeed; }
        if (this.x1 < -this.width) { this.x1 = this.width - this.game.gameSpeed*2 }
        else { this.x1 -= this.game.gameSpeed; }
    }
}

class Game {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.gameSpeed = 2;
        this.hue = 0;
        this.player = new Player(this);
        this.backGround = new BackGround(this)
        this.particles = [];
        this.pillarsArray = [];
        this.pillarsInterval = 2000;
        this.pillarsTimer = 0;
        window.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                spacePressed = true;
            }
        })
        window.addEventListener('keyup', (e) => {
            if (e.code === 'Space') {
                spacePressed = false;
            }
        })
    }
    update(deltaTime) {
        this.backGround.update();
        this.player.update(deltaTime);
        this.particles.forEach((particle) => {
            particle.update();
        })

        this.pillarsArray.forEach((pillar)=>{
            pillar.update();
        })
         
        if(this.pillarsTimer > this.pillarsInterval){
            this.pillarsTimer = 0;
            if(Math.random() > 0.5){
                this.pillarsArray.push(new PillarsUp(this))
                this.pillarsArray.push(new PillarsDown(this))
            }
            else{
                this.pillarsArray.push(new PillarsDown(this))
            }
        }
        else{
            this.pillarsTimer += deltaTime;
        }

        this.collisionDetection();
    }
    draw(ctx) {
        this.backGround.draw(ctx)
        this.particles.forEach((particle) => {
            particle.draw(ctx);
        })
        this.player.draw(ctx);
      
        this.pillarsArray.forEach((pillar)=>{
            pillar.draw(ctx)
        })
    }
    collisionDetection(){
        this.pillarsArray.forEach((pillar)=>{
         if(entry){
            if(this.player.x + this.player.width > pillar.x &&
                pillar.x + pillar.width > this.player.x &&
                this.player.y + this.player.height > pillar.y &&
                pillar.y + pillar.height > this.player.y){
                 alert('Game over')
                 location.reload();
                 entry = fasle;
                }
         }
        })
    }

}
const game = new Game(CW, CH)
const entry = true
function animate(timeStamp) {
    let deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    // ctx.clearRect(0, 0, CW, CH);
    ctx.fillStyle = "rgba(0,0,0,0.4)"
    ctx.fillRect(0, 0, CW, CH)
    game.draw(ctx);
    game.update(deltaTime);
    requestAnimationFrame(animate);
}
animate(0);
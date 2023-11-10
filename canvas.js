let canvas = document.querySelector("canvas");
let c = canvas.getContext("2d");
let score = document.querySelector('#score');
let start = document.querySelector('#start');
let board = document.querySelector('#board');
let endScore = document.querySelector('#endScore');
let badGuy = document.querySelector('#badGuy');
let goodGuy = document.querySelector('#goodGuy');
let gun = document.querySelector('#gun');
canvas.width = innerWidth;
canvas.height = innerHeight;

let { cos, sin, random, atan2, PI } = Math;


/////////////////////////////////////////////////
// imported codes

function randomIntFromRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }
  
  function randomColor(colors) {
    return colors[Math.floor(Math.random() * colors.length)]
  }
  
  function distance(x1, y1, x2, y2) {
    const xDist = x2 - x1
    const yDist = y2 - y1
  
    return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2))
  }


// End of imported codes
/////////////////////////////////////////////////////

//////////////////////////////////////////////
// event listeners

window.addEventListener('resize', function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init()
})
let mouse = {
    x: canvas.width / 2,
    y: canvas.height / 2
}
addEventListener("mousemove", function(e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY
})


// end of event listeners
////////////////////////////////////////////
// Classes

let angle = 0;
let friction = 1;

class Projectile {
    constructor (x, y, radius, color, velocity)
    {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
        this.alpha = 1;
    }

    draw () {
        c.save();
        c.globalAlpha = this.alpha;
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = this.color;
        c.fill();
        c.closePath();
        c.restore();
    }
    update () {
        this.draw()
        this.velocity.x *= friction;
        this.velocity.y *= friction;
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.alpha -= 0.01;
    }
}

let playerFriction = 0.9;
class Player {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.recoilRadius = 8;
        this.velocity = {
            x: 0,
            y: 0
        }
        this.dx = 0;
        this.dy = 0;
    }

    draw () {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        // c.fillStyle = this.color;
        // c.fill();
        c.drawImage(gun, this.x - this.radius * 3.45, this.y - this.radius * 3.37, 100, 100)
        c.strokeStyle = this.color
        c.stroke();
        c.closePath();
    }
    update(angle) {
        this.draw();
        this.dx = cos(angle);
        this.dy = sin(angle);
        let center = {
            x: canvas.width / 2,
            y: canvas.height / 2
        }
        if (this.x < center.x + this.recoilRadius &&
            this.x > center.x - this.recoilRadius &&
            this.y < center.y + this.recoilRadius &&
            this.y > center.y - this.recoilRadius
            ) {
            this.x -= this.dx * playerFriction;
            this.y -= this.dy * playerFriction;
        } else {
            gsap.to(this, {
                x: center.x + (x < center.x ? - 3 : 3),
                y: center.y + (y < center.y ? - 3 : 3)
            })
            // this.x += this.dx * friction;
            // this.y += this.dy * friction;
        }
    }
}

class Enemy {
    constructor (x, y, radius, color, velocity)
    {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity
    }

    draw () {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.drawImage(badGuy, this.x - this.radius, this.y - this.radius, this.radius + 20, this.radius + 20)
        // c.fillStyle = this.color;
        // c.fill();
        c.strokeStyle = this.color;
        c.stroke()
        c.closePath();
    }
    update () {
        this.draw()
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }
}
let enemyTime = 1700;
function sendEnemy() {
    setInterval(()=> {
        let radius = (30 - 5) * random() + 5;
        let x , y;
        let enemySpeed = 1.5;
        if (random() < 0.5) {
            x = random() < 0.5 ? 0 - radius : canvas.width + radius;
            y = random() * canvas.height;
        } else {
            x = random() * canvas.width;
            y = random() < 0.5 ? 0 - radius : canvas.height + radius;
        }
        let angle = Math.atan2(canvas.height / 2 - y, canvas.width / 2 - x)
        let color = `hsl(${Math.random() * 360}, 50%, 50%)`;
        let velocity = {
            x: cos(angle) * enemySpeed,
            y: sin(angle) * enemySpeed
        }
        enemies.push(new Enemy(x, y, radius, color, velocity))
    }, enemyTime)
}
let x = canvas.width / 2;
let y = canvas.height / 2;

let player = new Player(x, y, 15, 'white');
let projectiles = [];
let enemies = [];
let particles = [];

function init() {
    player = new Player(canvas.width / 2, canvas.height / 2, 15, 'white');
    projectiles = [];
    enemies = [];
    particles = [];
    score_val = 0;
    score.innerHTML = score_val;
    endScore.innerHTML = 0;
}


////////////////////////////////////////////////////////////////////
// galactic effects
  const galColors = ['#2185C5', '#7ECEFD', 'orange','#FFF6E5', '#FF7F66']

  // Objects
  class Galaxy {
    constructor(x, y, radius, color) {
      this.x = x 
      this.y = y 
      this.radius = radius
      this.color = color
    }
  
    draw() {
      c.beginPath();
      c.arc(this.x, this.y, this.radius, 0, PI * 2, false);
      c.shadowColor = this.color;
      c.shadowBlur = 15;
      c.fillStyle = this.color;
      c.fill();
      c.closePath();
    }
  
    update() {
      this.draw();
    }
  
  }
  
  function findBigSize () {
    if (canvas.width > canvas.height)
      return canvas.width + 300;
    else
      return canvas.height + 300;
  }
  
  // Implementation for formation of galaxies
  let planets;
  function initGalaxy() { 
    planets = [];
    let particlesCount = 800;
    for (let i = 0; i < particlesCount; i++) {
      let color = randomColor(galColors);
      let radius = 1 * random() + 0.08;
      let x = findBigSize() * random()  - canvas.width / 2;
      let y = findBigSize() * random() - canvas.height / 2;
      planets.push(new Galaxy(x, y, radius, color));
    }
  }
  
  let rotateRadians = 0;
  let a = 1;
  
  let rotateDeg = 0;

//end of galactic effects
////////////////////////////////////////////////////////////////////////////////////
// create new bullet when a person click;
let bulletSpeed = 12;
let bulletSize = 4;
let bulletColor = "#737171";

// when a person click on the screen
window.addEventListener('click', (e) => {
    angle = Math.atan2(e.clientY - canvas.height / 2, e.clientX - canvas.width / 2)
    const projectile = new Projectile(
        canvas.width / 2,
        canvas.height / 2,
        bulletSize, 
        bulletColor, 
        {
            x: cos(angle) * bulletSpeed,
            y: sin(angle) * bulletSpeed
        }
    )
    // console.log(projectile)
    projectiles.push(projectile);
})
// when a person press enter or f key
window.addEventListener("keydown", function(e) {
    // Check if the key pressed is the Enter key
    if (e.key == "Enter" || e.key == "f" || e.key == "F") {
        angle = Math.atan2(mouse.y - canvas.height / 2, mouse.x - canvas.width / 2)
        const projectile = new Projectile(
            canvas.width / 2,
            canvas.height / 2,
            bulletSize, 
            bulletColor, 
            {
                x: cos(angle) * bulletSpeed,
                y: sin(angle) * bulletSpeed
            }
        )
        // console.log(projectile)
        projectiles.push(projectile);
    }
});

//animation loop
let score_val = 0;
let animId;
function animate() {
    animId = requestAnimationFrame(animate);
    c.fillStyle = 'rgba(0, 0, 0, 0.1)'
    c.fillRect(0, 0, innerWidth, innerHeight);
    // draw player
    player.update(angle);
    // draw particles
    particles.forEach((particle, i) => {
        if (particle.alpha <= 0) {
            particles.splice(i, 1);
        } else {
            particle.update();
        }
    });
    // remove projecticle off the screen
    projectiles.forEach((projectile, i )=> {
        if (projectile.x + projectile.radius < 0 ||
            projectile.x - projectile.radius > canvas.width ||
            projectile.y + projectile.radius < 0 ||
            projectile.y - projectile.radius > canvas.width
            ) {  
        setTimeout(() => {
            projectiles.splice(i, 1);
        }, 0);
        }
        projectile.update();
    });
    
    enemies.forEach((enemy, j) => {
        enemy.update();
        let distance = Math.hypot(player.x - enemy.x, player.y - enemy.y);
        // when enemy touch player
        if (distance - enemy.radius - player.radius < 1) {
            // console.log("End Game");
            cancelAnimationFrame(animId);
            endScore.innerHTML = score_val;
            board.style.display = 'flex';
        }
        projectiles.forEach((projectile, i) => {
            let distance = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);
            
            // when bullet touch enemy
            if (distance - enemy.radius - projectile.radius < 1) {
    
                // create new particles
                let power = Math.random() * 7;
                for (let id = 0; id < enemy.radius; id++) {
                    particles.push(new Projectile(
                        projectile.x,
                        projectile.y,
                        Math.random() * 2 + 0.1, 
                        enemy.color, 
                        {
                            x: (random() - 0.5) * power ,
                            y: (random() - 0.5) * power
                        }
                    ))
                }
                
                if (enemy.radius - 10  > 8) {
                    //increase score
                    score_val += 100;
                    score.innerHTML = score_val;
                    gsap.to(enemy, {
                        
                        radius: enemy.radius - 10
                    })
                    enemy.radius -= 10;
                    setTimeout(() => {
                        if (distance - enemy.radius - projectile.radius < 1) {
                            enemies.splice(j, 1);
                        }
                    }, 0);
                } else {
                    //increase score
                    score_val += 250;
                    score.innerHTML = score_val;
                    setTimeout(() => {
                        if (distance - enemy.radius - projectile.radius < 1) {
                            enemies.splice(j, 1);
                            projectiles.splice(i, 1);
                        }
                    }, 0);
                }
            }
        })
    });
    ///////////////////////////////////////////////////////
    // handle galaxies rotation
    c.save()
    c.fillStyle = `rgba(8, 8, 8, ${a})`
    c.translate( canvas.width / 2, canvas.height / 2)
    c.rotate(rotateRadians)
    planets.forEach((particle) => {
        particle.update();
    })
    c.restore()
    rotateRadians += 0.001;
}

// init();
start.addEventListener('click', () => {
    init();
    sendEnemy();
    initGalaxy();
    animate();
    board.style.display = 'none';
})

// End of the code
/////////////////////////////////////////////////
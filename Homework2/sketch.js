const Engine = Matter.Engine;
const Bodies = Matter.Bodies;
const Composite = Matter.Composite;
const Body = Matter.Body;

// 엔진 객체 생성
let engine;
let canvas;

//내 별들아 ~~
let star;
let galaxy = [];
let birth = 0;
let death = 0;

let Stardusts = [];
let blackholes = [];

let draggedPlanet = null;
let pressX = 0;
let pressY = 0;
let pressTime = 0;
let prevMouseX = 0;
let prevMouseY = 0;

let bigBangs = [];
let ash = [];

let flashStart = 0;


//class
class Star {
  constructor (x, y, r){
    this.x = x;
    this.y = y;
    this.r = r;
    this.displayR = r;
    this.c = color(random(200,255),random(240, 255),random(230,255));
    this.body = Bodies.circle(this.x, this.y, this.r, {
      restitution: 0.8,
      frictionAir: 0
    });
    this.bigBang = false;
    this.bigBangStart = 0;

    this.death = false;

    Composite.add(engine.world, this.body);
    Body.setVelocity(this.body, {
      x: random(-0.7, 0.7),
      y: random(-0.7, 0.7)
    });
  }
  isClicked(mx, my) {
      let pos = this.body.position;
      let d = dist(mx, my, pos.x, pos.y);
      return d < this.r;
    }

  display(){
  this.pos = this.body.position;

    drawingContext.shadowBlur = 50;
    drawingContext.shadowColor = this.c;

    let displayR = this.displayR;

  if (this.bigBang) {
  let t = constrain(
      (millis() - this.bigBangStart) / 2000,
      0,
      1
    );
  
  displayR = this.displayR * (1 + t);
  }

  noStroke ();
 drawingContext.save();

  drawingContext.shadowBlur = 20;
  drawingContext.shadowColor = this.c;

  fill(this.c);
  circle(
    this.pos.x,
    this.pos.y,
    displayR * 2
  );

  drawingContext.restore();
   // 2. 내부에 흐릿한 원
  drawingContext.save();

  drawingContext.filter = "blur(100px)";

  if (this.bigBang) {
    // 빅뱅일 때 내부만 빨강
    fill(180, 50, 80);
  } else {
    // 평소에는 행성 색보다 어둡게
    fill(red(this.c)-80, green(this.c)-40, blue(this.c)-40);
  }

  circle(
    this.pos.x,
    this.pos.y,
    displayR * 1.2
  );

  drawingContext.restore();


  }

  checkDeath(){
    if(this.pos.x < -this.r || 
      this.pos.x > innerWidth + this.r || 
      this.pos.y < -this.r
    ) {
      this.death = true;
      Composite.remove(engine.world, this.body);
    }
  }
}

class Stardust {
  constructor(x, y, c) {
    this.x = x;
    this.y = y;
    this.size = random(1, 5);
    this.c = c;
    this.angle = random(TWO_PI);
    this.rotationSpeed = random(-0.1, 0.1);

    this.vx = random(-3, 3);
    this.vy = random(-3, 3);

    this.life = 255;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    this.vx *= 0.98;
    this.vy *= 0.98;

    this.angle += this.rotationSpeed;

    this.life -= 5;
  }

  display() {
    push();

    translate(this.x, this.y);
    rotate(this.angle);

    noStroke();
    fill(red(this.c), green(this.c), blue(this.c), this.life);

    triangle(
      0, -this.size,
      -this.size, this.size,
      this.size, this.size
    );
  pop();
  }
}

class BlackHole {

  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.r = 30;
  }

attract(planet) {

  let pos = planet.body.position;

  let dx = this.x - pos.x;
  let dy = this.y - pos.y;

  let d = sqrt(dx * dx + dy * dy);

  let shrinkStart = 200;

  if (d < shrinkStart) {
    let amount = map(d, 0, shrinkStart, 0.1, 1);
    planet.displayR = planet.r * amount;
  }

  if (d < this.r + planet.r * 0.7) {
    Composite.remove(engine.world, planet.body);
    return true;
  }

  // 블랙홀 중력

  let gravity = 0.0008;

  let fx = dx / d * gravity;
  let fy = dy / d * gravity;

  let orbit = 0.0004;

  let tx = -dy / d;
  let ty = dx / d;

  fx += tx * orbit;
  fy += ty * orbit;

  Body.applyForce(planet.body, pos, {
    x: fx,
    y: fy
  });

  return false;
}

  display() {

    drawingContext.shadowBlur = 200;
    drawingContext.shadowColor = "gray";

    noStroke();
    fill(40);
    circle(this.x, this.y, this.r*4);

    drawingContext.shadowBlur = 0;
  }
}


//setup
function setup() {
  // put setup code here
  createCanvas (windowWidth, windowHeight);
  rectMode (CENTER);

  // Matter setting
  engine = Engine.create();
  engine.gravity.scale = 0;

  // Walls
  let margin = 20;
  // Composite.add(engine.world, [
  //   Bodies.rectangle(width/2, height-margin, width, margin, {isStatic:true}), //바닥
  //   Bodies.rectangle(width/2, margin, width, margin, {isStatic:true}), //천장
  //   Bodies.rectangle(margin, height/2, margin, height, {isStatic:true}), //왼쪽 벽
  //   Bodies.rectangle(width-margin, height/2, margin, height, {isStatic:true}), //오른쪽 벽
  // ]);
  star = new Star(0, 0, 0);
  blackholes.push(
    new BlackHole(width/2, height/2),
  );
 }


function createPlanet() {

  let px = random(0, width);
  let py = random(0, height);
  let pr = random(60, 200);


  for (let planet of galaxy) {

    let pd = dist(px, py, planet.body.position.x, planet.body.position.y);

    if (pd < pr + planet.r + 10) {
      return;
    }
  }

  galaxy.push(new Star(random(0, width), random(0, height), random(60,180)));
}


function mousePressed() {
  pressX = mouseX;
  pressY = mouseY;
  pressTime = millis();

  prevMouseX = mouseX;
  prevMouseY = mouseY;

  draggedPlanet = null;

  for (let i = galaxy.length - 1; i >= 0; i--) {
    let planet = galaxy[i];

    if (planet.isClicked(mouseX, mouseY)) {
      draggedPlanet = planet;
      break;
    }
  }
}

function mouseDragged() {
  if (!draggedPlanet) return;

  Body.setPosition(draggedPlanet.body, {
    x: mouseX,
    y: mouseY
  });

  Body.setVelocity(draggedPlanet.body, {
    x: mouseX - prevMouseX,
    y: mouseY - prevMouseY
  });

  prevMouseX = mouseX;
  prevMouseY = mouseY;

  checkBigBang();
}

function mouseReleased() {

  let moveDistance = dist(
    pressX,
    pressY,
    mouseX,
    mouseY
  );

  // 클릭
  if (moveDistance < 10) {

    for (let i = galaxy.length - 1; i >= 0; i--) {
      let planet = galaxy[i];

      if (planet.isClicked(mouseX, mouseY)) {

        let pos = planet.body.position;

        for (let j = 0; j < 40; j++) {
          Stardusts.push(
            new Stardust(pos.x, pos.y, planet.c)
          );
        }

        Composite.remove(engine.world, planet.body);
        galaxy.splice(i, 1);

        break;
      }
    }

  // 드래그
  } else if (draggedPlanet) {

    Body.setVelocity(draggedPlanet.body, {
      x: (mouseX - prevMouseX) * 0.5,
      y: (mouseY - prevMouseY) * 0.5
    });
  }

  draggedPlanet = null;
}

function checkBigBang() {

  for (let i = 0; i < galaxy.length; i++) {
    for (let j = i + 1; j < galaxy.length; j++) {

      let a = galaxy[i];
      let b = galaxy[j];

      if (a.bigBang || b.bigBang) continue;

      let posA = a.body.position;
      let posB = b.body.position;

      let d = dist(
        posA.x,
        posA.y,
        posB.x,
        posB.y
      );

      if (d < a.r + b.r) {

        let speedA = a.body.speed;
        let speedB = b.body.speed;

        if (speedA + speedB > 5) {

          let x = (posA.x + posB.x) / 2;
          let y = (posA.y + posB.y) / 2;

          Body.setVelocity(a.body, {
            x: 0,
            y: 0
          });

          Body.setVelocity(b.body, {
            x: 0,
            y: 0
          });

          Body.setAngularVelocity(a.body, 0);
          Body.setAngularVelocity(b.body, 0);

          a.bigBang = true;
          b.bigBang = true;

          a.bigBangStart = millis();
          b.bigBangStart = millis();

          for (let k = 0; k < 100; k++) {
            ash.push({
              x: x + random(-10, 10),
              y: y + random(-10, 10),
              size: random(1, 4),
              vx: random(-1, 1),
              vy: random(-1, 1)
            });
          }
        }
      }
    }
  }
}


//draw
 function draw() {
   // put drawing code here
    background(0);
    Engine.update(engine);
    checkBigBang();

    for (let i = galaxy.length - 1; i >= 0; i--) {
      let planet = galaxy[i];

    if (planet.bigBang) {
      let elapsed = millis() - planet.bigBangStart;

      if (elapsed >= 2000) {
      flashStart = millis();

      Composite.remove(
        engine.world,
        planet.body
      );

      galaxy.splice(i, 1);
    }
  }
}


// 재
noStroke();
fill(100);

for (let a of ash) {

  a.x += a.vx;
  a.y += a.vy;

  circle(
    a.x,
    a.y,
    a.size
  );
}


    star.display();
    for (let planet of galaxy){
      planet.display();
      planet.checkDeath();
    }
    for (let i=galaxy.length-1; i >=0 ; i--){
      if (galaxy[i].death == true){
        galaxy.splice(i,1);
      }
    }

    for (let i = Stardusts.length - 1; i >= 0; i--) {
      Stardusts[i].update();
      Stardusts[i].display();
      
      if (Stardusts[i].life <= 0) {
        Stardusts.splice(i, 1);
      }
    }

    if (millis() - birth > 2000) {
      createPlanet();
      birth = millis();
    }

    for (let bHole of blackholes) {

  bHole.display();

  for (let i = galaxy.length - 1; i >= 0; i--) {

    let planet = galaxy[i];

    if (bHole.attract(planet)) {
      galaxy.splice(i, 1);
    }
  }
}
    

if (
  flashStart > 0 &&
  millis() - flashStart < 250
) {
  background(255);
}


}

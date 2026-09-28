const Engine = Matter.Engine;
const Composite = Matter.Composite;
const Bodies = Matter.Bodies;
const Body = Matter.Body;

// 엔진 객체 생성
let engine;

let earth;
let earthX;
let earthY;

let angle1 = 0;
let angle2 = 0;
let angle3 = 0;


function setup() {
  createCanvas (windowWidth, windowHeight);
  engine = Engine.create();

  earthX = width/2;
  earthY = height/2;
  earth = Bodies.circle(earthX, earthY, 100, {isStatic:true});

  let margin = 20;

  Composite.add(engine.world, [
    Bodies.rectangle(width/2, height-margin, width, margin, {isStatic:true}), //바닥
    Bodies.rectangle(width/2, margin, width, margin, {isStatic:true}), //천장
    Bodies.rectangle(margin, height/2, margin, height, {isStatic:true}), //왼쪽 벽
    Bodies.rectangle(width-margin, height/2, margin, height, {isStatic:true}), //오른쪽 벽
    ]);
}

function draw() {
  background(10);

  //earth
  fill ("#aaffff");
  noStroke();
  circle (earth.position.x, earth.position.y, 100);

  let lineX = width/6
  let lineY = height/6

  //satellites
  

  
  stroke(255);

  //star 1
  push ();
  translate (300, 450);
  rotate (radians(angle1));
  angle1 = angle1+2;

  for (i=0; i<6; i++) {
    line(0, 0, 130, 130);
    rotate (PI/3);
  };

  pop ();

  // star 2
  push ();
  translate (1500, 750);
  rotate (radians(angle2));
  angle2 = angle2+2.5;

  for (i=0; i<6; i++) {
    line(0, 0, 170, 170);
    rotate (PI/3);
  };

  pop ();

  // star 3
  push ();
  translate (1100, 100);
  rotate (radians(angle3));
  angle3 = angle3+1.5;

  for (i=0; i<6; i++) {
    line(0, 0, 100, 100);
    rotate (PI/3);
  };

  pop ();
  

  Engine.update(engine);

}

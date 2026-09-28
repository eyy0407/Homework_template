const Engine = Matter.Engine;
const Composite = Matter.Composite;
const Bodies = Matter.Bodies;
const Body = Matter.Body;

// 엔진 객체 생성
let engine;

// 지구 만들기...
let earth;
let earthX;
let earthY;

let sa;

// 별 만들기...
let angle1 = 0;
let angle2 = 0;
let angle3 = 0;


function setup() {
  createCanvas (windowWidth, windowHeight);
  engine = Engine.create();

  earthX = width/2;
  earthY = height/2;
  earth = Bodies.circle(earthX, earthY, 100, {isStatic:true});

  sa = Bodies.circle(width/3, 100, 10);

  let margin = 20;

  Composite.add(engine.world, [
    Bodies.rectangle(width/2, height-margin, width, margin, {isStatic:true}), //바닥
    Bodies.rectangle(width/2, margin, width, margin, {isStatic:true}), //천장
    Bodies.rectangle(margin, height/2, margin, height, {isStatic:true}), //왼쪽 벽
    Bodies.rectangle(width-margin, height/2, margin, height, {isStatic:true}), //오른쪽 벽
    earth,
    sa
]);
}

function gravity(body) {
  let dx = earthX - body.position.x;
  let dy = earthY - body.position.y;

  Body.applyForce(body, body.position, {
    x: dx * 0.00005,
    y: dy * 0.00005
  });
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
  fill ("#ffaa88");
  circle (sa.position.x, sa.position.y, 10);

  
  stroke(255);

  //star 1
  push ();
  translate (width/6, (height*1)/2);
  rotate (radians(angle1));
  angle1 = angle1+2;

  for (i=0; i<6; i++) {
    line(0, 0, 130, 130);
    rotate (PI/3);
  };

  pop ();

  // star 2
  push ();
  translate ((width*5)/6, (height*4)/5);
  rotate (radians(angle2));
  angle2 = angle2+2.5;

  for (i=0; i<6; i++) {
    line(0, 0, 170, 170);
    rotate (PI/3);
  };

  pop ();

  // star 3
  push ();
  translate ((width*2)/3, (height*1)/7);
  rotate (radians(angle3));
  angle3 = angle3+1.5;

  for (i=0; i<6; i++) {
    line(0, 0, 100, 100);
    rotate (PI/3);
  };

  pop ();
  
  // satellites에 중력 적용
  gravity(sa);

  Engine.update(engine);

};


var orangutans = [];
var population = 50;
var females = [];
var bigmales = [];
var smallmales = [];
var weights = {};
var refresh = false;
var time = 0;
var sidebar;

function setup() {
  let canvas = createCanvas(1000, 500);
  canvas.parent("artwork");
  background(250);
  sidebar = select("#console");
  let start = select("#start-button");
  start.mousePressed(() => loop());
  let stop = select("#stop-button");
  stop.mousePressed(() => noLoop());
  let reset = select("#reset-button");
  reset.mousePressed(() => {
    refresh = true;
    time = 0;
    population = 50;
    orangutans = [];
    loop();
    create();
  });
  sliders("female", females, [1, 3, 3], select("#female-sliders"));
  sliders("bigmale", bigmales, [2, 1, 2], select("#bigmale-sliders"));
  sliders("smallmale", smallmales, [2, 1, 3], select("#smallmale-sliders"));
  create();
}

function sliders(type, apes, values, column) {
  createP(type + " weights:").parent(column);
  createP("seek").parent(column);
  weights[type] = {};
  weights[type].seek = createSlider(1, 3, values[0]);
  weights[type].seek.parent(column);
  weights[type].seek.input(() => {
    for (let i = 0; i < apes.length; i++) {
      apes[i].weights.seek = weights[type].seek.value();
    }
  });
  createP("flee").parent(column);
  weights[type].flee = createSlider(1, 3, values[1]);
  weights[type].flee.parent(column);
  weights[type].flee.input(() => {
    for (let i = 0; i < apes.length; i++) {
      apes[i].weights.flee = weights[type].flee.value();
    }
  });
  createP("maximum speed").parent(column);
  weights[type].speed = createSlider(1, 10, values[2]);
  weights[type].speed.parent(column);
  weights[type].speed.input(() => {
    for (let i = 0; i < apes.length; i++) {
      apes[i].maxspeed = weights[type].speed.value();
    }
  });
}

function create() {
  for (let i = 0; i < population; i++) {
    let age = abs(int(randomGaussian(20, 10)));
    let sex = random(10) < 5 ? "male" : "female";
    if (sex == "female")
      orangutans[i] = new Female(age, random(50, width-50), random(50, height-50));
    else {
      let type = random(10) < 5 ? "big" : "small";
      if (type == "big")
        orangutans[i] = new Bigmale(age, random(width-75), random(height-75));
      else
        orangutans[i] = new Smallmale(age, random(width-50), random(height-50));
    }
    orangutans[i].grow();
  }
}

function draw() {
  if (refresh) {
    background(255);
    refresh = false;
  }
  time++;
  for (let i = 0; i < orangutans.length; i++) {
    orangutans[i].search();
    orangutans[i].move();
    orangutans[i].display();
    if (time % 300 == 0) {
      orangutans[i].grow();
      if (orangutans[i].age > 60)
        orangutans[i].die(i);
    }
  }
}

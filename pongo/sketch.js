var orangutans = [];
var population = 50;
var females = [];
var bigmales = [];
var smallmales = [];
var time = 0;
var refresh = false;
var sidebar;

function setup() {
  let canvas = createCanvas($("#artwork").width(), $("#artwork").height());
  canvas.parent("artwork");
  background("#FFEFE2");
  $("#more").click(() => {
    $("#console").addClass("position-fixed");
    $("#about").removeClass("d-none");
    $("#about").animate({
      opacity: 1
    }, 500);
  });
  $("#back").click(() => {
    $("#console").removeClass("position-fixed");
    $("#about").animate({
      opacity: 0
    }, 300, () => $("#about").addClass("d-none"));
  });
  sidebar = select("#console");
  $(".controls").eq(0).click(() => loop());
  $(".controls").eq(1).click(() => noLoop());
  $(".controls").eq(2).click(() => {
    $("#console").html("");
    refresh = true;
    time = 0;
    population = 50;
    orangutans = [];
    loop();
    create();
  });
  create();
}

function create() {
  for (let i = 0; i < population; i++) {
    let age = abs(int(randomGaussian(20, 10)));
    let sex = random(10) < 5 ? "male" : "female";
    if (sex == "female")
      orangutans[i] = new Female(age, random(50, width - 50), random(50, height - 50));
    else {
      let type = random(10) < 5 ? "big" : "small";
      if (type == "big")
        orangutans[i] = new Bigmale(age, random(width - 75), random(height - 75));
      else
        orangutans[i] = new Smallmale(age, random(width - 50), random(height - 50));
    }
    orangutans[i].grow();
  }
}

function draw() {
  if (refresh) {
    background("#FFEFE2");
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
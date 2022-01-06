var gorillas = [];
var silverbacks = [];
var population = 50;
var time = 0;
var refresh = false;
var sidebar;

function setup() {
  let canvas = createCanvas($("#artwork").width(), $("#artwork").height());
  canvas.parent("artwork");
  background("#E3F9FF");
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
    gorillas = [];
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
      gorillas[i] = new Female(age, random(50, width - 50), random(50, height - 50));
    else {
      gorillas[i] = new Male(age, random(width - 75), random(height - 75));
      if (gorillas[i].adult)
        silverbacks.push(gorillas[i]);
    }
    gorillas[i].grow();
  }
  for (let i = 0; i < gorillas.length; i++) {
    if (gorillas[i].sex == "female" && gorillas[i].adult) {
      let nearest = Infinity;
      for (let j = 0; j < silverbacks.length; j++) {
        let distance = p5.Vector.dist(gorillas[i].position, silverbacks[j].position);
        if (distance < nearest && silverbacks[j].harem.length < 3) {
          nearest = distance;
          gorillas[i].alpha = silverbacks[j];
        }
      }
      if (nearest != Infinity)
        gorillas[i].alpha.harem.push(gorillas[i]);
    }
  }
}

function draw() {
  if (refresh) {
    background("#E3F9FF");
    refresh = false;
  }
  time++;
  for (let i = 0; i < gorillas.length; i++) {
    gorillas[i].search();
    gorillas[i].move();
    gorillas[i].display();
    if (time % 300 == 0) {
      gorillas[i].grow();
      if (gorillas[i].age > 60)
        gorillas[i].die(i);
    }
  }
}
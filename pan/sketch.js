var chimpanzees = [];
var hierarchy = [];
var fertile = [];
var population = 50;
var index = 0;
var time = 0;
var refresh = false;
var sidebar;

function setup() {
  let canvas = createCanvas($("#artwork").width(), $("#artwork").height());
  canvas.parent("artwork");
  background("#fcfcca");
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
    if (sex == "female") {
      chimpanzees[i] = new Female(age, random(50, width - 50), random(50, height - 50));
      if (chimpanzees[i].adult)
        fertile.push(chimpanzees[i]);
    } else {
      index++;
      chimpanzees[i] = new Male(age, random(width - 75), random(height - 75));
      if (chimpanzees[i].adult)
        hierarchy.push(chimpanzees[i]);
    }
    chimpanzees[i].grow();
  }
  hierarchy.sort(function(a, b) {
    let diff1 = abs(a.age - 40);
    let diff2 = abs(b.age - 40);
    return diff1 - diff2;
  });
  for (let i = 0; i < hierarchy.length; i++) {
    hierarchy[i].rank = i + 1;
  }
}

function draw() {
  if (refresh) {
    background("#FDFFCA");
    refresh = false;
  }
  time++;
  for (let i = 0; i < chimpanzees.length; i++) {
    chimpanzees[i].search();
    chimpanzees[i].move();
    chimpanzees[i].display();
    if (time % 300 == 0) {
      chimpanzees[i].grow();
      if (chimpanzees[i].age > 60)
        chimpanzees[i].die(i);
    }
  }
}
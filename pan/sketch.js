var chimpanzees = [];
var hierarchy = [];
var fertile = [];
var population = 50;
var index = 0;
var time = 0;

function setup() {
  createCanvas(1200, 600);
  for (let i = 0; i < population; i++) {
    let age = abs(int(randomGaussian(20, 10)));
    let sex = random(10) < 5 ? "male" : "female";
    if (sex == "female") {
      chimpanzees[i] = new Female(age, random(50, width-50), random(50, height-50));
      if (chimpanzees[i].adult)
        fertile.push(chimpanzees[i]);
    }
    else {
      index++;
      chimpanzees[i] = new Male(age, random(width-75), random(height-75));
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

class Ape {
  constructor(age, pos1, pos2) {
    this.age = age;
    this.position = createVector(pos1, pos2);
    this.velocity = createVector(0, 0);
    this.acceleration = createVector(0, 0);
    this.perlin = [int(random(100)), int(random(100))];
    this.sight = 150;
    this.periphery = PI/4;
    this.maxforce = 0.1;
  }

  separate() {
    let average = createVector(0, 0);
    let count = 0;
    for (let i = 0; i < orangutans.length; i++) {
      if (this.mother == orangutans[i])
        continue;
      let distance = p5.Vector.dist(this.position, orangutans[i].position);
      let radii = this.size/2 + orangutans[i].size/2;
      if (distance < radii && distance > 0) {
        let difference = p5.Vector.sub(this.position, orangutans[i].position);
        difference.normalize();
        difference.div(distance);
        average.add(difference);
        count++;
      }
    }
    if (count > 0) {
      average.div(count);
      average.normalize();
      average.mult(this.maxspeed);
      average.sub(this.velocity);
      average.limit(this.maxforce);
      average.mult(this.weights.separate);
    }
    this.acceleration.add(average);
  }

  wander() {
    let steer;
    if (this.mother)
      steer = this.follow();
    else {
      this.perlin[0] += 0.001;
      this.perlin[1] += 0.001;
      let desired = createVector(noise(this.perlin[0]) - 0.5, noise(this.perlin[1]) - 0.5);
      desired.normalize();
      desired.mult(this.maxspeed);
      steer = p5.Vector.sub(desired, this.velocity);
      steer.limit(this.maxforce);
    }
    return steer;
  }

  follow() {
    let desired = p5.Vector.sub(this.mother.position, this.position);
    let distance = desired.mag();
    let speed = map(distance, 0, 5, 0.01, this.maxspeed);
    desired.normalize();
    desired.mult(speed);
    let steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxforce);
    return steer;
  }

  seek(target) {
    let velocity = target.velocity.copy();
    velocity.mult(30);
    this.prediction = p5.Vector.add(target.position, velocity);
    let desired = p5.Vector.sub(this.prediction, this.position);
    let distance = p5.Vector.sub(target.position, this.position).mag();
    let speed = map(distance, 0, 5, 0.01, this.maxspeed);
    desired.normalize();
    desired.mult(speed);
    let steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxforce);
    if (distance < 5) {
      if (this.sex == "female") {
        this.color[1] += 60;
        this.color[1] = constrain(this.color[1], 0, 255);
        createP("consensual").parent(sidebar);
        this.reproduce("big");
      }
      else {
        target.color[1] -= 60;
        target.color[1] = constrain(target.color[1], 0, 255);
        createP("non-consensual").parent(sidebar);
        target.reproduce("small");
      }
    }
    return steer;
  }

  flee(target) {
    let desired = p5.Vector.sub(target.position, this.position);
    desired.normalize();
    desired.mult(-this.maxspeed);
    let steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxforce);
    return steer;
  }

  reproduce(gene) {
    this.estrus = false;
    let child;
    let sex = random(10) < 5 ? "male" : "female";
    if (sex == "female")
      child = new Female(0, this.position.x + this.size/2, this.position.y);
    else {
      if (gene == "big")
        child = new Bigmale(0, this.position.x + this.size/2, this.position.y);
      else
        child = new Smallmale(0, this.position.x + this.size/2, this.position.y);
    }
    child.mother = this;
    this.child = child;
    orangutans.push(child);
    population++;
    child.grow();
  }

  move() {
    let desired;
    if (this.position.x < this.size/2)
      desired = createVector(this.maxspeed, this.velocity.y);
    else if (this.position.x > width - this.size/2)
      desired = createVector(-this.maxspeed, this.velocity.y);
    if (this.position.y < this.size/2)
      desired = createVector(this.velocity.x, this.maxspeed);
    else if (this.position.y > height - this.size/2)
      desired = createVector(this.velocity.x, -this.maxspeed);
    if (desired) {
      desired.normalize();
      desired.mult(this.maxspeed);
      let steer = p5.Vector.sub(desired, this.velocity);
      steer.limit(this.maxforce);
      this.acceleration.add(steer);
      this.perlin[0]++;
      this.perlin[1]++;
    }
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxspeed);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
  }

  die(index) {
    if (this.child)
      delete this.child.mother;
    orangutans.splice(index, 1);
    population--;
    if (this.sex == "female") {
      for (let i = 0; i < females.length; i++) {
        if (this === females[i])
          females.splice(i, 1);
      }
    }
    else if (this.type == "big") {
      for (let i = 0; i < bigmales.length; i++) {
        if (this === bigmales[i])
          bigmales.splice(i, 1);
      }
    }
    else {
      for (let i = 0; i < smallmales.length; i++) {
        if (this === smallmales[i])
          smallmales.splice(i, 1);
      }
    }
  }

  display() {
    let heading = this.velocity.heading();
    push();
    translate(this.position.x, this.position.y);
    rotate(heading - PI/2);
    stroke(this.color[0], this.color[1], this.color[2], 70);
    line(0, -this.size/2, 0, this.size/2);
    pop();
  }
}

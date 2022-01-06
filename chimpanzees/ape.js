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

  wander() {
    let steer;
    if (this.mother)
      steer = this.follow(this.mother);
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

  follow(target) {
    let desired = p5.Vector.sub(target.position, this.position);
    let distance = desired.mag();
    let speed = map(distance, this.size/2 + target.size/2, this.size/2 + target.size/2 + 5, 0.01, this.maxspeed);
    desired.normalize();
    desired.mult(speed);
    let steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxforce);
    return steer;
  }

  seek(target) {
    let desired = p5.Vector.sub(target.position, this.position);
    let distance = desired.mag();
    desired.normalize();
    let speed = map(distance, 0, 5, 0.01, this.maxspeed);
    desired.mult(speed);
    let steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxforce);
    if (distance < 5) {
      if (this.sex == "female") {
        target.color[2] += 60;
        target.color[2] = constrain(target.color[2], 0, 255);
        console.log("consensual");
        this.reproduce();
      }
      else {
        target.color[2] -= 60;
        target.color[2] = constrain(target.color[2], 0, 255);
        console.log("non-consensual");
        target.reproduce();
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

  reproduce() {
    this.estrus = false;
    for (let i = 0; i < fertile.length; i++) {
      if (this === fertile[i])
        fertile.splice(i, 1);
    }
    let child;
    let sex = random(10) < 5 ? "male" : "female";
    if (sex == "female")
      child = new Female(0, this.position.x + this.size/2, this.position.y);
    else
      child = new Male(0, this.position.x + this.size/2, this.position.y);
    child.mother = this;
    this.child = child;
    chimpanzees.push(child);
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
    if (this.sex === "male") {
      for (let i = 0; i < hierarchy.length; i++) {
        if (hierarchy[i] === this)
          hierarchy.splice(i, 1);
      }
    }
    if (this.sex === "female") {
      if (this.estrus) {
        for (let i = 0; i < fertile.length; i++) {
          if (fertile[i] === this)
            fertile.splice(i, 1);
        }
      }
      if (this.child)
        delete this.child.mother;
    }
    chimpanzees.splice(index, 1);
    population--;
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

class Ape {
  constructor(age, pos1, pos2) {
    this.age = age;
    this.position = createVector(pos1, pos2);
    this.velocity = createVector(0, 0);
    this.acceleration = createVector(0, 0);
    this.perlin = [int(random(100)), int(random(100))];
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
    let speed = map(distance, 0, 5, 0.01, this.maxspeed);
    desired.normalize();
    desired.mult(speed);
    let steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxforce);
    if (distance < 5) {
      if (this.sex == "female")
        this.reproduce();
      else {
        target.alpha = this;
        this.harem.push(target);
      }
    }
    return steer;
  }

  kill(target) {
    for (let i = 0; i < gorillas.length; i++) {
      if (gorillas[i] === target)
        gorillas.splice(i, 1);
    }
    population--;
    let mother = target.mother;
    delete mother.child;
    mother.color[1] -= 60;
    mother.color[1] = constrain(mother.color[1], 0, 255);
    let harem = mother.alpha.harem;
    for (let i = 0; i < harem.length; i++) {
      if (mother === harem[i])
        harem.splice(i, 1);
    }
    mother.estrus = true;
    mother.alpha = this;
    this.harem.push(mother);
    let steer = this.flee(mother.alpha);
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
    let child;
    let sex = random(10) < 5 ? "male" : "female";
    if (sex == "female")
      child = new Female(0, this.position.x + this.size, this.position.y);
    else
      child = new Male(0, this.position.x + this.size, this.position.y);
    child.grow();
    child.mother = this;
    this.child = child;
    gorillas.push(child);
    population++;
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
    if (this.harem) {
      for (let i = 0; i < this.harem.length; i++) {
        delete this.harem[i].alpha;
      }
    }
    gorillas.splice(index, 1);
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

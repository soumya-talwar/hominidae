class Female extends Ape {
  constructor(age, pos1, pos2) {
    super(age, pos1, pos2);
    this.sex = "female";
    this.color = [80, 220, 255];
    this.maxspeed = 3;
    if (this.age >= 20) {
      this.adult = true;
      this.estrus = true;
      this.size = 100;
    }
  }

  grow() {
    this.age++;
    if (!this.adult) {
      this.size = map(this.age, 1, 20, 50, 100);
      if (this.age == 20) {
        this.adult = true;
        if (this.mother) {
          delete this.mother.child;
          this.mother.estrus = true;
          delete this.mother;
        }
        this.estrus = true;
        let nearest = Infinity;
        for (let i = 0; i < silverbacks.length; i++) {
          let distance = p5.Vector.dist(this.position, silverbacks[i].position);
          if (distance < nearest && silverbacks[i].harem.length < 4) {
            nearest = distance;
            this.alpha = silverbacks[i];
          }
        }
        if (nearest != Infinity)
          this.alpha.harem.push(this);
      }
    }
  }

  search() {
    let steer = super.wander();
    if (this.alpha && this.estrus)
      steer = super.seek(this.alpha);
    else if (this.alpha) {
      steer = super.follow(this.alpha);
      this.separate();
    }
    this.acceleration.add(steer);
  }

  separate() {
    let harem = this.alpha.harem;
    let average = createVector(0, 0);
    let count = 0;
    for (let i = 0; i < harem.length; i++) {
      let distance = p5.Vector.dist(this.position, harem[i].position);
      let radii = this.size/2 + harem[i].size/2;
      if (distance < radii && distance > 0) {
        let difference = p5.Vector.sub(this.position, harem[i].position);
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
      this.acceleration.add(average);
    }
  }
}

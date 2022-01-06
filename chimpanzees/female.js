class Female extends Ape {
  constructor(age, pos1, pos2) {
    super(age, pos1, pos2);
    this.sex = "female";
    this.submission = {};
    this.color = [200, 255, 200];
    this.maxspeed = 3;
    this.weights = {
      "seek": 1,
      "flee": 2
    };
    if (this.age >= 20) {
      this.adult = true;
      this.size = 100;
      this.estrus = true;
    }
  }

  grow() {
    this.age++;
    if (!this.adult) {
      this.size = map(this.age, 1, 20, 50, 100);
      if (this.age == 20) {
        this.adult = true;
        this.estrus = true;
        fertile.push(this);
        if (this.mother) {
          this.mother.estrus = true;
          fertile.push(this.mother);
          delete this.mother.child;
          delete this.mother;
        }
      }
    }
  }

  search() {
    let steer = super.wander();
    if (this.estrus) {
      steer = super.seek(hierarchy[0]);
      steer.mult(this.weights.seek);
      for (let i = 1; i < hierarchy.length; i++) {
        let distance = p5.Vector.dist(this.position, hierarchy[i].position);
        let comparision = p5.Vector.sub(hierarchy[i].position, this.position);
        let angle = comparision.angleBetween(hierarchy[i].velocity);
        if (distance < this.sight && distance > 0 && angle < this.periphery) {
          if (this.submission[hierarchy[i].id] < 500)
            steer.add(super.flee(hierarchy[i]).mult(this.weights.flee));
        }
      }
    }
    this.acceleration.add(steer);
  }
}

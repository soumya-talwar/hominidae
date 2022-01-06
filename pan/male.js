class Male extends Ape {
  constructor(age, pos1, pos2) {
    super(age, pos1, pos2);
    this.sex = "male";
    this.color = [180, 180, 180];
    this.id = "male" + index;
    this.maxspeed = 2;
    this.weights = {
      "seek": 2,
      "flee": 1
    };
    if (this.age >= 20) {
      this.adult = true;
      this.size = 150;
    }
  }

  grow() {
    this.age++;
    if (!this.adult) {
      this.size = map(this.age, 1, 20, 80, 150);
      if (this.age == 20) {
        this.adult = true;
        hierarchy.push(this);
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
    if (this.adult) {
      if (fertile.length > 0) {
        let nearest = Infinity;
        let female;
        for (let i = 0; i < fertile.length; i++) {
          let distance = p5.Vector.dist(this.position, fertile[i].position);
          if (distance < nearest) {
            nearest = distance;
            female = fertile[i];
          }
        }
        steer = super.seek(female);
        steer.mult(this.weights.seek);
        for (let i = 0; i < hierarchy.length; i++) {
          let distance = p5.Vector.dist(this.position, hierarchy[i].position);
          let comparision = p5.Vector.sub(hierarchy[i].position, this.position);
          let angle = comparision.angleBetween(hierarchy[i].velocity);
          if (this.rank > hierarchy[i].rank) {
            steer = super.flee(hierarchy[i]);
            steer.mult(this.weights.flee);
          } else if (this.rank < hierarchy[i].rank)
            hierarchy[i].acceleration.add(hierarchy[i].flee(this).mult(hierarchy[i].weights.flee));
        }
      } else {
        for (let i = 0; i < chimpanzees.length; i++) {
          let distance = p5.Vector.dist(this.position, chimpanzees[i].position);
          let radii = this.size / 2 + chimpanzees[i].size / 2;
          if (distance < radii && distance > 0) {
            if (chimpanzees[i].sex == "female")
              this.dominate(chimpanzees[i]);
            else if (chimpanzees[i].sex == "male" && chimpanzees[i].adult) {
              if (this.rank - chimpanzees[i].rank == 1)
                this.dominate(chimpanzees[i]);
            }
          }
        }
      }
    }
    this.acceleration.add(steer);
  }

  dominate(target) {
    if (target.sex == "female") {
      if (!target.submission[this.id])
        target.submission[this.id] = 1;
      else if (target.submission[this.id] < 500)
        target.submission[this.id]++;
      target.acceleration.add(target.flee(this).mult(target.weights.flee));
      if (time % 60 == 0)
        createP(`assaulted, ${floor(time/60)}s`).parent(sidebar);
      target.color[0] -= 5;
      target.color[0] = constrain(target.color[0], 0, 255);
    } else {
      let diff1 = 40 - this.age;
      let diff2 = 40 - target.age;
      let sum = diff1 + diff2;
      let winner = random(sum) > diff1 ? this : target;
      if (this === winner) {
        hierarchy[target.rank - 1] = this;
        hierarchy[this.rank - 1] = target;
        let temp = this.rank;
        this.rank = target.rank;
        target.rank = temp;
        target.acceleration.add(target.flee(this).mult(target.weights.flee));
      } else {
        let steer = super.flee(target);
        steer.mult(this.weights.flee);
        this.acceleration.add(steer);
      }
    }
  }
}
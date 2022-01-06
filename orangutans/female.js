class Female extends Ape {
  constructor(age, pos1, pos2) {
    super(age, pos1, pos2);
    this.sex = "female";
    this.color = [255, 128, 80];
    this.maxspeed = 3;
    this.weights = {
      "seek": 1,
      "flee": 3,
      "separate": 1
    };
    if (this.age >= 20) {
      this.adult = true;
      this.size = 100;
      this.estrus = true;
    }
    females.push(this);
  }

  grow() {
    this.age++;
    if (!this.adult) {
      this.size = map(this.age, 1, 20, 50, 100);
      if (this.age == 20) {
        this.adult = true;
        this.estrus = true;
        if (this.mother) {
          this.mother.estrus = true;
          delete this.mother.child;
          delete this.mother;
        }
      }
    }
  }

  search() {
    super.separate();
    let steer = super.wander();
    if (this.estrus) {
      for (let i = 0; i < orangutans.length; i++) {
        let distance = p5.Vector.dist(this.position, orangutans[i].position);
        let comparision = p5.Vector.sub(orangutans[i].position, this.position);
        let angle = comparision.angleBetween(orangutans[i].velocity);
        if (distance < this.sight && distance > 0 && angle < this.periphery) {
          if (orangutans[i].sex == "male" && orangutans[i].adult && orangutans[i].type == "big") {
            steer = super.seek(orangutans[i]);
            steer.mult(this.weights.seek);
          } else if (orangutans[i].sex == "male" && orangutans[i].adult && orangutans[i].type == "small") {
            steer = super.flee(orangutans[i]);
            steer.mult(this.weights.flee);
          }
        }
      }
    }
    this.acceleration.add(steer);
  }
}
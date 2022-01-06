class Smallmale extends Ape {
  constructor(age, pos1, pos2) {
    super(age, pos1, pos2);
    this.sex = "male";
    this.type = "small";
    this.color = [180, 180, 180];
    this.maxspeed = 3;
    this.weights = {
      "seek": 2,
      "flee": 0,
      "separate": 1
    };
    if (this.age >= 20) {
      this.adult = true;
      this.size = 100;
    }
    smallmales.push(this);
  }

  grow() {
    this.age++;
    if (!this.adult) {
      this.size = map(this.age, 1, 20, 50, 100);
      if (this.age == 20) {
        this.adult = true;
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
    if (this.adult) {
      for (let i = 0; i < orangutans.length; i++) {
        let distance = p5.Vector.dist(this.position, orangutans[i].position);
        let comparision = p5.Vector.sub(orangutans[i].position, this.position);
        let angle = comparision.angleBetween(orangutans[i].velocity);
        if (distance < this.sight && distance > 0 && angle < this.periphery) {
          if (orangutans[i].sex == "female" && orangutans[i].estrus) {
            steer = super.seek(orangutans[i])
            steer.mult(this.weights.seek);
          }
        }
      }
    }
    this.acceleration.add(steer);
  }
}
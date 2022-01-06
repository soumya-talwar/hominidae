class Male extends Ape {
  constructor(age, pos1, pos2) {
    super(age, pos1, pos2);
    this.sex = "male";
    this.harem = [];
    this.color = [200, 200, 200];
    this.maxspeed = 2;
    this.sight = 150;
    this.periphery = PI/4;
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
        silverbacks.push(this);
        if (this.mother) {
          delete this.mother.child;
          this.mother.estrus = true;
          delete this.mother;
        }
      }
    }
  }

  search() {
    let steer = super.wander();
    if (this.adult) {
      for (let i = 0; i < gorillas.length; i++) {
        let distance = p5.Vector.dist(this.position, gorillas[i].position);
        let comparision = p5.Vector.sub(gorillas[i].position, this.position);
        let angle = comparision.angleBetween(gorillas[i].velocity);
        if (distance < this.sight && distance > 0 && angle < this.periphery) {
          if (this.harem.length > 0) {
            if (gorillas[i].sex == "male" && gorillas[i].adult)
              gorillas[i].acceleration.add(gorillas[i].flee(this));
          }
          if (this.harem.length < 3) {
            if (!gorillas[i].adult && gorillas[i].mother)
              steer = super.kill(gorillas[i]);
            else if (gorillas[i].sex == "female" && !gorillas[i].alpha)
              steer = super.seek(gorillas[i]);
          }
        }
      }
    }
    this.acceleration.add(steer);
  }
}

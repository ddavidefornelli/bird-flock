import './birdflock.css';
import {
  defaultConfig,
  createFlock,
  updateFlock,
} from '../services/birdFlockAlgo';

export default class BirdFlock extends HTMLElement {
  private elements: HTMLDivElement[] = [];

  constructor() {
    super();
  }

  connectedCallback() {
    const NUMBER_OF_BOIDS = 300;
    const HEIGHT = 500;
    const WIDTH = 1000;

    const flock = createFlock(NUMBER_OF_BOIDS, WIDTH, HEIGHT);

    for (let boid of flock) {
      const boidE = document.createElement('div');
      boidE.className = `boid ${boid.x} - ${boid.y}`;
      boidE.style.transform = `translate(${boid.x}px, ${boid.y}px)`;
      this.elements.push(boidE);
      this.appendChild(boidE);
    }

    const id = () => setInterval(() => {
      updateFlock(flock, defaultConfig);
      for (let i = 0; i < this.elements.length; ++i) {
        this.elements[i].style.transform =
          `translate(${flock[i].x}px, ${flock[i].y}px)`;
      }
    }, 10);
    id();
  }
}

customElements.define('bird-flock', BirdFlock);

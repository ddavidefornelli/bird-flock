import './birdflock.css';
import './flockControls';
import FlockControls from './flockControls';
import {
  defaultConfig,
  createFlock,
  updateFlock,
} from '../services/birdFlockAlgo';
import type { FlockConfig } from '../services/birdFlockAlgo';

export default class BirdFlock extends HTMLElement {
  private elements: HTMLDivElement[] = [];
  private flock: ReturnType<typeof createFlock> = [];
  private config: FlockConfig = { ...defaultConfig };

  connectedCallback() {
    const controls = document.createElement('flock-controls') as FlockControls;
    const button = document.createElement('button');
    button.textContent = 'Start Simulazione';

    const panel = document.createElement('div');
    panel.className = 'setup-panel';
    panel.appendChild(controls);
    panel.appendChild(button);
    this.before(panel);

    controls.addEventListener('settings-change', ((e: CustomEvent) => {
      const s = e.detail;
      this.config.visualRange = s.visualRange;
      this.config.maxSpeed = s.maxSpeed;
      this.config.protectedRange = s.separation;
    }) as EventListener);

    button.addEventListener('click', () => {
      const s = controls.getSettings();
      this.config.visualRange = s.visualRange;
      this.config.maxSpeed = s.maxSpeed;
      this.config.protectedRange = s.separation;

      this.flock = createFlock(s.numBoids, this.config.width, this.config.height);
      this.renderFlock();
      this.startSimulation();
      panel.hidden = true;
    }, { once: true });
  }

  private renderFlock() {
    for (const boid of this.flock) {
      const el = document.createElement('div');
      el.className = 'boid';
      el.style.transform = `translate(${boid.x}px, ${boid.y}px)`;
      this.elements.push(el);
      this.appendChild(el);
    }
  }

  private startSimulation() {
    setInterval(() => {
      updateFlock(this.flock, this.config);
      for (let i = 0; i < this.elements.length; ++i) {
        this.elements[i].style.transform =
          `translate(${this.flock[i].x}px, ${this.flock[i].y}px)`;
      }
    }, 10);
  }
}

customElements.define('bird-flock', BirdFlock);

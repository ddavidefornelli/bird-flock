import './flockControls.css';

export interface FlockSettings {
  numBoids: number;
  visualRange: number;
  maxSpeed: number;
  separation: number;
}

export default class FlockControls extends HTMLElement {
  private settings: FlockSettings = {
    numBoids: 300,
    visualRange: 40,
    maxSpeed: 6,
    separation: 8,
  };

  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
      <h3>Configurazione</h3>

      <div class="control-group">
        <label for="numBoids">Numero Boids: <span id="numBoidsValue">${this.settings.numBoids}</span></label>
        <input type="range" id="numBoids" min="10" max="500" value="${this.settings.numBoids}">
      </div>

      <div class="control-group">
        <label for="visualRange">Visual Range: <span id="visualRangeValue">${this.settings.visualRange}</span></label>
        <input type="range" id="visualRange" min="10" max="150" value="${this.settings.visualRange}">
      </div>

      <div class="control-group">
        <label for="maxSpeed">Velocità: <span id="maxSpeedValue">${this.settings.maxSpeed}</span></label>
        <input type="range" id="maxSpeed" min="1" max="15" value="${this.settings.maxSpeed}">
      </div>

      <div class="control-group">
        <label for="separation">Separazione: <span id="separationValue">${this.settings.separation}</span></label>
        <input type="range" id="separation" min="2" max="30" value="${this.settings.separation}">
      </div>
    `;

    this.setupListeners();
  }

  private setupListeners() {
    const inputs = [
      'numBoids',
      'visualRange',
      'maxSpeed',
      'separation',
    ] as const;

    for (const id of inputs) {
      const input = this.querySelector<HTMLInputElement>(`#${id}`);
      const valueSpan = this.querySelector<HTMLSpanElement>(`#${id}Value`);

      if (input && valueSpan) {
        input.addEventListener('input', () => {
          const value = parseInt(input.value, 10);
          valueSpan.textContent = String(value);
          this.settings[id] = value;

          this.dispatchEvent(
            new CustomEvent('settings-change', {
              detail: { ...this.settings },
              bubbles: true,
            }),
          );
        });
      }
    }
  }

  getSettings(): FlockSettings {
    return { ...this.settings };
  }
}

customElements.define('flock-controls', FlockControls);

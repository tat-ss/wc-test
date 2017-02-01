const createAction = name => new CustomEvent('action', {
  bubbles: true,
  composed: true,
  detail: { name },
});

class App extends HTMLElement {
  constructor() {
    super();
    this.locals = {};
    this.locals.shadowRoot = this.attachShadow({mode: 'closed'});
  }

  render() {
    const { shadowRoot } = this.locals;
    const position = this.getAttribute('position');
    shadowRoot.innerHTML = `
      <x-screen position="${position}"></x-screen>
      <x-joy-stick></x-joy-stick>
    `;
  }

  static get observedAttributes() { return ['position']; }

  attributeChangedCallback(name, oldValue, newValue, namespaceURI) {
    if (name === 'position') {
      this.render();
    }
  }
}

class Screen extends HTMLElement {
  constructor() {
    super();
    this.locals = {};
    this.locals.shadowRoot = this.attachShadow({mode: 'closed'});
  }

  static get observedAttributes() { return ['position']; }

  attributeChangedCallback(name, oldValue, newValue, namespaceURI) {
    if (name === 'position') {
      this.render();
    }
  }

  render() {
    const { shadowRoot } = this.locals;
    const position = this.getAttribute('position');
    shadowRoot.innerHTML = `
      <style>
         .screen-parent {
           background-color: lime;
         }
         .screen-child {
           background-color: red;
           border-radius: 20px;
           width: 40px;
           height: 40px;
           margin-left: ${position}px;
         }
      </style>
      <div class="screen-parent">
        <div class="screen-child" />
      </div>
    `;
  }
}

class JoyStick extends HTMLElement {
  constructor() {
    super();
    this.locals = {};
    const shadowRoot = this.attachShadow({mode: 'closed'});
    shadowRoot.innerHTML = `
      <button class="jc-left">Left</button>
      <button class="jc-right">Right</button>
    `;
    shadowRoot.querySelector('.jc-left').addEventListener('click', event => {
      this.dispatchEvent(createAction('left'));
    });
    shadowRoot.querySelector('.jc-right').addEventListener('click', event => {
      this.dispatchEvent(createAction('right'));
    });
  }
}

customElements.define('x-app', App);
customElements.define('x-screen', Screen);
customElements.define('x-joy-stick', JoyStick);

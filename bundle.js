(() => {
  const { elementOpen, elementClose, elementVoid, text, patch } = IncrementalDOM;

  const createAction = name => new CustomEvent('action', {
    bubbles: true,
    composed: true,
    detail: { name },
  });

  class App extends HTMLElement {
    constructor() {
      super();
      this.locals = {
        shadowRoot: this.attachShadow({ mode: 'closed' }),
        connected: false,
      };
    }

    connectedCallback() {
      this.connected = true;
      this.render();
    }

    disconnectedCallback() {
      this.connected = false;
    }

    render() {
      if (!this.connected) return;

      const { shadowRoot } = this.locals;
      const position = this.getAttribute('position');
      patch(shadowRoot, () => {
        elementOpen('x-screen', null, null, 'position', position);
        elementClose('x-screen');
        elementOpen('x-joy-stick');
        elementClose('x-joy-stick');
      });
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
      this.locals = {
        shadowRoot: this.attachShadow({ mode: 'closed' }),
        connected: false,
      };
    }

    connectedCallback() {
      this.connected = true;
      this.render();
    }

    disconnectedCallback() {
      this.connected = false;
    }

    static get observedAttributes() { return ['position']; }

    attributeChangedCallback(name, oldValue, newValue, namespaceURI) {
      if (name === 'position') {
        this.render();
      }
    }

    render() {
      if (!this.connected) return;

      const { shadowRoot } = this.locals;
      const position = this.getAttribute('position');
      patch(shadowRoot, () => {
        elementOpen('style');
        text(`
        .screen-parent {
          background-color: lime;
        }
        .screen-child {
          background-color: red;
          border-radius: 20px;
          width: 40px;
          height: 40px;
        }
      `)
        elementClose('style');
        elementOpen('div', null, ['class', 'screen-parent']);
        elementVoid('div', null, ['class', 'screen-child'], 'style', `margin-left:${position}px;`);
        elementClose('div');
      });
    }
  }

  class JoyStick extends HTMLElement {
    connectedCallback() {
      const shadowRoot = this.attachShadow({ mode: 'closed' });
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
})();

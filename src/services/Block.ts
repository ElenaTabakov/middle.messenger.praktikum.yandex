import { v4 as UUID } from "uuid";
import EventBus from "./EventBus";
import Handlebars from "handlebars";

export type Children = {
  [key: string]: Block;
};

export type Props = {
  [key: string]: any;
  events?: {
    [key: string]: EventListener;
  };
};

export interface PropsAndChildren {
  children?: Children;
  props?: Props;
}

class Block {
  static EVENTS = {
    INIT: "init",
    FLOW_CDM: "flow:component-did-mount",
    FLOW_CDU: "flow:component-did-update",
    FLOW_RENDER: "flow:render",
  };

  private _element: HTMLElement | null = null;
  private _meta: { tagName: string; props: Props; tagId: string } | null = null;
  private _id: string | null = null;
  private props: Props | null = null;
  private _children: Children | null = null;
  private eventBus: () => EventBus;

  /** JSDoc
   * @param {string} tagName
   * @param {Object} props
   *
   * @returns {void}
   */

  constructor(
    tagName: string = "div",
    tagId:string,
    propsAndChildren: PropsAndChildren = {}
  ) {
    const eventBus = new EventBus();
    const { children, props } = this._getChildren(propsAndChildren);

    this._meta = {
      tagName,
      props,
      tagId
    };

    this._id = UUID();

    this.props = this._makePropsProxy({ ...props, __id: this._id });
    this._children = this._makePropsProxy(children);
    this.eventBus = () => eventBus;

    this._registerEvents(eventBus);

    eventBus.emit(Block.EVENTS.INIT);
  }

  _getChildren(propsAndChildren: PropsAndChildren) {
    const children: Children = {};
    const props: Props = {};

    Object.entries(propsAndChildren).forEach(([key, value]) => {
      if (value instanceof Block) {
        children[key] = value;
      } else {
        props[key] = value;
      }
    });

    return { children, props };
  }

  compile(template: string, props: Props) {
    const propsAndStubs = { ...props };

    Object.entries(this._children as Children).forEach(([key, child]) => {
      propsAndStubs[key] = `<div data-id="${child._id}"></div>`;
    });

    const fragment = this._createDocumentElement(
      "template"
    ) as HTMLTemplateElement;

    fragment.innerHTML = Handlebars.compile(template)(propsAndStubs);

    Object.values(this._children as Children).forEach((child) => {
      const stub = fragment.content.querySelector<HTMLElement>(
        `[data-id="${child._id}"]`
      );
      const content = child.getContent();
      if (stub !== null && content !== null) {
        stub.replaceWith(content);
      }
    });

    return fragment.content;
  }

  private _registerEvents(eventBus: EventBus) {
    eventBus.on(Block.EVENTS.INIT, this.init.bind(this));
    eventBus.on(Block.EVENTS.FLOW_CDM, this._componentDidMount.bind(this));
    eventBus.on(Block.EVENTS.FLOW_CDU, this._componentDidUpdate.bind(this));
    eventBus.on(Block.EVENTS.FLOW_RENDER, this._render.bind(this));
  }

  private _addEvents() {
    if (this.props?.events) {
      const { events = {} } = this.props;

      Object.keys(events).forEach((eventName: string) => {
        if (this._element instanceof HTMLElement) {
          this._element.addEventListener(eventName, events[eventName]);
        }
      });
    }
  }

  private _removeEvents() {
    if (this.props?.events) {
      const { events = {} } = this.props;

      Object.keys(events).forEach((eventName: string) => {
        if (this._element instanceof HTMLElement) {
          this._element.removeEventListener(eventName, events[eventName]);
        }
      });
    }
  }

  _createResources() {
    if (this._meta?.tagName) {
      const { tagName } = this._meta;
      this._element = this._createDocumentElement(tagName);
    }
  }

  init() {
    this._createResources();
    this.eventBus().emit(Block.EVENTS.FLOW_RENDER);
  }

  _componentDidMount() {
    this.componentDidMount();

    Object.values(this._children as Children).forEach((child) => {
      child.dispatchComponentDidMount();
    });
  }

  // Может переопределять пользователь, необязательно трогать
  componentDidMount(_oldProps: Props = {}) {}

  dispatchComponentDidMount() {
    this.eventBus().emit(Block.EVENTS.FLOW_CDM);
  }

  _componentDidUpdate(oldProps: Props, newProps: Props) {
    const response = this.componentDidUpdate(oldProps, newProps);
    if (!response) {
      return;
    }
    this.eventBus().emit(Block.EVENTS.FLOW_RENDER);
  }

  // Может переопределять пользователь, необязательно трогать
  componentDidUpdate(_oldProps: Props, _newProps: Props) {
    return true;
  }

  setProps = (nextProps: PropsAndChildren) => {
    if (!nextProps) {
      return;
    }

    Object.assign(this.props as Props, nextProps);
  };

  get element() {
    return this._element;
  }

  _render() {
    if (this._element instanceof HTMLElement) {
      const block = this.render(); // render теперь возвращает DocumentFragment

      if (block !== undefined && block !== null) {
        this._removeEvents();
        this._element.innerHTML = ""; // удаляем предыдущее содержимое
        this._element.appendChild(block);
        this._addEvents();
      }
    }
  }

  // Может переопределять пользователь, необязательно трогать
  render() {}

  getContent() {
    return this.element;
  }

  private _makePropsProxy(props: Props): Props {
    const self = this;

    return new Proxy<Props>(props, {
      get(target, prop: string) {
        const value = target[prop];
        return typeof value === "function" ? value.bind(target) : value;
      },
      set(target, prop: string, value: unknown) {
        target[prop] = value;
        self.eventBus().emit(Block.EVENTS.FLOW_CDU, { ...target }, target);
        return true;
      },
      deleteProperty() {
        throw new Error("нет доступа");
      },
    });
  }

  _createDocumentElement(tagName: string) {
    const el = document.createElement(tagName);
    if(this._meta?.tagId){
      el.setAttribute('id',this._meta?.tagId);
    }
    // Можно сделать метод, который через фрагменты в цикле создаёт сразу несколько блоков
    return el;
  }

  show() {
    const content = this.getContent();
    if (content !== null) {
      content.style.display = "block";
    }
  }

  hide() {
    const content = this.getContent();
    if (content !== null) {
      content.style.display = "none";
    }
  }
}

export default Block;

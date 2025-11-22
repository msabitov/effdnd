/**
 * DnD actor attributes
 */
export interface IActorAttrs {
    /**
     * Item name
     */
    item?: string;
    /**
     * Scope name
     */
    scope?: string;
    /**
     * Target name
     */
    target?: string;
    /**
     * Actor state
     */
    state?: 'active' | 'passive';
    /**
     * Reset target state styles
     */
    unstyled?: boolean | 'target' | 'scope';
    /**
     * Display contents
     */
    contents?: boolean;
}
/**
 * DnD trigger attributes
 */
export interface ITriggerAttrs {
    /**
     * Item name
     * @description
     * If the value is "#" then it will use `effnd-trigger` as scope
     */
    item?: string;
    /**
     * Bounding scope name
     * @description
     * If the value is "#" then it will use `document.body` as scope
     */
    scope?: string;
    /**
     * Target name or its prefix
     */
    target?: string;
    /**
     * Triggering distance
     */
    dist?: string;
    /**
     * DnD axis
     */
    axis?: string;
    /**
     * Triggering event
     * @description
     * Both 'touch' and 'mouse' by default
     */
    event?: 'touch' | 'mouse';
    /**
     * Transition duration
     */
    dur?: string;
    /**
     * Transition delay
     */
    del?: string;
    /**
     * Transition timing-function
     */
    tf?: string;
    /**
     * Item z-index in active state
     */
    zi?: string;
    /**
     * Item opacity in active state
     */
    opacity?: string;
}
/**
 * DnD trigger element 
 */
export interface ITriggerElement extends HTMLElement {
    /**
     * DnD item y-offset
     */
    dndY: number;
    /**
     * DnD item x-offset
     */
    dndX: number;
    /**
     * DnD item
     */
    dndItem: HTMLElement;
    /**
     * DnD scope
     */
    dndScope: HTMLElement;
    /**
     * DnD targets
     */
    dndTargets: Set<HTMLElement>;
    /**
     * Reset DnD transforms
     */
    resetDnD(options?: KeyframeAnimationOptions): Promise<void>;
}

type TDnDElement = HTMLElement | null | undefined;

export type TRefs = {
    trigger: ITriggerElement;
    item:  TDnDElement,
    scope: TDnDElement,
    target: TDnDElement,
    areas: Set<HTMLElement>
};

export type TKeys = {
    item: string,
    scope: string,
    target: string,
    areas: Set<string>
};

// string utils

const space = (...params: (string | number)[]) => params.join(' ');

// constants
const EVENT_NAME = 'effdnd';
export const TRIGGER_TAG = EVENT_NAME + '-trigger';
export const ACTOR_TAG = EVENT_NAME + '-actor';
const DUR = 'dur';
const DEL = 'del';
const TF = 'tf';
const OPACITY = 'opacity';
const ZI = 'zi';
const ZERO = '0px';
const MOUSE = 'mouse';
const MOVE = 'move';
const MOUSE_DOWN = MOUSE + 'down' as 'mousedown';
const MOUSE_MOVE = MOUSE + MOVE as 'mousemove';
const MOUSE_UP = MOUSE + 'up' as 'mouseup';
const TOUCH = 'touch';
const TOUCH_START = TOUCH + 'start' as 'touchstart';
const TOUCH_MOVE = TOUCH + MOVE as 'touchmove';
const TOUCH_END = TOUCH + 'end' as 'touchend';
const TOUCH_CANCEL = TOUCH + 'cancel' as 'touchcancel';
const CURSOR = 'cursor';
const GRAB = 'grab';
const GRABBING = GRAB + 'bing';
const STOP_PROP = 'stopPropagation';
const PREV_DEF = 'preventDefault';
const GET_RECT = 'getBoundingClientRect';
const REMOVE = 'remove'
const EL = 'EventListener';
const REM_EL = REMOVE + EL as 'removeEventListener';
const ADD_EL = 'add' + EL as 'addEventListener';
const ST = 'style';
const ATTR = 'Attribute'
const GET = 'get';
const SET= 'set';
const GET_ATTR = GET + ATTR as 'getAttribute';
const SET_ATTR = SET + ATTR as 'setAttribute';
const REMOVE_ATTR = REMOVE + ATTR as 'removeAttribute';
const NAME = 'name';
const DIS_BLOCK = 'display:block;';
const STATE = 'state';
const HOST = ':host';
const ACTIVE = 'active';
const PASSIVE = 'passive';
const TARGET_SELECTOR = ACTOR_TAG + `[target]`;
/**
 * DnD event types
 */
export const EVENT_TYPE = {
    DP: 'drop',
    DPL: 'dropleave',
    DPE: 'dropenter',
    DG: 'drag',
    DGE: 'dragend',
    DGS: 'dragstart'
} as const;

export type TEventType = typeof EVENT_TYPE[keyof typeof EVENT_TYPE];

export type TEventDetail = {
    type: TEventType;
    refs: TRefs;
    keys: TKeys;
    event: MouseEvent | TouchEvent;
};

interface TDnDEvent extends CustomEvent {
    detail: TEventDetail;
}

export type TDnDCallback = (event: TDnDEvent) => void;

const dispatch = (element: TDnDElement, detail: TEventDetail) => element?.dispatchEvent(new CustomEvent(EVENT_NAME, {
    bubbles: true,
    detail
}));
const unobserve = (element: HTMLElement, callback: TDnDCallback) => element[REM_EL](EVENT_NAME, callback as unknown as EventListenerOrEventListenerObject);
const observe = (element: HTMLElement, callback: TDnDCallback) => element[ADD_EL](EVENT_NAME, callback as unknown as EventListenerOrEventListenerObject);

// attribute handlers
const setActive = (elements: TDnDElement[]) => elements?.forEach((e) => e?.[SET_ATTR](STATE, ACTIVE));
const removeState = (elements: TDnDElement[]) => elements?.forEach((e) => e?.[REMOVE_ATTR](STATE));
const setPassive = (elements: TDnDElement[] | Element[]) => elements?.forEach((e) => e?.[SET_ATTR](STATE, PASSIVE));
// css handlers
const attrExp = (attr: string, val?: string | number | null) => `[${attr}${val ? '=' + val : ''}]`;
const propVal = (prop: string, val: string) => prop + ':' + val + ';';
const rule = (selector: string, content: string) => selector + `{${content}}`;
const color = (div = 2) => `oklch(from currentColor l c h / calc(alpha / ${div}))`;
const rem = (val: number) => val  + 'rem';
const getTargetByXY = (x: number, y: number): TDnDElement => document.elementFromPoint(x, y)?.closest(TARGET_SELECTOR);
const defineShadowRoot = (element: HTMLElement, css: string) => {
    const shadowRoot = element.shadowRoot || element.attachShadow({ mode: 'open' });
    shadowRoot.innerHTML = `<slot></slot>`;
    const stylesheet = new CSSStyleSheet();
    stylesheet.replaceSync(css);
    shadowRoot.adoptedStyleSheets = [stylesheet];
};
const PASSIVE_SCOPE_CSS = propVal('outline', rem(0.25) + ' dashed ' + color());
const ACTIVE_SCOPE_CSS = PASSIVE_SCOPE_CSS + propVal('filter', 'grayscale(100%)');
const PASSIVE_TARGET_CSS = DIS_BLOCK + propVal('box-shadow', space(color(), ZERO, rem(1.25), rem(2), ZERO, ',', color(3), ZERO, rem(1), rem(0.75), ZERO));
const ACTIVE_TARGET_CSS = PASSIVE_TARGET_CSS + propVal('outline', rem(0.25) + ' dashed ' + color());
const ACTOR_CSS = [
    `:host{${DIS_BLOCK}}`,
    `:host([contents]){display:contents;}`,
    `:host([scope][state=passive]:not([unstyled=''],[unstyled=scope])){${PASSIVE_SCOPE_CSS}}`,
    `:host([scope][state=active]:not([unstyled=''],[unstyled=scope])){${ACTIVE_SCOPE_CSS}}`,
    `:host([target][state=passive]:not([unstyled=''],[unstyled=target])){${PASSIVE_TARGET_CSS}}`,
    `:host([target][state=active]:not([unstyled=''],[unstyled=target])){${ACTIVE_TARGET_CSS}}`,
].join('');
const TRIGGER_CSS = rule(HOST, DIS_BLOCK + propVal(CURSOR, GRAB));
const getXY = (elem: HTMLElement) => {
    const translate = elem.style.translate.split(' ');
    return {
        x: Number.parseInt(translate[0] || '0'),
        y: Number.parseInt(translate[1] || '0')
    };
};

const subscribe = (trigger: ITriggerElement, defs: {
    dur: number;
    del: number;
    tf: string;
    zi: number;
    opacity: number;
}) => {
    const resolveItem = () => trigger.dndItem;
    const resolveScope =  () => trigger.dndScope;
    const resolveAreas = () => new Set(trigger.dndTargets);
    const resolveAttr = (name: string) => trigger[GET_ATTR](name);

    const refs: TRefs = {
        trigger,
        item: null,
        scope: null,
        target: null,
        areas: new Set()
    };

    const keys: TKeys = {
        item: '',
        scope: '',
        target: '',
        areas: new Set()
    };

    let scopeRect: DOMRect | null = null;
    
    let x: {
        ini: number;
        off: number;
        max: number;
        min: number;
    } | undefined;
    let y: {
        ini: number;
        off: number;
        max: number;
        min: number;
    } | undefined;

    let duration: number = defs.dur;
    let delay: number = defs.del;
    let easing: string = defs.tf;

    const attrs: {
        axis: string | null;
        dist: number | null;
    } = {
        axis: null,
        dist: null
    };

    let initialStyle = {
        zIndex: 'auto',
        opacity: '1',
        pointerEvents: 'auto',
        touchAction: 'auto'
    };
    let initCursor = 'auto';

    const reset = (event: TouchEvent | MouseEvent) => {
        removeState([refs.scope, refs.item, ...refs.areas.keys()]);

        refs.item = null;
        refs.target = null;
        refs.scope = null;
        refs.areas = new Set();
        keys.item = '';
        keys.target = '';
        keys.scope = '';
        keys.areas = new Set();
        attrs.axis = null;
        attrs.dist = null;
        scopeRect = null;
        x = undefined;
        y = undefined;
        const remove = document[REM_EL];
        if (event.type === TOUCH_END) {
            remove(TOUCH_MOVE, onDrag);
            remove(TOUCH_END, onDragEnd);
        } else {
            remove(MOUSE_MOVE, onDrag);
            remove(MOUSE_UP, onDragEnd);
        }
    }

    /**
     * Drag callback
     * @param event
     */
    const onDrag = async (event: TouchEvent | MouseEvent) => {
        if (!refs.item) return;

        let eventY: number;
        let eventX: number;
        if (event.type === TOUCH_MOVE) {
            const touch = (event as TouchEvent).targetTouches[0];
            eventY = touch.clientY;
            eventX = touch.clientX;
        } else {
            eventY = (event as MouseEvent).clientY;
            eventX = (event as MouseEvent).clientX;
        }
        event[PREV_DEF]();
        if (x && y && attrs.dist && (Math.abs(x.ini - eventX) < attrs.dist) && (Math.abs(y.ini - eventY) < attrs.dist)) return;

        const targetByXY = getTargetByXY(eventX, eventY);
        const nextTarget = refs.areas.has(targetByXY as HTMLElement) ? targetByXY : null;
        if (nextTarget !== refs.target) {
            setPassive([refs.target]);
            dispatch(refs.target, {
                type: EVENT_TYPE.DPL,
                refs,
                keys,
                event
            });
            if (nextTarget && refs.areas.has(nextTarget)) setActive([nextTarget]);
            refs.target = nextTarget;
            keys.target = refs.target?.getAttribute(NAME) || '';
            dispatch(refs.target, {
                type: EVENT_TYPE.DPE,
                refs,
                keys,
                event
            });
        }

        let xval = 0;
        let yval = 0;
        if (attrs.axis !== 'x' && y && y.min !== y.max) yval = Math.max(y.min, Math.min(y.off + eventY - y.ini, y.max));
        if (attrs.axis !== 'y' && x && x.min !== x.max) xval = Math.max(x.min, Math.min(x.off + eventX - x.ini, x.max));

        if (scopeRect) {
            if (scopeRect.left <= eventX && scopeRect?.right >= eventX && scopeRect.top <= eventY && scopeRect?.bottom >= eventY) setPassive([refs.scope]);
            else setActive([refs.scope]);
        }
        const animation = refs.item.animate(
            {
                translate: space(xval + 'px', yval + 'px'),
            },
            {
                fill: 'forwards',
                duration,
                delay,
                easing
            },
        );
        await animation?.finished;
        animation?.commitStyles();
        dispatch(refs.item, {
            type: EVENT_TYPE.DG,
            refs,
            keys,
            event
        });
    }

    /**
     * Drag end callback
     * @param event
     */
    const onDragEnd = async (event: MouseEvent | TouchEvent) => {
        event[PREV_DEF]?.();
        event[STOP_PROP]();
        if (initCursor === 'auto') refs.scope?.style.removeProperty(CURSOR);
        else refs.scope?.style.setProperty(CURSOR, initCursor);
        if (refs.target) {
            dispatch(refs.target, {
                type: EVENT_TYPE.DP,
                refs,
                keys,
                event
            });
            dispatch(refs.target, {
                type: EVENT_TYPE.DPL,
                refs,
                keys,
                event
            });
        }
        dispatch(refs.item, {
            type: EVENT_TYPE.DGE,
            refs,
            keys,
            event
        });
        const animation = refs.item?.animate(
            initialStyle,
            {
                fill: 'forwards',
                duration: 0,
                delay: 0
            },
        );
        await animation?.finished;
        animation?.commitStyles();
        reset(event);
    };

    /**
     * Drag start handler
     * @param event
     */
    const onDragStart = async (event: MouseEvent | TouchEvent) => {
        if (!event.target || !trigger.contains(event.target as Node)) return;
        // start position
        let startX
        let startY;
        if (event.type === TOUCH_START) {
            const touch = (event as TouchEvent).touches[0];
            startX = touch.clientX;
            startY = touch.clientY;
        } else {
            startX = (event as MouseEvent).clientX;
            startY = (event as MouseEvent).clientY;
        }
        attrs.axis = resolveAttr('axis');
        attrs.dist = Number(resolveAttr('dist'));

        refs.item = resolveItem();
        if (!refs.item) return;
        refs.scope = resolveScope();
        refs.areas = resolveAreas();
        keys.item = refs.item?.getAttribute('item') || '';
        keys.scope = refs.scope?.getAttribute('scope') || '';
        keys.areas = new Set(refs.areas?.keys().map(area => area.getAttribute('target') || ''));
        
        event[PREV_DEF]?.();
        event[STOP_PROP]();
        initCursor = getComputedStyle(refs.scope).cursor;
        refs.scope.style.setProperty(CURSOR, GRABBING);
        scopeRect = refs.scope[GET_RECT]();
        const itemRect = refs.item[GET_RECT]();
        const computedStyle = getComputedStyle(refs.item);
        initialStyle = {
            zIndex: computedStyle.zIndex || 'auto',
            opacity: computedStyle.opacity || '1',
            pointerEvents: computedStyle.pointerEvents || 'auto',
            touchAction: computedStyle.touchAction || 'auto',
        };
        const translate = getXY(refs.item);
        const currentOffsetX = translate.x;
        const currentOffsetY = translate.y;

        const minOffsetY = scopeRect.top - (itemRect.top - currentOffsetY);
        const maxOffsetY = scopeRect.bottom - (itemRect.bottom - currentOffsetY);
        const minOffsetX = scopeRect.left - (itemRect.left - currentOffsetX);
        const maxOffsetX = scopeRect.right - (itemRect.right - currentOffsetX);
        x = {
            ini: startX,
            off: currentOffsetX,
            max: maxOffsetX,
            min: minOffsetX
        };
        y = {
            ini: startY,
            off: currentOffsetY,
            max: maxOffsetY,
            min: minOffsetY
        };
        duration = Number(trigger.getAttribute(DUR)) || defs.dur;
        delay = Number(trigger.getAttribute(DEL)) || defs.del;
        easing = trigger.getAttribute(TF) || defs.tf;

        setActive([refs.item]);
        setPassive([refs.scope, ...refs.areas]);
        const zIndex = trigger.getAttribute(ZI) || defs.zi;
        const opacity = trigger.getAttribute(OPACITY) || defs.opacity;
        const animation = refs.item?.animate(
            {
                zIndex,
                opacity,
                pointerEvents: 'none',
                touchEvents: 'none'
            },
            {
                fill: 'forwards',
                duration: 0,
                delay: 0
            },
        );
        await animation?.finished;
        animation?.commitStyles();
        const docListen = document[ADD_EL];
        if (event.type === TOUCH_START) {
            docListen(TOUCH_MOVE, onDrag, {[PASSIVE]: false});
            docListen(TOUCH_END, onDragEnd);
            docListen(TOUCH_CANCEL, onDragEnd);
        } else {
            docListen(MOUSE_MOVE, onDrag);
            docListen(MOUSE_UP, onDragEnd);
        }
    };

    // listen to trigger
    const triggerListen = trigger[ADD_EL];
    const event = resolveAttr('event');
    if (event !== TOUCH) triggerListen(MOUSE_DOWN, onDragStart);
    if (event !== MOUSE) triggerListen(TOUCH_START, onDragStart, {[PASSIVE]: false});
    return () => {
        const triggerRemove = trigger[REM_EL];
        triggerRemove(MOUSE_DOWN, onDragStart);
        triggerRemove(TOUCH_START, onDragStart);
    };
};

export type TUseDnD = (defs?: Partial<{
    /**
     * Duration
     */
    dur: number;
    /**
     * Delay
     */
    del: number;
    /**
     * Transition-timing-function
     */
    tf: string;
    /**
     * Active DnD item z-index
     */
    zi: number;
    /**
     * Active DnD item opacity
     */
    opacity: number;
}>) => {
    /**
     * Observe DnD events
     * @param callback - event handler
     * @param element - HTML element
     */
    observe: (callback: TDnDCallback, element?: HTMLElement) => () => void;
    /**
     * Unobserve DnD events
     * @param callback - event handler
     * @param element - HTML element
     */
    unobserve: (callback: TDnDCallback, element?: HTMLElement) => void;
};

/**
 * Define drag and drop provider custom element
 */
export const useDnD: TUseDnD = (defs = {}) => {
    const {dur = 100, del = 0, tf = 'linear', zi = 1000, opacity = 0.5} = defs;
    const custom = globalThis.customElements;
    const doc = globalThis.document;
    if (custom && !custom?.get(TRIGGER_TAG)) {
        custom.define(TRIGGER_TAG, class Trigger extends HTMLElement  {
            get dndItem(): HTMLElement {
                const itemName = this[GET_ATTR]('item');
                if (itemName === '#') return this;
                return this.closest(ACTOR_TAG + attrExp('item', itemName || '')) || this;
            }

            get dndX(): number {
                return getXY(this.dndItem).x;
            }

            get dndY(): number {
                return getXY(this.dndItem).y;
            }

            get dndScope(): HTMLElement {
                const scopeName = this[GET_ATTR]('scope');
                if (scopeName === '#') return document.body;
                return this.closest(ACTOR_TAG + attrExp('scope', scopeName || '')) || document.body;
            }

            get dndTargets(): Set<HTMLElement> {
                const targetName = this[GET_ATTR]('target');
                return new Set(this.dndScope.querySelectorAll(ACTOR_TAG + (targetName ? `[target^="${targetName}"]` : `[target]`)));
            }

            /**
             * Reset translate effects
             */
            async resetDnD(params = {}) {
                const animation = this.dndItem.animate({
                    translate: '0'
                }, {
                    fill: 'forwards',
                    duration: 0,
                    delay: 0,
                    ...params
                });
                await animation?.finished;
                animation?.commitStyles();
            }

            disconnectedCallback: () => void;

            connectedCallback() {
                defineShadowRoot(this, TRIGGER_CSS);
                const unsubscribe = subscribe(this, {dur, del, tf, zi, opacity});
                this.disconnectedCallback = () => unsubscribe();
            }
        });
        /**
         * Actor
         */
        custom.define(ACTOR_TAG, class Item extends HTMLElement {
            connectedCallback() {
                defineShadowRoot(this, ACTOR_CSS);
            }
        });
    }
    return {
        observe: (callback: TDnDCallback, element: HTMLElement = doc?.body) => {
            element && observe(element, callback);
            return () => element && unobserve(element, callback);
        },
        unobserve: (callback: TDnDCallback, element: HTMLElement = doc?.body) => unobserve(element, callback)
    };
};

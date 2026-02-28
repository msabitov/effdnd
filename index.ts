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
    /**
     * Item mode
     */
    'item-mode'?: 'keep' | 'clone';
    /**
     * Target mode
     */
    'target-mode'?: 'append' | 'prepend' | 'remove';
    /**
     * Scope mode
     */
    'scope-mode'?: 'order-x' | 'order-y';
    /**
     * Scope transition duration
     */
    'scope-dur'?: number;
    /**
     * Scope transition delay
     */
    'scope-del'?: number;
    /**
     * Scope transition timing-function
     */
    'scope-tf'?: string;
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
}
/**
 * DnD trigger element 
 */
export interface ITriggerElement extends HTMLElement {
    /**
     * Is trigger active
     */
    isActive: boolean;
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
     * Reset DnD translate
     */
    resetDnD(): void;
}

type TDnDElement = HTMLElement | null | undefined;

export type TRefs = {
    index: number;
    nextIndex: number;
    trigger: ITriggerElement;
    item:  TDnDElement;
    clone: TDnDElement;
    scope: TDnDElement;
    target: TDnDElement;
    areas: Set<HTMLElement>;
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
const PX = 'px';
const AUTO = 'auto';
const NONE = 'none';
const ITEM = 'item';
const TARGET = 'target';
const SCOPE = 'scope';
const SCOPE_DEL = SCOPE + '-' + DEL;
const SCOPE_DUR = SCOPE + '-' + DUR;
const SCOPE_TF = SCOPE + '-' + TF;
const HOST = ':host';
const ACTIVE = 'active';
const PASSIVE = 'passive';
const TARGET_SELECTOR = ACTOR_TAG + `[target]`;
const STATE_ACTIVE = `[${STATE}=${ACTIVE}]`;
const STATE_PASSIVE = `[${STATE}=${PASSIVE}]`;

type TReorderItem = {
    elem: HTMLElement;
    rect: DOMRect;
};

/**
 * DnD event types
 */
export const EVENT_TYPE = {
    DP: 'drop',
    DPL: 'dropleave',
    DPE: 'dropenter',
    DG: 'drag',
    DGE: 'dragend',
    DGS: 'dragstart',
    ORD: 'order',
    TF: 'transfer'
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
const setCloned = (elements: TDnDElement[]) => elements?.forEach((e) => e?.[SET_ATTR](STATE, 'cloned'));
const setActive = (elements: TDnDElement[]) => elements?.forEach((e) => e?.[SET_ATTR](STATE, ACTIVE));
const removeState = (elements: TDnDElement[]) => elements?.forEach((e) => e?.[REMOVE_ATTR](STATE));
const setPassive = (elements: TDnDElement[] | Element[]) => elements?.forEach((e) => e?.[SET_ATTR](STATE, PASSIVE));
// css handlers
const attrExp = (attr: string, val?: string | number | null) => `[${attr}${val ? '=' + val : ''}]`;
const propVal = (prop: string, val: string) => prop + ':' + val + ';';
const rule = (selector: string, content: string) => selector + `{${content}}`;
const color = (div = 2) => `oklch(from currentColor l c h / calc(alpha / ${div}))`;
const rem = (val: number | string) => val  + 'rem';
const getTargetByXY = (x: number, y: number): TDnDElement => document.elementFromPoint(x, y)?.closest(TARGET_SELECTOR);
const defineShadowRoot = (element: HTMLElement, css: string) => {
    const shadowRoot = element.shadowRoot || element.attachShadow({ mode: 'open' });
    shadowRoot.innerHTML = `<slot></slot>`;
    const stylesheet = new CSSStyleSheet();
    stylesheet.replaceSync(css);
    shadowRoot.adoptedStyleSheets = [stylesheet];
};
const BASE_SIZE = '0.2';
const PASSIVE_SCOPE_CSS = propVal('box-shadow', space(ZERO, ZERO, rem(1), ZERO, color()));
const ACTIVE_SCOPE_CSS = PASSIVE_SCOPE_CSS + propVal(OPACITY, '0.5');
const PASSIVE_TARGET_CSS = propVal('outline', rem(BASE_SIZE) + ' dashed ' + color());
const ACTIVE_TARGET_CSS = propVal('outline', rem(BASE_SIZE) + ' solid ' + color());
const notUnstyled = (role: string) => `:not([unstyled=''],[unstyled=${role}])`;
const square = (str: string) => `[${str}]`;
const ACTOR_CSS = [
    HOST + `{${DIS_BLOCK}position:relative;}`,
    HOST + `([contents]){display:contents;}`,
    HOST + `(${square(ITEM) + STATE_ACTIVE + notUnstyled(ITEM)}){${propVal(OPACITY, '0.75')};${propVal('z-index', '1000')}}`,
    HOST + `(${square(ITEM) + '[state=cloned]' + notUnstyled(ITEM)}){${propVal(OPACITY, BASE_SIZE)};}`,
    HOST + `(${square(SCOPE) + STATE_PASSIVE + notUnstyled(SCOPE)}){${PASSIVE_SCOPE_CSS}}`,
    HOST + `(${square(SCOPE) + STATE_ACTIVE + notUnstyled(SCOPE)}){${ACTIVE_SCOPE_CSS}}`,
    HOST + `(${square(TARGET) + STATE_PASSIVE + notUnstyled(TARGET)}){${PASSIVE_TARGET_CSS}}`,
    HOST + `(${square(TARGET) + STATE_ACTIVE + notUnstyled(TARGET)}){${ACTIVE_TARGET_CSS}}`,
].join('');

const fullIcon = 'data:image/svg+xml,%3Csvg%20viewBox%3D%220%200%20100%20100%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20style%3D%22fill%3AcurrentColor%3Bmax-width%3A1em%3Bmax-height%3A1em%3B%22%3E%0D%0A%3Ccircle%20cx%3D%2237.5%22%20cy%3D%2237.5%22%20r%3D%229.5%22%2F%3E%0D%0A%3Ccircle%20cx%3D%2237.5%22%20cy%3D%2262.5%22%20r%3D%229.5%22%2F%3E%0D%0A%3Ccircle%20cx%3D%2262.5%22%20cy%3D%2237.5%22%20r%3D%229.5%22%2F%3E%0D%0A%3Ccircle%20cx%3D%2262.5%22%20cy%3D%2262.5%22%20r%3D%229.5%22%2F%3E%0D%0A%3C%2Fsvg%3E'
const yIcon = 'data:image/svg+xml,%3Csvg%20viewBox%3D%220%200%20100%20100%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20style%3D%22fill%3AcurrentColor%3Bmax-width%3A1em%3Bmax-height%3A1em%3B%22%3E%3Ccircle%20cx%3D%2237.5%22%20cy%3D%2225%22%20r%3D%229.5%22%3E%3C%2Fcircle%3E%3Ccircle%20cx%3D%2237.5%22%20cy%3D%2250%22%20r%3D%229.5%22%3E%3C%2Fcircle%3E%3Ccircle%20cx%3D%2237.5%22%20cy%3D%2275%22%20r%3D%229.5%22%3E%3C%2Fcircle%3E%3Ccircle%20cx%3D%2262.5%22%20cy%3D%2225%22%20r%3D%229.5%22%3E%3C%2Fcircle%3E%3Ccircle%20cx%3D%2262.5%22%20cy%3D%2250%22%20r%3D%229.5%22%3E%3C%2Fcircle%3E%3Ccircle%20cx%3D%2262.5%22%20cy%3D%2275%22%20r%3D%229.5%22%3E%3C%2Fcircle%3E%3C%2Fsvg%3E';
const xIcon = 'data:image/svg+xml,%3Csvg%20viewBox%3D%220%200%20100%20100%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20style%3D%22fill%3AcurrentColor%3Bmax-width%3A1em%3Bmax-height%3A1em%3B%22%3E%3Ccircle%20cy%3D%2237.5%22%20cx%3D%2225%22%20r%3D%229.5%22%3E%3C%2Fcircle%3E%3Ccircle%20cy%3D%2237.5%22%20cx%3D%2250%22%20r%3D%229.5%22%3E%3C%2Fcircle%3E%3Ccircle%20cy%3D%2237.5%22%20cx%3D%2275%22%20r%3D%229.5%22%3E%3C%2Fcircle%3E%3Ccircle%20cy%3D%2262.5%22%20cx%3D%2225%22%20r%3D%229.5%22%3E%3C%2Fcircle%3E%3Ccircle%20cy%3D%2262.5%22%20cx%3D%2250%22%20r%3D%229.5%22%3E%3C%2Fcircle%3E%3Ccircle%20cy%3D%2262.5%22%20cx%3D%2275%22%20r%3D%229.5%22%3E%3C%2Fcircle%3E%3C%2Fsvg%3E';

const TRIGGER_CSS = rule(HOST, DIS_BLOCK + propVal(CURSOR, GRAB)) +
    `:host(:empty)::after{width:1.5em;display:block;height:1.5em;content:url(${fullIcon});}` +
    `:host([axis=x]:empty){content: url(${xIcon});}` +
    `:host([axis=y]:empty){content: url(${yIcon});}`;
const getXY = (elem: HTMLElement) => {
    const translate = elem.style.translate.split(' ');
    return {
        x: Number.parseInt(translate[0] || '0'),
        y: Number.parseInt(translate[1] || '0')
    };
};

const DEF_INI = {
    marginLeft: 0,
    marginRight: 0,
    marginTop: 0,
    marginBottom: 0,
    width: 0,
    height: 0
};

const DEF_TRANSITION = {
    dur: 100,
    del: 0,
    tf: 'linear'
};

const getSubscribe = () => (trigger: ITriggerElement) => {
    const resolveItem = () => trigger.dndItem;
    const resolveScope =  () => trigger.dndScope;
    const resolveAreas = () => new Set(trigger.dndTargets);
    const resolveAttr = (name: string) => trigger[GET_ATTR](name);

    const refs: TRefs = {
        index: -1,
        nextIndex: -1,
        trigger,
        clone: null,
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

    let duration: number = DEF_TRANSITION.dur;
    let delay: number = DEF_TRANSITION.del;
    let easing: string = DEF_TRANSITION.tf;
    let scopemode: 'order-x' | 'order-y' | null;
    const reorderRefs: {
        prev: TReorderItem[];
        next: TReorderItem[];
    } = {
        prev: [],
        next: []
    };

    const attrs: {
        axis: string | null;
        dist: number | null;
        clone: boolean;
    } = {
        axis: null,
        dist: null,
        clone: false
    };

    let initialStyle = DEF_INI;
    let initCursor = AUTO;

    const reset = (event: TouchEvent | MouseEvent) => {
        removeState([refs.scope, refs.item, ...refs.areas.keys()]);

        if (refs.clone) refs.clone.remove();
        refs.clone = null;
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
        reorderRefs.prev = [];
        reorderRefs.next = [];
        initialStyle = DEF_INI;

        const remove = document[REM_EL];
        trigger.isActive = false;
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
    const onDrag = (event: TouchEvent | MouseEvent) => {
        if (!refs.item || !x || !y) return;
        event[PREV_DEF]?.();
        event[STOP_PROP]();
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

        if (!scopemode) {
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
        } else {
            let targetIndex = refs.index;
            if (attrs.axis === 'x') {
                const offset = initialStyle.width + initialStyle.marginLeft + initialStyle.marginRight;
                if (eventX > x.ini) {
                    reorderRefs.next.forEach(({elem, rect}, ind) => {
                        if (eventX > rect.left) {
                            targetIndex = refs.index + 1 + ind;
                            elem.style.translate = `-${offset}px 0px `;
                        } else elem.style.translate = `0px`;
                    });
                    reorderRefs.prev.forEach(({elem}) => {
                        elem.style.translate = `0px`;
                    })
                } else {
                    reorderRefs.next.forEach(({elem}) => {
                        elem.style.translate = `0px`;
                    });
                    reorderRefs.prev.forEach(({elem, rect}, ind) => {
                        if (eventX < rect.right) {
                            targetIndex = refs.index - (1 + ind);
                            elem.style.translate = `${offset}px 0px`;
                        } else elem.style.translate = `0px`;
                    })
                }
            } else {
                const offset = initialStyle.height + initialStyle.marginTop + initialStyle.marginBottom;
                if (eventY > y.ini) {
                    reorderRefs.next.forEach(({elem, rect}, ind) => {
                        if (eventY > rect.top) {
                            targetIndex = refs.index + 1 + ind;
                            elem.style.translate = `0px -${offset}px`;
                        } else elem.style.translate = `0px`;
                    });
                    reorderRefs.prev.forEach(({elem}) => {
                        elem.style.translate = `0px`;
                    })
                } else {
                    reorderRefs.next.forEach(({elem}) => {
                        elem.style.translate = `0px`;
                    });
                    reorderRefs.prev.forEach(({elem, rect}, ind) => {
                        if (eventY < rect.bottom) {
                            targetIndex = refs.index - (1 + ind);
                            elem.style.translate = `0px ${offset}px`;
                        } else elem.style.translate = `0px`;
                    })
                }
            }
            refs.nextIndex = targetIndex;
        }

        let xval = 0;
        let yval = 0;
        if (attrs.axis !== 'x' && y && y.min !== y.max) yval = Math.max(y.min, Math.min(y.off + eventY - y.ini, y.max));
        if (attrs.axis !== 'y' && x && x.min !== x.max) xval = Math.max(x.min, Math.min(x.off + eventX - x.ini, x.max));

        if (scopeRect) {
            if (scopeRect.left <= eventX && scopeRect?.right >= eventX && scopeRect.top <= eventY && scopeRect?.bottom >= eventY) setPassive([refs.scope]);
            else setActive([refs.scope]);
        }
        const animated = (refs.clone || refs.item);
        globalThis.requestAnimationFrame(() => {
            animated.style.translate = space(xval + PX, yval + PX);
        });
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
    const onDragEnd = (event: MouseEvent | TouchEvent) => {
        event[PREV_DEF]?.();
        event[STOP_PROP]();
        if (initCursor === AUTO) refs.scope?.style.removeProperty(CURSOR);
        else refs.scope?.style.setProperty(CURSOR, initCursor);

        if (scopemode && refs.item) {
            const item = refs.item;
            item.style.transition = '';
            item.style.pointerEvents = '';
            item.style.touchAction = '';
            globalThis.requestAnimationFrame(() => {
                item.style.translate = '';
            });
            const reorderIndex = refs.nextIndex;
            if (refs.scope && typeof reorderIndex === 'number' && reorderIndex !== refs.index) {
                if (reorderIndex < refs.index) refs.scope.children[reorderIndex].insertAdjacentElement('beforebegin', refs.item);
                else refs.scope.children[reorderIndex].insertAdjacentElement('afterend', refs.item);
            }
            reorderRefs.prev.forEach(({elem}) => {
                elem.style.translate = '';
                elem.style.transition = '';
            });
            reorderRefs.next.forEach(({elem}) => {
                elem.style.translate = '';
                elem.style.transition = '';
            });
            dispatch(refs.scope, {
                type: EVENT_TYPE.ORD,
                refs,
                keys,
                event
            });
            dispatch(refs.item, {
                type: EVENT_TYPE.DGE,
                refs,
                keys,
                event
            });
            reset(event);
            return;
        }

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
        const item = (refs.clone || refs.item);
        if (!item) return;
        item.style.pointerEvents = '';
        item.style.touchAction = '';
        item.style.transition = '';
        if (item.getAttribute('item-mode') !== 'keep') globalThis.requestAnimationFrame(() => {
            item.style.translate = '';
        });
        const targetaction = refs.target?.getAttribute('target-mode')
        if (targetaction && refs.item && !refs.target?.contains(refs.item)) {
            if (targetaction === 'prepend') refs.target?.prepend(refs.item);
            else if (targetaction === 'remove') refs.item.remove();
            else refs.target?.append(refs.item);
            dispatch(refs.target, {
                type: EVENT_TYPE.TF,
                refs,
                keys,
                event
            });
        }
        reset(event);
    };

    /**
     * Drag start handler
     * @param event
     */
    const onDragStart = (event: MouseEvent | TouchEvent) => {
        if (trigger.isActive || !event.target || !trigger.contains(event.target as Node)) return;
        
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
        attrs.clone = refs.item.getAttribute('item-mode') === 'clone';
        refs.scope = resolveScope();
        duration = +(trigger.getAttribute(DUR) || refs.scope.getAttribute(SCOPE_DUR) || DEF_TRANSITION.dur);
        delay = +(trigger.getAttribute(DEL) || refs.scope.getAttribute(SCOPE_DEL) || DEF_TRANSITION.del);
        easing = trigger.getAttribute(TF) || refs.scope.getAttribute(SCOPE_TF) || DEF_TRANSITION.tf;
        const transition = `translate ${duration}ms ${easing} ${delay}ms`;
        const items = [...refs.scope.children] as HTMLElement[];
        refs.index = items.indexOf(refs.item);
        refs.nextIndex = refs.index;
        scopemode = refs.scope ? (refs.scope.getAttribute('scope-mode') as 'order-x' | 'order-y') : null;
        if (scopemode) {
            attrs.axis = scopemode === 'order-x' ? 'x' : 'y';
            reorderRefs.prev = items.slice(0, refs.index).toReversed().map((elem) => {
                elem.style.transition = transition;
                return {elem, rect: elem.getBoundingClientRect()};
            });
            reorderRefs.next = items.slice(refs.index + 1).map((elem) => {
                elem.style.transition = transition;
                return {elem, rect: elem.getBoundingClientRect()};
            });
        }
        refs.areas = resolveAreas();
        keys.item = refs.item?.getAttribute(ITEM) || '';
        keys.scope = refs.scope?.getAttribute(SCOPE) || '';
        keys.areas = new Set(refs.areas?.keys().map(area => area.getAttribute(TARGET) || ''));
        
        event[PREV_DEF]?.();
        event[STOP_PROP]();
        initCursor = getComputedStyle(refs.scope).cursor;
        refs.scope.style.setProperty(CURSOR, GRABBING);
        scopeRect = refs.scope[GET_RECT]();
        const itemRect = refs.item[GET_RECT]();
        const computedStyle = getComputedStyle(refs.item);
        initialStyle = {
            marginLeft: Number.parseInt(computedStyle.marginLeft),
            marginRight: Number.parseInt(computedStyle.marginRight),
            marginTop: Number.parseInt(computedStyle.marginTop),
            marginBottom: Number.parseInt(computedStyle.marginBottom),
            width: itemRect.width,
            height: itemRect.height
        };
        const translate = getXY(refs.item);
        const currentOffsetX = translate.x;
        const currentOffsetY = translate.y;
        if (attrs.clone && !scopemode) {
            const clone = refs.item.cloneNode(true) as HTMLElement;
            clone.style.position = 'fixed';
            clone.style.top = itemRect.top + PX;
            clone.style.left = itemRect.left + PX;
            clone.style.height = (itemRect.bottom - itemRect.top) + PX;
            clone.style.width = (itemRect.right - itemRect.left) + PX;
            clone.style.margin = 0 + PX;
            refs.item.parentElement?.appendChild(clone);
            refs.clone = clone;
        }

        if (refs.clone) refs.clone.style.transition = transition;
        else refs.item.style.transition = transition;

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
        trigger.isActive = true;
        setActive([refs.clone || refs.item]);
        if (refs.clone) setCloned([refs.item]);
        setPassive([refs.scope, ...refs.areas]);
        const animated = (refs.clone || refs.item);
        animated.style.pointerEvents = NONE + '';
        animated.style.touchAction = NONE + '';
        animated.style.transition = `translate ${duration}ms ${easing} ${delay}ms`;
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

export type TUseDnD = () => {
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
export const useDnD: TUseDnD = () => {
    const custom = globalThis.customElements;
    const doc = globalThis.document;
    if (custom && !custom?.get(TRIGGER_TAG)) {
        custom.define(TRIGGER_TAG, class Trigger extends HTMLElement  {
            isActive: boolean = false;

            get dndItem(): HTMLElement {
                const itemName = this[GET_ATTR](ITEM);
                if (itemName === '#') return this;
                return this.closest(ACTOR_TAG + attrExp(ITEM, itemName || '')) || this;
            }

            get dndX(): number {
                return getXY(this.dndItem).x;
            }

            get dndY(): number {
                return getXY(this.dndItem).y;
            }

            get dndScope(): HTMLElement {
                const scopeName = this[GET_ATTR](SCOPE);
                if (scopeName === '#') return document.body;
                return this.closest(ACTOR_TAG + attrExp(SCOPE, scopeName || '')) || document.body;
            }

            get dndTargets(): Set<HTMLElement> {
                if (this.dndScope.getAttribute('scope-mode') !== null) return new Set();
                const targetName = this[GET_ATTR](TARGET);
                return new Set([
                    ...this.dndScope.querySelectorAll<HTMLElement>(ACTOR_TAG + (targetName ? `[${TARGET}^="${targetName}"]` : square(TARGET)))
                ].filter((elem) => !elem.contains(this)));
            }

            /**
             * Reset translate effects
             */
            resetDnD() {
                if (this.dndItem) this.dndItem.style.translate = '';
            }

            disconnectedCallback: () => void;

            connectedCallback() {
                defineShadowRoot(this, TRIGGER_CSS);
                const subscribe = getSubscribe();
                const unsubscribe = subscribe(this);
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

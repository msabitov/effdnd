/**
 * DnD trigger attributes
 */
export interface ITriggerAttrs {
    /**
     * Bounding scope key
     */
    scope?: string;
    /**
     * Targets group
     */
    target?: string;
    /**
     * Triggering distance
     */
    dist?: string;
    /**
     * Triggering event
     * @description
     * Both 'touch' and 'mouse' by default
     */
    event?: 'touch' | 'mouse';
}
/**
 * DnD trigger element 
 */
export interface ITriggerElement extends HTMLElement {
    dndY: number;
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
    dndTargets: Set<Element>;
    /**
     * Reset DnD transforms
     */
    resetDnD(): void;
}

type TDnDTarget = HTMLElement | null | undefined;

export type TRefs = {
    item: TDnDTarget,
    scope: TDnDTarget,
    target: TDnDTarget,
    areas: Set<Element>
};

export type TKeys = {
    item: string,
    scope: string,
    target: string,
    areas: Set<string>
};

// string utils

const space = (...params: string[]) => params.join(' ');

// constants
const EVENT_NAME = 'effdnd';
const PREFIX = '--' + EVENT_NAME;
const TAG_NAME = EVENT_NAME + '-trigger'
const X = PREFIX + '-x';
const Y = PREFIX + '-y';
const DUR = PREFIX + '-dur';
const DEL = PREFIX + '-del';
const FUNC = PREFIX + '-func';
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
const TRANSLATE = 'translate';
const TRANSITION = 'transition';
const POSITION = 'position';
const RELATIVE = 'relative';
const DATA_ = 'data-';
const ATTR_PREFIX = DATA_ + EVENT_NAME;
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
const PROPERTY = 'Property';
const GET_PROP = GET + PROPERTY + 'Value' as 'getPropertyValue';
const SET_PROP = SET + PROPERTY as 'setProperty';

/**
 * DnD attributes
 */
export const ATTRS = {
    /**
     * CSS styles
     */
    styles: ATTR_PREFIX,
    /**
     * Drag item
     */
    item: ATTR_PREFIX + '-i',
    /**
     * Drag target
     */
    target: ATTR_PREFIX + '-t',
    /**
     * Drag scope
     */
    scope: ATTR_PREFIX + '-s',
    /**
     * Active element
     */
    active: ATTR_PREFIX + '-a',
    /**
     * Passive element
     */
    passive: ATTR_PREFIX + '-p',
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
    DGS: 'dragstart'
} as const;

export type TEventType = typeof EVENT_TYPE[keyof typeof EVENT_TYPE];

export type TEventDetail = {
    type: TEventType;
    refs: TRefs;
    keys: TKeys;
    event: MouseEvent | TouchEvent;
};

const dispatch = (element: TDnDTarget, detail: TEventDetail) => element?.dispatchEvent(new CustomEvent(EVENT_NAME, {
    bubbles: true,
    detail
}));
const unobserve = (element: HTMLElement, callback: EventListenerOrEventListenerObject) => element[REM_EL](EVENT_NAME, callback);
const observe = (element: HTMLElement, callback: EventListenerOrEventListenerObject) => element[ADD_EL](EVENT_NAME, callback);

// attribute handlers
const setActive = (elements: TDnDTarget[]) => elements?.forEach((e) => e?.[SET_ATTR](ATTRS.active, ''));
const removeActive = (elements: TDnDTarget[]) => elements?.forEach((e) => e?.[REMOVE_ATTR](ATTRS.active));
const setPassive = (elements: TDnDTarget[] | Element[]) => elements?.forEach((e) => e?.[SET_ATTR](ATTRS.passive, ''));
const removePassive  = (elements: TDnDTarget[] | Element[]) => elements?.forEach((e) => e?.[REMOVE_ATTR](ATTRS.passive));

// custom property handlers
const setX = (element: HTMLElement, val: number) => element?.[ST][SET_PROP](X, val + 'px');
const setY = (element: HTMLElement, val: number) => element?.[ST][SET_PROP](Y, val + 'px');

// css handlers
const varExp = (val: string, rep: string | number) => `var(${val}, ${rep})`;
const attrExp = (attr: string, val?: string | number | null) => `[${attr}${val ? '=' + val : ''}]`;
const time = (val: string | number) => typeof val === 'string' ? val : val + 'ms';
const propVal = (prop: string, val: string) => prop + ':' + val + ';';
const rule = (selector: string, content: string) => selector + `{${content}}`;
const color = (div = 2) => `oklch(from currentColor l c h / calc(alpha / ${div}))`;
const rem = (val: number) => val  + 'rem';
const getTargetByXY = (x: number, y: number): TDnDTarget => document.elementFromPoint(x, y)?.closest(attrExp(ATTRS.target));
const attrObj = (key: string, val: string | number) => Object.defineProperties(
    { [key]: val },
    {
        toString: {
            value: () => `${key}="${val}"`
        }
    }
);

const subscribe = (trigger: HTMLElement & {dndItem: HTMLElement; dndScope: HTMLElement; dndTargets: Set<Element>;}) => {
    const resolveItem = () => trigger.dndItem;
    const resolveScope =  () => trigger.dndScope;
    const resolveAreas = () => new Set(trigger.dndTargets);
    const resolveAttr = (name: string) => trigger[GET_ATTR](name);

    const refs: TRefs = {
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

    const attrs: {
        axis: string | null;
        dist: number | null;
    } = {
        axis: null,
        dist: null
    };

    const reset = (event: TouchEvent | MouseEvent) => {
        removePassive([refs.scope]);
        removePassive([...refs.areas.keys()]);
        removeActive([refs.item]);
        removeActive([refs.target]);
        removeActive([refs.scope]);

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
    const onDrag = (event: TouchEvent | MouseEvent) => {
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
        const nextTarget = refs.areas.has(targetByXY as Element) ? targetByXY : null;
        if (nextTarget !== refs.target) {
            removeActive([refs.target]);
            dispatch(refs.target, {
                type: EVENT_TYPE.DPL,
                refs,
                keys,
                event
            });
            if (nextTarget && refs.areas.has(nextTarget)) setActive([nextTarget]);
            refs.target = nextTarget;
            keys.target = refs.target?.getAttribute(ATTRS.target) || '';
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
            if (scopeRect.left <= eventX && scopeRect?.right >= eventX && scopeRect.top <= eventY && scopeRect?.bottom >= eventY) {
                removeActive([refs.scope]);
            } else {
                setActive([refs.scope]);
            }
        }
        setX(refs.item, xval);
        setY(refs.item, yval);
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
        reset(event);
    };

    /**
     * Drag start handler
     * @param event
     */
    const onDragStart = (event: MouseEvent | TouchEvent) => {
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
        refs.scope = resolveScope();
        refs.areas = resolveAreas();
        keys.item = refs.item?.getAttribute(ATTRS.item) || '';
        keys.scope = refs.scope?.getAttribute(ATTRS.scope) || '';
        keys.areas = new Set(refs.areas?.keys().map(area => area.getAttribute(ATTRS.target) || ''));

        if (!refs.item) return;
        event[PREV_DEF]?.();
        event[STOP_PROP]();
        scopeRect = refs.scope[GET_RECT]();
        const itemRect = refs.item[GET_RECT]();

        const getProp = (val: string) => refs.item?.[ST][GET_PROP](val);
        const currentOffsetX = Number.parseInt(getProp(X) || '0');
        const currentOffsetY = Number.parseInt(getProp(Y) || '0');

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

        setActive([refs.item]);
        setPassive([refs.scope]);
        setPassive([...refs.areas])
        const docListen = document[ADD_EL];
        if (event.type === TOUCH_START) {
            docListen(TOUCH_MOVE, onDrag, {passive: false});
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
    if (event !== MOUSE) triggerListen(TOUCH_START, onDragStart, {passive: false});
    return () => {
        const triggerRemove = trigger[REM_EL];
        triggerRemove(MOUSE_DOWN, onDragStart);
        triggerRemove(TOUCH_START, onDragStart);
    };
};

const OUTLINE_CSS = propVal('outline', rem(0.25) + ' dashed ' + color());

type TDynamicAttrs = Partial<{
    /**
     * Active DnD item styles
     */
    activeItem: string;
    /**
     * Passive DnD target styles
     */
    passiveTarget: string;
    /**
     * Active DnD target styles
     */
    activeTarget: string;
    /**
     * Passive DnD scope styles
     */
    passiveScope: string;
    /**
     * Active DnD scope styles
     */
    activeScope: string;
}>;

export type TUseDnD = {
    (transition?: Partial<{
        /**
         * Duration
         */
        dur: string | number;
        /**
         * Delay
         */
        del: string | number;
        /**
         * Transition-timing-function
         */
        tf: string;
    }>, css?: TDynamicAttrs): {
        /**
         * Observe DnD events
         * @param element - HTML element
         * @param callback - event handler
         */
        observe: (callback: EventListenerOrEventListenerObject, element?: HTMLElement) => () => void;
        /**
         * Unobserve DnD events
         * @param element - HTML element
         * @param callback - event handler
         */
        unobserve: (element: HTMLElement, callback: EventListenerOrEventListenerObject) => void;
        /**
         * Use DnD item
         * @param key - item key
         */
        item: (key: string) => object;
        /**
         * Use DnD target
         * @param key - target key
         */
        target: (key: string, group?: string) => object;
        /**
         * Use DnD scope
         * @param key - scope key
         */
        scope: (key?: string) => object;
        /**
         * Use different CSS for DnD elements
         */
        css: (params: TDynamicAttrs) => object;
    };
    customCount?: number;
    stylesheet?: CSSStyleSheet;
}

/**
 * Define drag and drop provider custom element
 */
export const useDnD: TUseDnD = (transition = {}, css = {}) => {
    const {
        dur = 100, del = 0, tf = 'linear'
    } = transition;
    const {
        activeItem = 'z-index:1000;opacity:0.5;',
        passiveTarget = propVal('box-shadow', space(color(), ZERO, rem(1.25), rem(2), ZERO, ',', color(3), ZERO, rem(1), rem(0.75), ZERO)),
        activeTarget = OUTLINE_CSS,
        passiveScope = OUTLINE_CSS,
        activeScope = propVal('filter', 'grayscale(100%)'),
    } = css;
    const custom = globalThis.customElements;
    const doc = globalThis.document;
    const getDynamic = ({
        activeItem,
        passiveTarget,
        activeTarget,
        passiveScope,
        activeScope
    }: TDynamicAttrs = {}, selectorPrefix: string = '') => {
        return [
            // active item
            activeItem ? rule(
                selectorPrefix + attrExp(ATTRS.item) + attrExp(ATTRS.active),
                activeItem +
                propVal(POSITION, RELATIVE) +
                'pointer-events:none;touch-events:none'
            ) : '',
            // passive target
            passiveTarget ? rule(
                selectorPrefix + attrExp(ATTRS.target) + attrExp(ATTRS.passive),
                passiveTarget
            ) : '',
            // active target
            activeTarget ? rule(
                selectorPrefix + attrExp(ATTRS.target) + attrExp(ATTRS.active),
                activeTarget
            ) : '',
            // passive scope
            passiveScope ? rule(
                selectorPrefix + attrExp(ATTRS.scope) + attrExp(ATTRS.passive),
                passiveScope
            ) : '',
            // active scope
            activeScope ? rule(
                selectorPrefix + attrExp(ATTRS.scope) + attrExp(ATTRS.active),
                activeScope
            ) : ''
        ].join('');
    }
    if (custom && !custom?.get(TAG_NAME)) {
        custom.define(TAG_NAME, class Trigger extends HTMLElement  {
            unsubscribe: () => void;

            get dndItem(): HTMLElement {
                return this.closest(attrExp(ATTRS.item)) || this;
            }

            get dndX(): number {
                return Number.parseInt(this.dndItem?.[ST][GET_PROP](X)) || 0;
            }

            get dndY(): number {
                return Number.parseInt(this.dndItem?.[ST][GET_PROP](Y)) || 0;
            }

            get dndScope(): HTMLElement {
                const scopeName = this[GET_ATTR]('scope');
                let scope = scopeName !== null && this.closest(attrExp(ATTRS.scope, scopeName)) as HTMLElement;
                return scope || document.body;
            }

            get dndTargets(): Set<Element> {
                const target = this[GET_ATTR]('target');
                return new Set(this.dndScope.querySelectorAll(`[${ATTRS.target}${target ? `^="${target}-"` : ''}]`));
            }

            /**
             * Reset translate effects
             */
            resetDnD() {
                const item = this.dndItem;
                if (item) {
                    item[ST][SET_PROP](X, ZERO);
                    item[ST][SET_PROP](Y, ZERO);
                }
            }

            connectedCallback() {
                const self = this;
                this.unsubscribe = subscribe(self);
            }

            disconnectedCallback() {
                this.unsubscribe();
            }
        });
        const stylesheet = new CSSStyleSheet();
        stylesheet.replaceSync([
            // body
            rule('body ' + attrExp(ATTRS.passive), propVal(CURSOR, GRABBING)),
            // trigger
            rule(TAG_NAME, propVal(CURSOR, GRAB)),
            // item
            rule(
                attrExp(ATTRS.item),
                propVal(TRANSLATE, space(varExp(X, ZERO), varExp(Y, ZERO))) +
                propVal(TRANSITION, space(TRANSLATE, varExp(DUR, time(dur)), varExp(FUNC, tf), varExp(DEL, time(del))))
            ),
            // dynamic
            getDynamic({
                activeItem,
                passiveTarget,
                activeTarget,
                passiveScope,
                activeScope
            })
        ].join(''));
        doc.adoptedStyleSheets.push(stylesheet);
        useDnD.stylesheet = stylesheet;
    }
    return {
        observe: (callback: EventListenerOrEventListenerObject, element: HTMLElement = doc?.body) => {
            element && observe(element, callback);
            return () => element && unobserve(element, callback);
        },
        unobserve: (element: HTMLElement, callback: EventListenerOrEventListenerObject) => unobserve(element, callback),
        item: (key: string) => attrObj(ATTRS.item, key),
        target: (key: string, group: string = '') => attrObj(ATTRS.target, `${group ? group + '-' : ''}${key}`),
        scope: (key = '') => attrObj(ATTRS.scope, key),
        css: (params: TDynamicAttrs) => {
            if (!useDnD.customCount) useDnD.customCount = 0;
            const nextKey = useDnD.customCount++;
            if (useDnD.stylesheet) useDnD.stylesheet.replaceSync([
                    ...useDnD.stylesheet.cssRules
                ].map(i=> i.cssText).join('') +
                getDynamic(params, attrExp(ATTRS.styles, nextKey))
            );
            return attrObj(ATTRS.styles, nextKey);
        }
    };
};

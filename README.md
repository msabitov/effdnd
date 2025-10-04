<p align="center">
  <a href="https://effdnd.surge.sh">
    <img alt="effdnd" src="https://effnd.tech/effdnd_logo.svg" height="256px" />
  </a>
</p>

<h1 align="center">EffDND</h1>

<div align="center">

[![license](https://badgen.net/static/license/Apache%202.0/blue)](https://gitverse.ru/msabitov/effdnd/content/master/LICENSE)
[![npm latest package](https://badgen.net/npm/v/effdnd)](https://www.npmjs.com/package/effdnd)

</div>

EffDnD is a self-confident Drag and Drop library based only on the browser APIs.

## Some features

-   lightweight
-   zero-dependency
-   framework agnostic
-   touch events support
-   customizable styles

## Links

-   [Docs](https://effnd.tech/dnd/)
-   [Repository](https://gitverse.ru/msabitov/effdnd)
-   [Github mirror](https://github.com/msabitov/effdnd)

## Examples

-   [React](https://stackblitz.com/edit/effdnd-react-vitejs?file=src%2FApp.tsx)
-   [Svelte](https://stackblitz.com/edit/effdnd-svelte-vitejs?file=src%2FApp.svelte)

## Installation

Type in your terminal:

```sh
# npm
npm i effdnd

# pnpm
pnpm add effdnd

# yarn
yarn add effdnd
```

## Quick start

In short, scope is used to limit the area of DnD, target is used as the destination of DnD, item is the element that is being moved. Custom element `effdnd-trigger` will start DnD for closest item. It can be configured via `effdnd-trigger` attributes (see `ITriggerAttrs` interface for details).

Just call `useDnD` function to define `effdnd-trigger` and use its result to create special data-attributes:

```jsx
import { useDnD } from 'effdnd';

const { scope, item, target, css } = useDnD();
// create scope attrs
const scopeAttrs = scope('local');
// create target attrs
const fisrtTargetAttrs = target('first');
// targets can be grouped
const secondTargetAttrs = target('second', 'group');
// create item attrs
const fisrtItemAttrs = item('first');
const secondItemAttrs = item('second');
// you can even set up separate styles for different DnD elements
const separateStyleAttrs = css({
    passiveTarget: 'border: 4px solid grey',
});

export const Component = () => {
    const ref = useRef();
    useEffect(() => {
      // you can observe DnD events
      const unobserve = observe((e) => {
        // DnD event reaction
      }, ref.current);
      // and you can unobserve
      return () => unobserve();
    }, []);
    // just apply ready attrs - and magic happen
    // don't forget to use `<effdnd-trigger>` inside items
    return <div {...scopeAttrs}>
        <div>
            <div {...fisrtTargetAttrs}>...</div>
            <div {...secondTargetAttrs} {...separateStyleAttrs}>...</div>
        </div>
        <div>
            <div {...fisrtItemAttrs}>
                <effdnd-trigger>Trigger #1</effdnd-trigger>
            </div>
            <div {...secondItemAttrs}>
                <effdnd-trigger>Trigger #2</effdnd-trigger>
            </div>
        </div>
    </div>;
}
```

That's all. Enjoy simplicity.

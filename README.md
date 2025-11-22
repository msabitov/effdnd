<p align="center">
  <a href="https://effnd.tech/dnd/">
    <img alt="effdnd" src="https://effnd.tech/dnd/logo.svg" height="256px" />
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

In short, `effdnd` uses two custom web component:
- `effdnd trigger` is triggerring drag-and-drop,
- `effdnd-actor` indicates the areas of the layout that will participate in the drag-and-drop process (play their roles).

The web component `effdnd-actor` can "play" several roles:

- `item` - the item being moved.,
- `target` - the target of the move,
- `scope` - movement boundaries.

To define both web components, simply call the `useDnD` function, and use the results of the call to create an event listeners

```jsx
import { useDnD } from 'effdnd';

// you can pass style parameters to useDnD,
// to override the movement parameters
// (for more information, see the type `TUseDnD`)
const { observe } = useDnD();

export const Component = () => {
    const ref = useRef();
    useEffect(() => {
      // you can subscribe to Drag-and-Drop events
      const unobserve = observe((e) => {
        // the event is being processed here
      }, ref.current);
      // and you can unsubscribe
      return () => unobserve();
    });
    return <effdnd-actor scope='top' ref={ref} >
        <div className="targets-wrapper">
            <effdnd-actor target='target-1'>...</effdnd-actor>
            <effdnd-actor target='target-2'>...</effdnd-actor>
        </div>
        <div id="items-wrapper">
            <effdnd-actor item='item-1'>
                <effdnd-trigger>Trigger #1</effdnd-trigger>
            </effdnd-actor>
            <effdnd-actor item='item-2'>
                <effdnd-trigger>Trigger #2</effdnd-trigger>
            </effdnd-actor>
        </div>
    </effdnd-actor>;
}
```

That's all. Enjoy simplicity.

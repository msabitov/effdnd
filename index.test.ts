import { beforeAll, describe, expect, test } from 'vitest';
import { ITriggerElement, useDnD } from './index';
import { userEvent } from '@vitest/browser/context';

const GROUP = 'group';
const SCOPE = 'local';

describe('UseDnD:', () => {
    let stats = [];
    let trigger1: ITriggerElement;
    let trigger2: ITriggerElement;
    let trigger3: ITriggerElement;
    let trigger6: ITriggerElement;
    let trigger8: ITriggerElement;
    let trigger9: ITriggerElement;
    let trigger11: ITriggerElement;
    let trigger12: ITriggerElement;
    let trigger15: ITriggerElement;
    let trigger16: ITriggerElement;
    beforeAll(() => {
        const { observe} = useDnD();
        window.document.body.innerHTML = `
            <effdnd-actor id="scope-1" scope="${SCOPE}">
                <div class="targets-wrapper">
                    <effdnd-actor id="target-1" class="target" target="${GROUP}-1"></effdnd-actor>
                    <effdnd-actor id="target-2" class="target" target="${GROUP}-2"></effdnd-actor>
                    <effdnd-actor id="target-3" class="target" target="3"></effdnd-actor>
                </div>
                <div class="items-wrapper">
                    <effdnd-actor id="item-1" class="item" item="1">
                        <effdnd-trigger id="trigger-1" scope="#" class="trigger" del="25">
                            <span>TR</span>
                        </effdnd-trigger>
                    </effdnd-actor>
                    <effdnd-actor id="item-2" class="item" item="2">
                        <effdnd-trigger id="trigger-2" scope="${SCOPE}" class="trigger"></effdnd-trigger>
                    </effdnd-actor>
                    <effdnd-actor id="item-3" class="item" item="3" item-mode="keep">
                        <effdnd-trigger id="trigger-3" target="${GROUP}" scope class="trigger"></effdnd-trigger>
                    </effdnd-actor>
                    <effdnd-actor id="item-4" class="item" item="4">
                        <effdnd-trigger id="trigger-4" target="${GROUP}-1" class="trigger"></effdnd-trigger>
                    </effdnd-actor>
                    <effdnd-actor id="item-5" class="item" item="5" item-mode="clone">
                        <effdnd-trigger id="trigger-5" target="${GROUP}-1" class="trigger" dur="0" btn="0"></effdnd-trigger>
                    </effdnd-actor>
                </div>
            </effdnd-actor>
            <effdnd-actor id="scope-2">
                <div class="targets-wrapper">
                    <effdnd-actor id="target-4" target="4" class="target"></effdnd-actor>
                    <effdnd-actor id="target-cont-5" target="5" contents>
                        <div class="target-contents"></div>
                    </effdnd-actor>
                </div>
                <div class="items-wrapper">
                    <effdnd-actor scope="order-y" scope-mode="order-y" scope-dur="200">
                        <effdnd-actor id="item-6" class="item" item="6">
                            # 6 item
                            <effdnd-trigger id="trigger-6" class="trigger" axis="y"></effdnd-trigger>
                        </effdnd-actor>
                        <effdnd-actor id="item-7" class="item" item="7">
                            # 7 item 
                            <effdnd-trigger id="trigger-7" class="trigger" axis="y"></effdnd-trigger>
                        </effdnd-actor>
                        <effdnd-actor id="item-8" class="item" item="8">
                            # 8 item
                            <effdnd-trigger id="trigger-8" class="trigger" axis="y"></effdnd-trigger>
                        </effdnd-actor>
                    </effdnd-actor>
                </div>
            </effdnd-actor>
            <div class="items-wrapper-x">
                <effdnd-actor scope="order-x" scope-mode="order-x" class="reorder-x">
                    <effdnd-actor id="item-9" class="item" item="6">
                        # 9 item
                        <effdnd-trigger id="trigger-9" class="trigger" tf="ease-in" axis="x"></effdnd-trigger>
                    </effdnd-actor>
                    <effdnd-actor id="item-10" class="item" item="10">
                        # 10 item 
                        <effdnd-trigger id="trigger-10" class="trigger" tf="ease-in" axis="x"></effdnd-trigger>
                    </effdnd-actor>
                    <effdnd-actor id="item-11" class="item" item="11">
                        # 11 item
                        <effdnd-trigger id="trigger-11" class="trigger" tf="ease-in" axis="x"></effdnd-trigger>
                    </effdnd-actor>
                </effdnd-actor>
            </div>
            <div class="transfer">
                <effdnd-actor target="transfer" target-mode="append" class="transfer-1">
                    <effdnd-actor id="item-12" class="item" item="12">
                        # 12 item
                        <effdnd-trigger id="trigger-12" class="trigger" target="transfer"></effdnd-trigger>
                    </effdnd-actor>
                    <effdnd-actor id="item-13" class="item" item="13">
                        # 13 item 
                        <effdnd-trigger id="trigger-13" class="trigger" target="transfer"></effdnd-trigger>
                    </effdnd-actor>
                    <effdnd-actor id="item-14" class="item" item="14">
                        # 14 item
                        <effdnd-trigger id="trigger-14" class="trigger" target="transfer"></effdnd-trigger>
                    </effdnd-actor>
                </effdnd-actor>
                <effdnd-actor target="transfer" target-mode="prepend" class="transfer-2">
                    <effdnd-actor id="item-15" class="item" item="15">
                        # 15 item
                        <effdnd-trigger id="trigger-15" class="trigger" target="transfer"></effdnd-trigger>
                    </effdnd-actor>
                    <effdnd-actor id="item-16" class="item" item="16">
                        # 16 item 
                        <effdnd-trigger id="trigger-16" class="trigger" target="transfer"></effdnd-trigger>
                    </effdnd-actor>
                    <effdnd-actor id="item-17" class="item" item="17">
                        # 17 item
                        <effdnd-trigger id="trigger-17" class="trigger" target="transfer"></effdnd-trigger>
                    </effdnd-actor>
                </effdnd-actor>
                <effdnd-actor target="transfer" target-mode="remove" class="transfer-3">Remove</effdnd-actor>
            </div>
            <style>
                #scope-1 {
                    width:400px;
                    height:200px;
                    display:flex;
                    background: grey;
                }
                #scope-2 {
                    width:400px;
                    height:200px;
                    display:flex;
                    background: #574c4c;

                    .items-wrapper {
                        background: grey;
                        border: 2px solid black;
                    }
                }
                .items-wrapper-x {
                    width:400px;
                }
                .reorder-x {
                    display: flex;
                    width: 100%;
                    padding: 16px 0;
                    & > .item {
                        flex-basis: 30%;
                        margin-right: 12px;
                        margin-top: 0;
                    }
                }
                .targets-wrapper, .items-wrapper {
                    flex-basis: 40%;
                    flex-grow: 0;
                    flex-shrink: 0;
                    display: flex;
                    flex-direction: column;
                    padding: 10px;
                }
                .target, .target-contents {
                    width: 100%;
                    height: 20px;
                    background: white;
                    margin-top: 10px;
                }
                .transfer {
                    width: 100%;
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: space-between;

                    & > * {
                        flex-basis: 40%;
                        border: 2px solid black;
                    }

                    .transfer-3 {
                        flex-basis: 100%;
                        background: red;
                        padding: 0.5rem;
                        margin-top: 1rem;
                    }
                }
                .item {
                    width: 100%;
                    height: 20px;
                    background: green;
                    margin-top: 10px;
                    display: flex;
                    justify-content: space-between;
                }
                .trigger {
                    display: block;
                    width: 20px;
                    height: 20px;
                    margin-left: auto;
                }
                #target-4 {
                    width: 80%;
                    margin: 10px;
                }
            </style>
        `;
        const unobserve = observe((event) => {
            stats.push(event);
        });
        trigger1 = document.getElementById('trigger-1') as ITriggerElement;
        trigger2 = document.getElementById('trigger-2') as ITriggerElement;
        trigger3 = document.getElementById('trigger-3') as ITriggerElement;
        trigger6 = document.getElementById('trigger-6') as ITriggerElement;
        trigger8 = document.getElementById('trigger-8') as ITriggerElement;
        trigger9 = document.getElementById('trigger-9') as ITriggerElement;
        trigger11 = document.getElementById('trigger-11') as ITriggerElement;
        trigger12 = document.getElementById('trigger-12') as ITriggerElement;
        trigger15 = document.getElementById('trigger-15') as ITriggerElement;
        trigger16 = document.getElementById('trigger-16') as ITriggerElement;
        return () => {
            unobserve();
            stats = [];
        }
    });

    describe('trigger fields:', () => {
        test('trigger.dndItem:', async () => {
            const item = trigger1?.dndItem;
            expect(item).toBe(document.getElementById('item-1'));
        });

        test('trigger.dndScope (global):', async () => {
            const scope = trigger1?.dndScope;
            expect(scope).toBe(document.body);
        });

        test('trigger.dndScope (local):', async () => {
            const scope = trigger2?.dndScope;
            expect(scope).toBe(document.getElementById('scope-1'));
        });

        test('trigger.dndTargets (default):', async () => {
            const targets = trigger1?.dndTargets;
            expect(targets).toEqual(new Set(document.querySelectorAll('effdnd-actor[target]')));
        });

        test('trigger.dndTargets (scoped):', async () => {
            const targets = trigger2?.dndTargets;
            expect(targets).toEqual(new Set(document.querySelector('.targets-wrapper')?.children));
        });

        test('trigger.dndTargets (scoped group):', async () => {
            const targets = trigger3?.dndTargets;
            expect(targets).toEqual(new Set([document.getElementById('target-1'), document.getElementById('target-2')]));
        });
    });

    describe('drag and drop:', () => {
        test('simple', async () => {
            const target = document.getElementById('target-3') as Element;
            await userEvent.dragAndDrop(trigger1, target);
            const targetRect = target.getBoundingClientRect();
            const triggerRect = trigger1.getBoundingClientRect();
            const xOffset = -190;
            const yOffset = 60;
            expect(
                triggerRect.bottom + xOffset <= targetRect.bottom &&
                triggerRect.top + yOffset >= targetRect.top &&
                triggerRect.right + xOffset <= targetRect.right &&
                triggerRect.left + yOffset >= targetRect.left
            ).toBeTruthy();
        });

        test('scope constraints', async () => {
            const target = document.getElementById('target-4') as Element;;
            await userEvent.dragAndDrop(trigger2, target);
            const scopeRect = trigger2.dndScope.getBoundingClientRect();
            const triggerRect = trigger2.getBoundingClientRect();
            expect(
                triggerRect.bottom <= scopeRect.bottom &&
                triggerRect.top >= scopeRect.top &&
                triggerRect.right <= scopeRect.right &&
                triggerRect.left >= scopeRect.left
            ).toBeTruthy();
        });

        test('reset', async () => {
            const target = document.getElementById('target-1') as Element;
            await userEvent.dragAndDrop(trigger3, target);
            trigger3.resetDnD();
            expect(
                trigger3.dndX === 0 &&
                trigger3.dndY === 0
            ).toBeTruthy();
        });

        test('reorder y to the last', async () => {
            const target = document.getElementById('item-8') as Element;
            const scope = trigger6.dndScope;
            const item = trigger6.dndItem;
            await userEvent.dragAndDrop(trigger6, target);
            expect(
                [...scope.children].indexOf(item)
            ).toBe(2);
        });

        test('reorder y to the first', async () => {
            const target = document.getElementById('item-7') as Element;
            const scope = trigger8.dndScope;
            const item = trigger8.dndItem;
            await userEvent.dragAndDrop(trigger8, target);
            expect(
                [...scope.children].indexOf(item)
            ).toBe(0);
        });
        
        test('reorder x to the last', async () => {
            const target = document.getElementById('item-11') as Element;
            const scope = trigger9.dndScope;
            const item = trigger9.dndItem;
            await userEvent.dragAndDrop(trigger9, target);
            expect(
                [...scope.children].indexOf(item)
            ).toBe(2);
        });

        test('reorder x to the first', async () => {
            const target = document.getElementById('item-10') as Element;
            const scope = trigger11.dndScope;
            const item = trigger11.dndItem;
            await userEvent.dragAndDrop(trigger11, target);
            expect(
                [...scope.children].indexOf(item)
            ).toBe(0);
        });

        test('transfer with prepend', async () => {
            const target = document.querySelector('.transfer-2') as Element;
            const item = trigger12.dndItem;
            await userEvent.dragAndDrop(trigger12, target);
            expect(
                [...target.children].indexOf(item)
            ).toBe(0);
        });

        test('transfer with append', async () => {
            const target = document.querySelector('.transfer-1') as Element;
            const item = trigger15.dndItem;
            await userEvent.dragAndDrop(trigger15, target);
            expect(
                [...target.children].indexOf(item)
            ).toBe(2);
        });

        test('transfer with remove', async () => {
            const target = document.querySelector('.transfer-3') as Element;
            const item = trigger16.dndItem;
            const parent = item.parentElement;
            await userEvent.dragAndDrop(trigger16, target);
            expect(
                parent && [...parent.children].indexOf(item)
            ).toBe(-1);
        });
    });

    describe('style:', () => {
        test('contents', async () => {
            const target = document.getElementById('target-cont-5');
            expect(target && getComputedStyle(target).display).toEqual('contents');
        });
    });
});

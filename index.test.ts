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
                        <effdnd-trigger id="trigger-1" scope="#" class="trigger" dur="0"></effdnd-trigger>
                    </effdnd-actor>
                    <effdnd-actor id="item-2" class="item" item="2">
                        <effdnd-trigger id="trigger-2" scope="${SCOPE}" class="trigger" dur="0"></effdnd-trigger>
                    </effdnd-actor>
                    <effdnd-actor id="item-3" class="item" item="3">
                        <effdnd-trigger id="trigger-3" target="${GROUP}" scope class="trigger" dur="0"></effdnd-trigger>
                    </effdnd-actor>
                    <effdnd-actor id="item-4" class="item" item="3">
                        <effdnd-trigger id="trigger-4" target="${GROUP}-1" class="trigger" dur="0"></effdnd-trigger>
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
                <div class="items-wrapper"></div>
            </effdnd-actor>
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
                    flex-direction:column;
                    background: #574c4c;
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
                .item {
                    width: 100%;
                    height: 20px;
                    background: green;
                    margin-top: 10px;
                }
                .trigger {
                    display: block;
                    width: 20px;
                    height: 20px;
                    background: black;
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
            expect(targets).toEqual(new Set(document.querySelectorAll('.target,#target-cont-5')));
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
            await trigger3.resetDnD();
            expect(
                trigger3.dndX === 0 &&
                trigger3.dndY === 0
            ).toBeTruthy();
        });
    });

    describe('style:', () => {
        test('contents', async () => {
            const target = document.getElementById('target-cont-5');
            expect(target && getComputedStyle(target).display).toEqual('contents');
        });
    });
});

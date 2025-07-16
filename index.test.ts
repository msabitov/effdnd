import { beforeAll, describe, expect, test } from 'vitest';
import { useDnD } from './index';
import { userEvent } from '@vitest/browser/context';

const GROUP = 'group';
const SCOPE = 'local';

describe('UseDnD:', () => {
    let stats = [];
    let trigger1: HTMLElement;
    let trigger2: HTMLElement;
    let trigger3: HTMLElement;
    beforeAll(() => {
        const { item, scope, target, observe} = useDnD({
            dur: 0,
            del: 0
        });
        const firstTarget = target('1', GROUP);
        const secondTarget = target('2', GROUP);
        const thirdTarget = target('3');
        const fourthTarget = target('4');
        const firstItem = item('1');
        const secondItem = item('2');
        const thirdItem = item('3');
        const localScope = scope(SCOPE);
        window.document.body.innerHTML = `
            <div id="scope-1" ${localScope}>
                <div id="targets-wrapper">
                    <div id="target-1" class="target" ${firstTarget}></div>
                    <div id="target-2" class="target" ${secondTarget}></div>
                    <div id="target-3" class="target" ${thirdTarget}></div>
                </div>
                <div id="items-wrapper">
                    <div id="item-1" class="item" ${firstItem}>
                        <effdnd-trigger id="trigger-1" class="trigger"></effdnd-trigger>
                    </div>
                    <div id="item-2" class="item" ${secondItem}>
                        <effdnd-trigger id="trigger-2" scope="${SCOPE}" class="trigger"></effdnd-trigger>
                    </div>
                    <div id="item-3" class="item" ${thirdItem}>
                        <effdnd-trigger id="trigger-3" target="${GROUP}" scope="${SCOPE}" class="trigger"></effdnd-trigger>
                    </div>
                </div>
            </div>
            <div id="scope-2">
                <div id="target-4" class="target" ${fourthTarget}></div>
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
                }
                #targets-wrapper, #items-wrapper {
                    flex-basis: 40%;
                    display: flex;
                    flex-direction: column;
                    padding: 10px;
                }
                .target {
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
        trigger1 = document.getElementById('trigger-1');
        trigger2 = document.getElementById('trigger-2')
        trigger3 = document.getElementById('trigger-3')
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
            expect(targets).toEqual(new Set(document.querySelectorAll('.target')));
        });

        test('trigger.dndTargets (scoped):', async () => {
            const targets = trigger2?.dndTargets;
            expect(targets).toEqual(new Set(document.getElementById('targets-wrapper')?.children));
        });

        test('trigger.dndTargets (scoped group):', async () => {
            const targets = trigger3?.dndTargets;
            expect(targets).toEqual(new Set([document.getElementById('target-1'), document.getElementById('target-2')]));
        });
    });

    describe('drag and drop:', () => {
        test('simple', async () => {
            const target = document.getElementById('target-3');
            await userEvent.dragAndDrop(trigger1, target);
            const targetRect = target.getBoundingClientRect();
            const triggerRect = trigger1.getBoundingClientRect();
            expect(
                triggerRect.bottom <= targetRect.bottom &&
                triggerRect.top >= targetRect.top &&
                triggerRect.right <= targetRect.right &&
                triggerRect.left >= targetRect.left
            ).toBeTruthy();
        });

        test('scope constraints', async () => {
            const target = document.getElementById('target-4');
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
            const target = document.getElementById('target-1');
            await userEvent.dragAndDrop(trigger3, target);
            trigger3.resetDnD();
            expect(
                trigger3.dndX === 0 &&
                trigger3.dndY === 0
            ).toBeTruthy();
        });
    });
});

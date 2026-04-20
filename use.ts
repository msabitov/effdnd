import { useDnD } from './index';

declare global {
    interface Window {
        effdnd: ReturnType<typeof useDnD>;
    }
};

window.effdnd = useDnD();

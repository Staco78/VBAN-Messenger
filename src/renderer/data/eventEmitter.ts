export default class EventEmitter {
    private listeners: {
        [key: string]: Function[];
    } = {};

    on(event: string, listener: Function) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(listener);
    }

    emit(event: string, ...args: any[]) {
        if (!this.listeners[event]) return;

        this.listeners[event].forEach(listener => {
            listener.apply(this, args);
        });
    }
}

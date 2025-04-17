declare module 'event-source-polyfill' {
  interface EventSourceInit {
    headers?: Record<string, string>;
    withCredentials?: boolean;
  }

  export class EventSourcePolyfill {
    constructor(url: string, eventSourceInitDict?: EventSourceInit);
    onopen: ((this: EventSource, ev: Event) => any) | null;
    onmessage: ((this: EventSource, ev: MessageEvent) => any) | null;
    onerror: ((this: EventSource, ev: Event) => any) | null;
    readyState: number;
    url: string;
    close: () => void;
    readonly CONNECTING: 0;
    readonly OPEN: 1;
    readonly CLOSED: 2;
    addEventListener: (type: string, listener: EventListener) => void;
    removeEventListener: (type: string, listener: EventListener) => void;
    dispatchEvent: (event: Event) => boolean;
  }
}
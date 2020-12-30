// import { h } from '@stencil/core';

interface ListenerProps {
  entries: IntersectionObserverEntry[];
  observer: IntersectionObserver;
  visible: HTMLElement[];
}
type Listener = (props: ListenerProps) => void;

const listeners: Listener[] = [];

const visible: HTMLElement[] = [];

export const observer = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((e) => {
      if (e.intersectionRatio > 0) {
        if (visible.indexOf(e.target as HTMLElement) < 0) {
          visible.push(e.target as HTMLElement);
        }
      } else {
        visible.splice(visible.indexOf(e.target as HTMLElement), 1);
      }
    });

    listeners.forEach((l) => l({ entries, observer, visible }));
  },
  { threshold: [0, 1] },
);

export const addListener = (listener: Listener) => listeners.push(listener);

export const removeListener = (listener: Listener) => listeners.splice(listeners.indexOf(listener), 1);

export const observe = (el: HTMLElement) => el && observer.observe(el);

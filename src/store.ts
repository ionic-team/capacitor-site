import { createStore } from "@stencil/store";

export interface State {
  isLeftSidebarIn: boolean;
  pageTheme: 'light' | 'dark';
  prismLanguagesLoaded: any;
}

const { state } = createStore({
  isLeftSidebarIn: false,
  pageTheme: 'light',
  prismLanguagesLoaded: {
  }
} as State);

export default state;
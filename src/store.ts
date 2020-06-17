import { createStore } from "@stencil/store";

export interface State {
  isLeftSidebarIn: boolean;
  showTopBar: boolean;
  pageTheme: 'light' | 'dark';
  prismLanguagesLoaded: any;
}

const { state } = createStore({
  isLeftSidebarIn: false,
  showTopBar: true,
  pageTheme: 'light',
  prismLanguagesLoaded: {
  }
} as State);

export default state;
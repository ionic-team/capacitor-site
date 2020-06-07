import { createStore } from "@stencil/store";

export interface State {
  isLeftSidebarIn: boolean;
  pageTheme: 'light' | 'dark'
}

const { state } = createStore({
  isLeftSidebarIn: false,
  pageTheme: 'light'
} as State);

export default state;
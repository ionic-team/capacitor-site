import { createStore } from '@stencil/store';

export interface State {
  isLeftSidebarIn: boolean;
  showTopBar: boolean;
  pageData: any;
  pageTheme: 'light' | 'dark';
  prismLanguagesLoaded: any;
}

const { state } = createStore({
  isLeftSidebarIn: false,
  showTopBar: true,
  pageData: {},
  pageTheme: 'light',
  prismLanguagesLoaded: {
  }
} as State);

export default state;
import { createStore } from "@stencil/store";

const { state } = createStore({
  isLeftSidebarIn: false
});

export default state;
declare module "*.svg" {
  const content: any;
  export default content;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'ion-item': any;
    }
  }
}
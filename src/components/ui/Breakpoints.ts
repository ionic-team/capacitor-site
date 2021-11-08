// Breakpoints
// https://css-tricks.com/snippets/css/media-queries-for-standard-devices/

// Lowest supported Resolution is 360px wide of Samsung Galaxy

interface BreakpointType {
  screenXs: string;
  screenXsMin: string;
  screenPhone: string;

  screenSm: string;
  screenSmMin: string;
  screenTablet: string;

  screenMd: string;
  screenMdMin: string;
  screenDesktop: string;

  screenLg: string;
  screenLgMin: string;
  screenLgDesktop: string;

  screenXl: string;
  screenXlMin: string;
  screenXlDesktop: string;

  screenXsMax: string;
  screenSmMax: string;
  screenMdMax: string;
  screenLgMax: string;
}

let Breakpoints: Partial<BreakpointType> = {
  screenXs: '640px',
  screenXsMin: '0px',
  screenPhone: '480px',

  screenSm: '768px',
  screenSmMin: '768px',
  screenTablet: '576px',

  screenMd: '1024px',
  screenMdMin: '1024px',
  screenDesktop: '768px',

  screenLg: '1216px',
  screenLgMin: '1024px',
  screenLgDesktop: '1024px',

  screenXl: '1216px',
  screenXlMin: '1216px',
  screenXlDesktop: '1216px',
};

Breakpoints = {
  ...Breakpoints,

  // So media queries don't overlap when required, provide a maximum
  screenXsMax: `${parseInt(Breakpoints['screenSmMin']) - 1}px`,
  screenSmMax: `${parseInt(Breakpoints['screenMdMin']) - 1}px`,
  screenMdMax: `${parseInt(Breakpoints['screenLgMin']) - 1}px`,
  screenLgMax: `${parseInt(Breakpoints['screenXlMin']) - 1}px`,
};

export const BREAKPOINT_COUNT = 5;

export default Breakpoints;

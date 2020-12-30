declare var window: any;

export function createScript({ property, src, id }: any) {
  if (!window) {
    return;
  }
  (function (src, id) {
    var js,
      fjs = document.getElementsByTagName('script')[0],
      t = (window[property] as any) || {};
    if (document.getElementById(id)) {
      return t;
    }
    js = document.createElement('script');
    js.id = id;
    js.src = src;
    fjs.parentNode!.insertBefore(js, fjs);
    t._e = [];
    t.ready = function (f: any) {
      t._e.push(f);
    };
    return t;
  })(src, id);
}

export const embeds = {
  Twitter: {
    property: 'twttr',
    src: 'https://platform.twitter.com/widgets.js',
    id: 'twitter-wjs',
    load: function () {
      if (window && window.twttr) {
        window.twttr.widgets.load();
      }
    },
  },
  Facebook: {
    property: 'FB',
    src: 'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v3.3',
    id: 'fb-wjs',
    load: (ref: any) => {
      if (window && window.FB) {
        window.FB.XFBML.parse(ref);
      }
    },
  },
  Instagram: {
    property: 'instgrm',
    src: 'https://www.instagram.com/embed.js',
    id: 'insta-wjs',
    load: () => {
      if (window && window.instgrm) {
        window.instgrm.Embeds.process();
      }
    },
  },
} as any;

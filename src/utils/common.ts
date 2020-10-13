// Given a set of provided props and extra props,
// merge to two except for the class prop which is concated
export const applyProps = (props: any, extra: any = {}) => {
  const allKeys = new Set(Object.keys(props).concat(Object.keys(extra)));
  return Array.from(allKeys).reduce((v, k: string) => {
    if (k in extra) {
      if (k === 'class') {
        v[k] = `${extra[k]} ${props[k] ? props[k] : ''}`;
      } else {
        v[k] = extra[k];
      }
    } else if (k in props) {
      v[k] = props[k];
    }
    return v;
  }, {} as any);
};

export const importResource = (
  { propertyName, link } : { propertyName: string, link: string},
  callback: () => any,
  target: HTMLElement = document.body
) => {
  if (window.hasOwnProperty(propertyName)) return callback();

  
  const scriptAlreadyLoading = Array.from(document.scripts).some(script => {
    if (script.src === link) {
      script.addEventListener('load', callback);
      return true;
    }
  });

  if (scriptAlreadyLoading) return;
  
  const script = document.createElement('script');
  script.src = link;
  script.type = 'text/javascript'
  script.onload = callback;  
  script.onerror = () => console.error(`error loading resource: ${link}`);      

  target.appendChild(script);  
}

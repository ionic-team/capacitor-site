export const importResource = (
  { propertyName, link }: { propertyName: string; link: string },
  callback: () => any,
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
  script.type = 'text/javascript';
  script.setAttribute('async', '');
  script.setAttribute('defer', '');
  script.onload = callback;
  script.onerror = () => console.error(`error loading resource: ${link}`);

  document.body.appendChild(script);
};

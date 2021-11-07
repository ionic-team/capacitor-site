const docsPath = '/docs';
const versionedDocsPath = '/docs/v2';

export const docsVersionHref = (currentPath: string, path: string) => {
  if (
    currentPath.startsWith(versionedDocsPath) &&
    !path.startsWith(versionedDocsPath)
  ) {
    return path.replace(docsPath, versionedDocsPath);
  }
  return path;
};

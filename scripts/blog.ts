import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import frontMatter from 'front-matter';
import marked from 'marked';

export interface RenderedBlog {
  title: string;
  authorName: string;
  authorEmail: string;
  slug: string;
  date: string;
  contents: string;
  html: string;

  // All frontmatter attrs just in casesies
  meta?: any;
}

const BLOG_DIR = 'blog';
const OUTPUT_FILE = 'src/assets/blog.json';

export function slugify(text: string) {
  if (!text) {
    return '';
  }
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/\.+/g, '-') // Replace periods with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
}


async function buildPost(postFile: string): Promise<RenderedBlog> {
  const contents = await fs.promises.readFile(path.join(BLOG_DIR, postFile));

  const data = frontMatter<any>(contents.toString('utf-8'));

  console.log(data);

  const authorString = data.attributes.author as string;

  const emailIndex = authorString.indexOf('<');
  const authorName = authorString.slice(0, emailIndex).trim();
  const authorEmail = authorString.slice(emailIndex + 1, authorString.indexOf('>')).trim();

  const parsedBody = marked(data.body);

  const rendered = {
    title: data.attributes.title,
    authorName,
    authorEmail,
    slug: slugify(data.attributes.title),
    date: (data.attributes.date as Date).toISOString(),
    contents: contents.toString('utf-8'),
    html: parsedBody,
    meta: data.attributes
  } as RenderedBlog;

  console.log(chalk.bold.green(`POST`), rendered.slug);

  return rendered;
}

async function run() {
  const posts = await fs.promises.readdir(BLOG_DIR);

  const rendered = await Promise.all(posts.map(buildPost))

  const sorted = rendered.sort((a: RenderedBlog, b: RenderedBlog) => b.date.localeCompare(a.date));

  await fs.promises.writeFile(OUTPUT_FILE, JSON.stringify(sorted));
}
run();
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import frontMatter from 'front-matter';
import marked from 'marked';
import Prism from 'prismjs';

const loadLanguages = require('prismjs/components/');

loadLanguages(['javascript', 'typescript', 'bash', 'java', 'swift']);

export interface RenderedBlog {
  title: string;
  authorName: string;
  authorEmail: string;
  authorUrl: string;
  slug: string;
  date: string;
  contents: string;
  preview: string;
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

  const slug = slugify(data.attributes.title);

  const authorString = data.attributes.author as string;

  const emailIndex = authorString.indexOf('<');
  const authorName = authorString.slice(0, emailIndex).trim();
  const authorEmail = authorString.slice(emailIndex + 1, authorString.indexOf('>')).trim();
  const authorUrl = data.attributes.authorUrl as string;

  // Use the "more" token system to generate a preview on the index page
  const MORE_TOKEN = '<!--more-->';
  const moreIndex = data.body.indexOf(MORE_TOKEN);
  const postPreview = moreIndex >= 0 ? data.body.slice(0, moreIndex) : '';

  const parsedPreview = marked(postPreview, {
    highlight: (code, lang) => Prism.highlight(code, Prism.languages[lang], lang as any)
  })
  // TODO: could support over vars but for now just replace $POST with the
  // final URL of the post
  .replace(/\$POST/g, `/blog/${slug}`);

  const parsedBody = marked(data.body, {
    highlight: (code, lang) => Prism.highlight(code, Prism.languages[lang], lang as any)
  });

  const rendered = {
    title: data.attributes.title,
    authorName,
    authorEmail,
    authorUrl,
    slug,
    date: (data.attributes.date as Date).toISOString(),
    contents: contents.toString('utf-8'),
    preview: parsedPreview,
    html: parsedBody,
    meta: data.attributes
  } as RenderedBlog;

  return rendered;
}

async function run() {
  const posts = await fs.promises.readdir(BLOG_DIR);

  let rendered;
  try {
    rendered = await Promise.all(posts.map(buildPost))
  } catch (e) {
    console.error('Unable to build blog', e);
    process.exit(1);
  }

  rendered.forEach(r => console.log(chalk.bold.green(`POST`), r.slug));

  const sorted = rendered.sort((a: RenderedBlog, b: RenderedBlog) => b.date.localeCompare(a.date));

  await fs.promises.writeFile(OUTPUT_FILE, JSON.stringify(sorted));
}
run();
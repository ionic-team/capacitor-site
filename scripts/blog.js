"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const front_matter_1 = __importDefault(require("front-matter"));
const marked_1 = __importDefault(require("marked"));
const prismjs_1 = __importDefault(require("prismjs"));
const loadLanguages = require('prismjs/components/');
loadLanguages(['javascript', 'typescript', 'bash', 'java', 'swift']);
const BLOG_DIR = 'blog';
const OUTPUT_FILE = 'src/assets/blog.json';
function slugify(text) {
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
exports.slugify = slugify;
async function buildPost(postFile) {
    const contents = await fs_1.default.promises.readFile(path_1.default.join(BLOG_DIR, postFile));
    const data = front_matter_1.default(contents.toString('utf-8'));
    console.log(data);
    const authorString = data.attributes.author;
    const emailIndex = authorString.indexOf('<');
    const authorName = authorString.slice(0, emailIndex).trim();
    const authorEmail = authorString.slice(emailIndex + 1, authorString.indexOf('>')).trim();
    const parsedBody = marked_1.default(data.body, {
        highlight: (code, lang) => prismjs_1.default.highlight(code, prismjs_1.default.languages[lang], lang)
    });
    const rendered = {
        title: data.attributes.title,
        authorName,
        authorEmail,
        slug: slugify(data.attributes.title),
        date: data.attributes.date.toISOString(),
        contents: contents.toString('utf-8'),
        html: parsedBody,
        meta: data.attributes
    };
    console.log(chalk_1.default.bold.green(`POST`), rendered.slug);
    return rendered;
}
async function run() {
    const posts = await fs_1.default.promises.readdir(BLOG_DIR);
    const rendered = await Promise.all(posts.map(buildPost));
    const sorted = rendered.sort((a, b) => b.date.localeCompare(a.date));
    await fs_1.default.promises.writeFile(OUTPUT_FILE, JSON.stringify(sorted));
}
run();

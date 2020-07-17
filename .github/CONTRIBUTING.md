# Contributing

The Capacitor website (`capacitor-site/`) and documentation (`capacitor-site/docs`) live alongside the code. Looking to assist? See Capacitor issues labeled "docs" [here](https://github.com/ionic-team/capacitor/issues?q=is%3Aopen+is%3Aissue+label%3Adocs).

## Setup

1. Fork this repo.
1. Clone your fork.
1. Make a branch for your change.
1. Run `npm install`.
1. Run `npm start` to build and deploy the website/docs to localhost.

> Note: Content updated while the dev server is running won't be reflected locally. Stop the process, run `npm run site-structure`, then re-run `npm start`.

## Adding a new page to the sidebar

### Docs

- Navigate to `capacitor-site/docs/`
- For the Guide menu, add to `capacitor-site/docs/guide/README.md`
- For the Reference menu, add to `capacitor-site/docs/reference/README.md`

## Modifying documentation

For smaller edits, navigate to the desired page in the [Capacitor docs](https://capacitorjs.com/docs/) then click the "Submit an edit" button.

1. Locate the doc you want to modify in `capacitor-site/docs/`.
1. Modify the documentation, making sure to keep the format the same as the rest of the doc.
1. Run `npm run site-structure` to rebuild the content.
1. Run `npm start` to make sure your changes look correct.

# syndesis.io website

## Building

### Prerequisites
* Install NodeJS
* Install `yarn`: `curl -o- -L https://yarnpkg.com/install.sh | bash`
* Install `gulp` globally: `yarn global add gulp-cli`
* Install `hugo` (see http://gohugo.io/overview/installing/)
* Run `yarn`

### Previewing
Run `gulp` and open your browser at http://localhost:1313/syndesis.io.

### Building
Run `gulp build` to build site into `docs` directory, which GitHub will serve from.

## Publishing
`gulp build && git add -A . && git push`

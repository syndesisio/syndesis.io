# syndesis.io website

## Building

### Prerequisites
* Install NodeJS
* Install `yarn`: `curl -o- -L https://yarnpkg.com/install.sh | bash`
* Add yarn's binary directory to your path: `export PATH=${PATH}:$(yarn global bin)`
* Install `gulp` globally: `yarn global add gulp-cli`
* Install `hugo` (see http://gohugo.io/overview/installing/)
* Run `yarn`

### Previewing
Run `gulp` and open your browser at http://localhost:1313.

### Building
Run `gulp build` to build site into `public` directory, which will be pushed to gh-pages branch on github.

## Publishing
`./publish-to-gh-pages.sh`

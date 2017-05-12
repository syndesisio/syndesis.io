# syndesis.io website

## Building

### Prerequisites
* Install NodeJS
* Install `yarn`: `curl -o- -L https://yarnpkg.com/install.sh | bash`
  * macOS and Homebrew users: `brew install yarn`
* Add yarn's binary directory to your path in your `.bashrc` or `.bash_profile`: `export PATH=${PATH}:$(yarn global bin)`
* Install `gulp` globally: `yarn global add gulp-cli`
* Install `hugo` (see http://gohugo.io/overview/installing/)
* Run `yarn`

### Previewing
Run `gulp` and open your browser at http://localhost:1313.

### Building
Run `gulp build` to build site into `public` directory.

## Publishing

To set up on your own fork for the first time:

1. Fork this repo.
2. Clone to your machine: `$ git clone git@github.com:<USERNAME>/syndesis.io.git`
2. Make sure that your GitHub repo settings for the branch and directory of your GitHub pages is set to `master/gh-pages`.
3. Run the following:

```
$ cd syndesis.io
$ git checkout --orphan gh-pages
$ git rm -rf .
$ rm '.gitignore'
$ git commit -a -m "Setting up gh-pages branch"
$ git push origin gh-pages
$ git checkout master
$ ./publish-to-gh-pages.sh
```

Your published fork should now be running at https://<USERNAME>.github.io/syndesis.io/.

### Publishing Each Time After Setup
From the `master` branch, or any branch other than `gh-pages`, first update your local fork:

```
$ gulp build && git add -A . && git push
```

Then publish to GitHub pages with:

`$ ./publish-to-gh-pages.sh`

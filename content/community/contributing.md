---
bref: ""
date: 2017-05-19T14:40:12+01:00
draft: false
menu:
  sidenav:
    name: Contributing
    weight: -400
    parent: Community
sidebar: sidenav
title: "Contributing to Syndesis"
toc: true
weight: 20
---

There are many ways to contribute to Syndesis. All contributions are valued and welcomed, be it [fixing a typo in documentation]({{< relref "#improving-documentation" >}}), raising an issue to report a bug, or creating a whole new awesome feature. Don't worry if this is your first contribution to an open source project: the Syndesis maintainers can help you if you need it.

## Improving documentation

Documentation is in various places in our repositories. We are committed to streamlining this, but for now there are a few different places to look.

### Website documentation

Each page on the website has a `Refine this page` link in the left sidenav. Clicking this will take you through to the GitHub UI to edit the page, commit, and send a pull request. Simples!

For more extensive changes, you can follow the [`Submitting a Pull Request`]({{< relref "#submitting-a-pull-request" >}}) details below for the https://github.com/syndesisio/syndesis.io repository.

### Project documentation

Updating the documentation in a project should be treated just like updating code so please follow the [`Submitting a Pull Request`]({{< relref "#submitting-a-pull-request" >}}) details below for the relevant repository.

## Submitting a Pull Request

The following are the general steps you should follow in creating a pull request.  Subsequent pull requests only need
to follow step 3 and beyond:

1. Fork the repository on GitHub
2. Clone the forked repository to your machine
3. Create a "feature" branch in your local repository
4. Make your changes and commit them to your local repository
5. Rebase and push your commits to your GitHub remote fork/repository
6. Issue a Pull Request to the official repository
7. Your Pull Request is reviewed by a committer and merged into the repository

*Note*: While there are other ways to accomplish the steps using other tools, the examples here will assume the most
actions will be performed via the `git` command line.

### 1. Fork the Repository

When logged in to your GitHub account, and you are viewing one of the main repositories, you will see the *Fork* button.
Clicking this button will show you which organizations your can fork to.  Choose your own account.  Once the process
finishes, you will have your own repository that is "forked" from the official one.

Forking is a GitHub term and not a git term.  Git is a wholly distributed source control system and simply worries
about local and remote repositories and allows you to manage your code against them.  GitHub then adds this additional
layer of structure of how repositories can relate to each other.

### 2. Clone the Forked Repository

Once you have successfully forked your repository, you will need to clone it locally to your machine:

```bash
$ git clone git@github.com:username/syndesis-ui.git
```

This will clone your fork to your current path in a directory named `syndesis-ui`.

You should also set up the `upstream` repository.  This will allow you to take changes from the "master" repository
and merge them into your local clone and then push them to your GitHub fork:

```bash
$ cd syndesis-ui
$ git remote add upstream git@github.com:syndesisio/syndesis-ui.git
$ git fetch upstream
```

Then you can retrieve upstream changes and rebase on them into your code like this:

```bash
$ git pull --rebase upstream master
```

For more information on maintaining a fork, please see the GitHub Help article [Fork a Repo](https://help.github.com/articles/fork-a-repo) and information on
[rebasing](http://git-scm.com/book/en/Git-Branching-Rebasing) from git.

### 3. Create a Branch

The easiest workflow is to keep your master branch in sync with the upstream branch and do not locate any of your own
commits in that branch.  When you want to work on a new feature, you then ensure you are on the master branch and create
a new branch from there.  While the name of the branch can be anything, it can often be easy to use the ticket number
you might be working on.  For example:

```bash
$ git checkout -b t12345 master
Switched to a new branch 't12345'
```

You will then be on the feature branch.  You can verify what branch you are on like this:

```bash
$ git status
# On branch t12345
nothing to commit, working directory clean
```

### 4. Make Changes and Commit

Now you just need to make your changes.  Once you have finished your changes (and tested them) you need to commit them
to your local repository (assuming you have staged your changes for committing):

```bash
$ git status
# On branch t12345
# Changes to be committed:
#   (use "git reset HEAD <file>..." to unstage)
#
#        modified:   somefile.js
#
$ git commit -m "Corrects some defect, fixes #12345, refs #12346"
[t12345 0000000] Corrects some defect, fixes #12345, refs #12346
 1 file changed, 2 insertions(+), 2 deletions(-)
```

### 5. Rebase and Push Changes

If you have been working on your contribution for a while, the upstream repository may have changed. You may want to
ensure your work is on top of the latest changes so your pull request can be applied cleanly:

```bash
$ git pull --rebase upstream master
```

When you are ready to push your commit to your GitHub repository for the first time on this branch you would do the
following:

```bash
$ git push -u origin t12345
```

After the first time, you simply need to do:

```bash
$ git push
```

### 6. Issue a Pull Request

In order to have your commits merged into the main repository, you need to create a pull request.  The instructions for
this can be found in the GitHub Help Article [Creating a Pull Request](https://help.github.com/articles/creating-a-pull-request). Essentially you do the following:

1. Go to the site for your repository.
2. Click the Pull Request button.
3. Select the feature branch from your repository.
4. Enter a title and description of your pull request mentioning the corresponding [bug database](https://github.com/syndesisio/syndesis/issues) ticket in the description.
5. Review the commit and files changed tabs.
6. Click `Send Pull Request`

You will get notified about the status of your pull request based on your GitHub settings.

### 7. Request is Reviewed and Merged

Your request will be reviewed.  It may be merged directly, or you may receive feedback or questions on your pull
request.

### 8. Working on the backend

#### Running code checks

We use multiple Maven plugins configured by the [Base POM](https://github.com/basepom/basepom) project to make our code clean and our dependencies in check. To run them locally run Maven build with `checks` profile turned on:

```bash
$ ./mvnw -Pchecks clean install
```

#### Deploying locally to Minishift

Follow the [quickstart]({{< ref "quickstart.md" >}}) guide to get your Minishift instance up and running. After that set your Docker environment from
Minishift and run Maven build with `-Ddeploy` property set. This will trigger `flash` and `deploy` Maven properties.

```bash
$ eval $(minishift docker-env)
$ ./mvnw -Ddeploy
$ oc delete pod -l component=syndesis-rest
```

After the build finishes delete the `syndesis-rest` pod


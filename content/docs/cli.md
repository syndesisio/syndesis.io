---
draft: false
title: "Syndesis CLI"
description: "Buildtool \"syndesis\""
sidebar: "sidenav"
menu:
  sidenav:
    name: CLI
    weight: -400
    parent: Developer Docs
toc: true
weight: 10
---


Syndesis uses a single tool for controlling various aspects of the build and developer related tasks.
This script can be found in `$SYNDESIS_DIR/tools/bin` and is called `syndesis`.
It requires bash and can be used on any Unix or macOS.

To have this script handy all the time it is recommended to either put this `bin/` directory into the path or add a symlink from `syndesis` into a directory which is already on your execution path.

The script can be used for various tasks which are selected by a so-called command_ which is the first argument to the script.

Just type `syndesis -h` to get an overview of the commands available:


<i class="title">Usage Message</i>
```
Usage: syndesis <command> [... options ...]

with the following commands

   build            Build Syndesis
   dev              Developer tools
   doc              Generate Syndesis Developer Handbook (SDH)
   minishift        Initialize and manage a Minishift developer environment
   system-test      Run system tests

"build" is the default command if no command is specified.
```


There are a handful of global options which can be used:

||||
| ------------- |--------| ------|
| `--help`      | `-h`   | Print usage information. If a command is given print out commands specific options. |
| `--rebase`    | `-r`   | Rebase your project directory before building to integrate upstream changes to your local repository. See below for details how this works. |
| `--verbose`   | &nbsp; | Set verbose mode, which is useful mostly only for debugging the script itself. |


<i class="title">Rebase to Upstream</i>

To easily rebase on changes which have been merged upstream to master, you can use the option `--rebase` (short: `-r`).
This command assumes that you have forked the Syndesis GitHub repositories and you have "origin" and "upstream" remotes like

```
$ git remote -v
origin    git@github.com:rhuss/syndesis.git (fetch)
origin    git@github.com:rhuss/syndesis.git (push)
upstream  https://github.com/syndesisio/syndesis (fetch)
upstream  https://github.com/syndesisio/syndesis (push)
```

With this in place, a `--rebase` performs the following steps:

* Refresh upstream remote: `git fetch upstream master`
* Try a `git rebase upstream/master` which rebases your current local working branch.
* If this fails because you have uncommitted work:
  - A `git stash` is performed
  - The rebase is retried and should succeed
  - `git stash pop` brings back your changes. Stashing can fail with conflicts which you would have to resolve on your own.


<i class="title">Development Modes</i>

The Syndesis application consists of a set of Docker images OpenShift resources descriptors for installing Syndesis.
For development, https://www.openshift.org/minishift/[minishift] is used, and most of the commands assume that you have minishift installed locally and executable directly from your path.
Minishift can be downloaded and installed from https://github.com/minishift/minishift/releases

For development OpenShift S2I builds and image streams are used.
This mode works also when running with a real OpenShift cluster and is not restricted to Minishift usage.
The advantage is that a build automatically triggers a redeployment, so you don't have to kill any pods manually.


<i class="title">Commands</i>

All other options are specific to each command.
You get a list of those options with `syndesis <cmd> -h`.
These options are described in detail in the next sections.

The following commands are available:

|Command      | Description|
| ----------- | -----------|
| build       | Used for building Syndesis and its various modules   |
| ui          | Start the UI for local development _(not implemented yet)_ |
| minishift   | Start and install Syndesis on Minishift |
| install     | Install Syndesis in a running cluster (other than Minishift) |
| system-test | Run System test against an OpenShift cluster |
| dev         | Utility commands useful during development |
| doc         | Generating and publish this documentation |
| release     | Release Syndesis' Maven and NPM artifacts _(not implemented yet)_ |

If no command is given, `build` is the default.
Remember a command must be the first argument, but there are additional possibilities to specify commands:

* You can use the form `--command` anywhere as an option, too. E.g. using  `--minishift` is the same as specifying "minishift" as the first argument.
* A `--mode command` can be used, too (e.g. `--mode sytem-test`)

The next sections describe the commands in detail.
To add a new command, just drop a script file into `$SYNDESIS_DIR/tools/bin/commands` directory with following structure:

```
#!/bin/bash

yourscriptname::description() {
    echo "Describe the command"
}

yourscriptname::usage() {
    cat <<EOT
    Describe the usage of the command
EOT
}

yourscriptname::run() {
    Do your stuff
}
```


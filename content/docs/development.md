---
draft: false
title: "Development"
sidebar: "sidenav"
menu:
  sidenav:
    name: Development
    weight: -400
    parent: Developer Docs
toc: true
weight: 20
---

## Maven Groups

Syndesis uses [Maven](http://maven.apache.org/) as build tool. Maven
groups are used to separate the various Syndesis parts.

In details Syndesis consists of the following
groups:

| Group           | Maven                     | Docker Image               | Description                                                     |
| --------------- | ------------------------- | -------------------------- | --------------------------------------------------------------- |
| **common**      | `io.syndesis.common`      |                            | Syndesis shared common module                                   |
| **connector**   | `io.syndesis.connector`   |                            | Supported camel connectors                                      |
| **rest**        | `io.syndesis.rest`        | `syndesis/syndesis-server` | REST backend for managing integrations. This is the main sever. |
| **integration** | `io.syndesis.integration` |                            | Library used in the the integration runtimes                    |
| **s2i**         | `io.syndesis.s2i`         | `syndesis/syndesis-s2i`    | S2I base image for building integrations                        |
| **ui**          | `io.syndesis.ui`          | `syndesis/syndesis-ui`     | User interface SPA, talking to the REST backend                 |
| **meta**        | `io.syndesis.meta`        | `syndesis/syndesis-meta`   | Service for connector meta-data and verification of connections |
| **extension**   | `io.syndesis.extension`   |                            | Library and API for developing Syndesis extensions              |
| **test**        | `io.syndesis.test`        |                            | System tests for testing the whole applications                 |

![Figure 1. Group dependencies](/images/syndesis-group-dependencies.png)


_Figure 1. Group dependencies_

### Naming Conventions

The following conventions are used for naming directories, modules and
Java packages.

> **Important**
> 
> These conventions are mandatory and should be also checked for when
> doing pull request reviews.

  - Each directory directly below `app/` is specific for a certain Maven
    group. E.g. the directory `app/extension` is reserved for all Maven
    modules belonging to the Maven group `io.syndesis.extension`. The
    directory name is reflected as the last name part.

  - All names (groups, modules, package) are using the **singular**
    form. E.g. its a `io.syndesis.connector`, *not*
    `io.syndesis.connectors`.

  - Each Maven module is prefixed with the last part of the group name.
    E.g. the directory `app/integration/api` holds a Maven module for
    the the Maven group `io.syndesis.integration`, and the module’s
    artefactId is `integration-api`.

  - A module’s directory name is directly reflected as the last part of
    the Maven module name. If the Maven module name consists of multiple
    parts (e.g. artifact `integration-project-generator`), then the
    corresponding directory is also a concatenated word (like in
    `integration/project-generator`). Multipart names should be the
    exception, though.

  - There should be only one level deep modules, so each Maven group
    directory holds all Maven modules flat.

  - Each module has a **single** top-level package, reflecting the Maven
    module name. E.g. for the Maven module `common-util` in group
    `io.syndesis.common` has a single top-level package
    `io.syndesis.common.util` This top-level package should reflect the
    artefact name, with dashes replaced by dots.

> **Note**
> 
> Not every module has been already transformed to this scheme. This
> will happen step-by-step. But for new groups and modules this scheme
> has to be followed.


## Issue Labels

We use GitHub labels to categorize epics, issues and tasks. They are the
foundation of our process, so please use labels for issues.

> **Caution**
> 
> Labels are living entities. This document describes the current status
> and might be slightly outdated. Please send a PR to adopt this section
> if the label structure changes. Also feel free to discuss the label
> structure anytime. It’s essential that labels describe our process,
> not that we have to adapt our process for these labels.

Labels are grouped. Each label consists of two parts: A **Group** and a
**Name** which are separated by a slash (`/`). For example, the label
`module/ui` is used to mark issue which is relevant to the Syndesis UI
module.

The following label groups are available. There must be only at most one
label from the "Exclusive"
groups.

| Group       | Description                                                                                                                        | Excl. |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------- | ----- |
| **cat/**    | Misc categories which can be added freely                                                                                          |       |
| **prio/**   | Priority of the issue. Only one `prio/` label must be added per issue. `prio/p0` is of highest priority, `prio/p2` the lowest one. | ✔︎    |
| **ext/**    | Reference to external projects                                                                                                     |       |
| **source/** | Where did the issue originate from (stakeholders)? i.e. `source/qe` indicates that QE raised this issue.                           |       |
| **group/**  | Internal Syndesis modules                                                                                                          |       |
| **source/** | Which external group has created the issue                                                                                         |       |
| **notif/**  | Notification label which can be added and removed to ping certain subteams                                                         |       |
| **pr/**     | Labels which are only relevant for pull request and which have also some semantics for the bot managing pull requests              |       |
| **size/**   | Tee shirt size for issues. Sizing is a subjective assessment and should be done relative to other issues.                          | ✔︎    |
| **status/** | Status of an issue or PR.                                                                                                          |       |

Each label group serves a particular purpose, and for each issue and PR,
it should be considered whether a label from a group applies.

### Groups

Labels from this group reference our application groups like "rest",
"ui" or "connector". Each sub-team is responsible for one or more group,
and every group has an 'owning' team. That does not mean that members of
other teams are not allowed to work on such groups. Contrary, this is
even encouraged. But its just there so that teams can filter on issues
and PRs which are relevant to them.

An issue can carry many group labels. Especially Epics will carry more
than such label as they touch more than one group (otherwise it wouldn’t
be an epic).

For Java code, a "group" roughly corresponds to a directory directly
below
`app/`

| Group                 | Description                                                     |
| --------------------- | --------------------------------------------------------------- |
| **group/common**      | Syndesis shared common module                                   |
| **group/connector**   | Supported camel connectors                                      |
| **group/extension**   | Tools for developing Syndesis extensions                        |
| **group/install**     | Installing Syndesis (templates, scripts)                        |
| **group/integration** | Library used in the the integration runtimes                    |
| **group/meta**        | Service for connector meta-data and verification of connections |
| **group/operator**    | Infrastructure operator related                                 |
| **group/s2i**         | S2I base image for building integrations                        |
| **group/server**      | REST backend for managing integrations                          |
| **group/ui**          | User interface SPA, talking to the REST backend                 |
| **group/uxd**         | User experience (UX) designs                                    |

### Categories

Labels from the `cat/` group are labels which can always be applied and
which does not fit in another category. Currently we have these
categories:

| Category           | Description                                                                    |
| ------------------ | ------------------------------------------------------------------------------ |
| **cat/bug**        | A bug which needs fixing.                                                      |
| **cat/build**      | For issues which have relevance for the build system.                          |
| **cat/design**     | A concrete UX design. Use this for PRs containing UX designs.                  |
| **cat/discussion** | This issues requires a discussion.                                             |
| **cat/feature**    | PR label for a new feature                                                     |
| **cat/process**    | Development process related issues carry this label.                           |
| **cat/question**   | For issues holding a question.                                                 |
| **cat/research**   | Label used for issues which describe some research work                        |
| **cat/starter**    | An issue which is easy to solve and can be used for ramping up new developers. |
| **cat/techdebt**   | Label for issues identifying technical debt.                                   |
| **cat/techdoc**    | Technical developer information (likes this handbook ;-) related issues.       |
| **cat/user-story** | A user story, which might not be an epic                                       |

### Pull Requests

This category of labels is all about pull requests. All of them have a
meaning for the [pure-bot](https://github.com/syndesisio/pure-bot) bot
which watches a pull request and performs certain action. These actions
also involve monitoring and creating labels.

The following labels are
involved:

| Notification            | Description                                                                                                                                                                                                                                                                                                                                                                                       |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **pr/approved**         | This label will be automatically applied to a PR as soon as the PR has been approved at the end of a review. It is an indicator for [pure-bot](https://github.com/syndesisio/pure-bot) to automatically merge the pull request if it passes all required tests. You should not set this label manually for approving a PR but using the GitHub button to do so.                                   |
| **pr/needs-backport**   | This pull request needs a corresponding backport to the latest patch branch.                                                                                                                                                                                                                                                                                                                      |
| **pr/review-requested** | In our process it is not mandatory to have a PR review. However, if the author requests a review via the normal GitHub functionality, this label gets applied automatically. When this label is set on a pull-request, then the mandatory status check `pure-bot/review-requested` will only pass if at least a single pull request has been given, so prevents manual merging (without forcing). |
| **status/wip**          | This is a PR request label which should be used for "Work-in-Progress" kind of PRs which has been submitted for early review. If this label is present on a PR, the PR is not merged, even when it is approved. A dedicated mandatory status check `pure-bot/wip` monitors this labels and prevents merging if this label is present.                                                             |
| **status/1.4.x**        | This pull request is against the 1.4.x patch branch (analogous labels might appear over time)                                                                                                                                                                                                                                                                                                     |

### Notification

Notification labels from the `notif/` group serve a particular purpose.
They are used when one team wants to notify another group that a
specific issue might have them relevance to
them.

| Notification     | Description                                                                                                                                                                                                                      |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **notif/doc**    | The issue needs some attention from the docs team. This might because a new feature has been introduced or, more important, an existing feature has changed for which a documentation already exists.                            |
| **notif/pm**     | The issue needs input from product management.                                                                                                                                                                                   |
| **notif/triage** | Every new issue gets this label and is considered during a triage session for properly priorisation and categorisation. Remove this label after the triage has happened.                                                         |
| **notif/uxd**    | This label should be used for issues which needs some attention from the UX team. This might because a new feature has been introduced or, more important, an existing feature has changed for which a UX design already exists. |

It is important to note that these labels also be removed when the
notification has been received.

For example, when a UI feature like an input form changes. Then the UI
team attaches a `notif/uxd` label to the PR which introduces this
change. The UX team, detects with a filter search on this label, that
there is a new notification. It then decides, whether UX design needs to
be updated or not. In any case, they are removing the `notif/uxd` label
and add a `module/uxd` label if this PR indeed requires a UX design
update. If no update is required, then the label is removed without
replacement.

## Source

Labels starting with `source/` indicate the origin of an issue. It
should be applied to help in triaging and prioritizing.

| Notification  | Description                      |
| ------------- | -------------------------------- |
| **source/qe** | This issue has been raised by QE |

## External references

This label group should be used if an external system is referenced,
which is not part of the Syndesis mono
repo.

| External Project | Description                                                                                           |
| ---------------- | ----------------------------------------------------------------------------------------------------- |
| **ext/atlasmap** | [atlasmap](https://github.com/atlasmap/atlasmap) data mapper                                          |
| **ext/qe**       | [syndesis-qe](https://github.com/syndesisio/syndesis-qe) suite                                        |
| **ext/docs**     | [syndesis-documentation](https://github.com/syndesisio/syndesis-documentation) End user documentation |

For the future, we plan to add more of these external repos into the
Syndesis mono repo (like documentation or QE). If this happens, then
labels should be converted to `module/` kind of labels.

### Status

Status labels are unique since they may trigger some automatic actions.

The current status labels
are:

| Status             | Description                                                                                                                                  |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- |
| **status/blocked** | The current issue is blocked by another issue. Refer to the issue itself to see what is blocking this issued. This label is purely informal. |


## Local Development

If you’d like to get a local development environment up and running, for
both the UI and REST API, this is how you’d do it.

**Tips**

  - Build on branch, not master.

  - Callback URL Example:
    <https://syndesis.192.168.64.29.nip.io/api/v1/credentials/callback>

### Requirements

You can follow these steps if it’s your first time setting up Syndesis,
or if you want a fresh local installation to replace an existing one.
Some environment-specific instructions may be available below as well.

1.  Make sure you have installed [node](https://nodejs.org/en/download/)
    version \>= 6.x.x and [Yarn](https://yarnpkg.com/en/docs/install)
    version \>= 0.18.1.

2.  Get a developer deployment of Syndesis running in a Minishift
    environment as described in the [Syndesis
    Quickstart](https://syndesis.io/quickstart/). Most are specific to
    your environment, so follow the sections below for a quick setup.
    The general instructions are:
    
      - Install a hypervisor for Minishift.
    
      - Install Minishift.
    
      - Install the OpenShift CLI.
    
      - Make sure it’s in your `$PATH`

**macOS**

If you’ll be using the Homebrew method, you’ll obviously need to have
Homebrew installed. Then, to install the hypervisor for Minishift and
Minishift itself:

    $ brew install docker-machine-driver-xhyve
    $ brew cask install minishift

Finally, to install the OpenShift CLI, we recommend using Homebrew:
`brew install openshift-cli`

**Linux & Windows**

  - [Install a hypervisor for
    Minishift](https://docs.openshift.org/latest/minishift/getting-started/installing.html#install-prerequisites).
    For macOS, we recommend using the Docker xhyve plugin
    [here](https://docs.openshift.org/latest/minishift/getting-started/setting-up-driver-plugin.html#xhyve-driver-install),
    which can be installed using Homebrew.

  - [Install
    Minishift](https://docs.openshift.org/latest/minishift/getting-started/installing.html#installing-instructions).
    For macOS, we recommend you use the Homebrew method.

Please note that you need to have the `oc` binary available in your
`PATH`. To do that, see here:
<https://docs.openshift.org/latest/cli_reference/get_started_cli.html>

### First-Time Setup

The goal here is to download the project to your laptop/PC, and to
install Minishift, the VM that contains OpenShift.

    $ git pull https://github.com/syndesisio/syndesis.git # or own fork
    $ cd syndesis
    $ syndesis minishift --full-reset

### Day-to-Day

This uses an existing Minishift instance.

**NOTE:** If you already followed the First-Time Setup above, you do not
need to follow this. The Minishift VM will already have been started.
Simply skip to the

**Get the Latest Changes**

    $ git checkout master
    $ git pull upstream master
    $ git checkout <branch>
    $ git rebase master

**Start of the Day** Make sure Minishift is running.

    $ minishift status

Which should look like:

    Minishift:  Running
    Profile:    minishift
    OpenShift:  Running (openshift v3.6.0+c4dd4cf)
    DiskUsage:  11% of 17.9G

If it isn’t, start it with:

    $ minishift start

**Login into and Set up OpenShift**

This step is required regardless of whether it’s a first-time install or
not. It logs you in and points OpenShift to use Minishift resources.

    $ oc login -u developer
    $ eval $(minishift oc-env)
    $ eval $(minishift docker-env)

The eval’s set a number of environment variables, like change the
`$PATH` and `$DOCKER_HOST`, so each time you do a Syndesis build it’s
good to make sure those are invoked.

**End of the Day**

    $ minishift stop

**Start the UI App & Open in the Browser**

    $ yarn start:minishift
    $ open https://$(oc get routes syndesis --template "{{.spec.host}}")

**Resetting the Database**

This step is optional. This command expects Minishift to be running
already. It’s the `-i docker` that determines the workflow, for Roland
it seems to work without that though.

It would clean the database if we increase the schema version, if we
don’t it remains the same.

    $ syndesis build -m rest -f -i docker -k

Alternatively, you can use the REST API Endpoint:
/api/v1/test-support/reset-db

**Connecting to the Database**

You can also port forward the DB’s port using `oc port-forward` and then
connect to the database using a tool like
[pgadmin](https://www.pgadmin.org/download/) to view the data. First get
the DB pod’s name either from `oc get pods` or from the OpenShift
console. Then use the following command:

    $ oc port-forward <db pod name> 5432:5432

Now start pgadmin and add a new DB server, use `localhost` for the
`host` setting. For the username and password look on the DB pod’s
`Environment` page in the OpenShift console.

In pgadmin you can see the table by navigating into the tree under
`Server Groups > Servers > syndesis > Databases > syndesis > Schemas >
public > Tables > jsondb`. Right click, and then go to `View Data > View
All Rows`.


## UI

After you’ve set up your initial Local Development environment, you’re
ready to contribute to the UI.

### Install Dependencies

From the project root directory:

    $ cd app/ui
    $ yarn install

### Start up the App

**Using Minishift resources (recommended):**

    $ yarn start:minishift

The `yarn start:minishift` command works when it can properly detect
your local development machine’s IP address. A proxy server inside the
minishift deployment will use that IP address to connect back to the
development server being run by the yarn command. If detection of the IP
is failing for you, then set the `SYNDESIS_DEV_LOCAL_IP` env variable to
your local machine’s IP address before running the yarn `yarn
start:minishift` command.

### Open in Your Browser

Open the Syndesis UI in your browser from the command line by running:

``` bash
# on macOS
$ open https://$(oc get routes syndesis --template "{{.spec.host}}")
```

``` bash
# on linux
$ xdg-open https://$(oc get routes syndesis --template "{{.spec.host}}")
```

``` bash
# on windows
$ start https://$(oc get routes syndesis --template "{{.spec.host}}")
```

Another option is to run `minishift console`, go into **My Project** and
click on the URL for the Syndesis app.

To verify that you’re running against the development instance of the UI
check the title of the browser tab you’ve opened and ensure it says
`DEVELOPMENT` in in somewhere.

**Not using Minishift resources** In the event that you have issues with
Minishift. Don’t be surprised if most things don’t load and there isn’t
any data in the UI. Only use this if you’re totally blocked and need to
work on something minor/aesthetic in the UI.

    $ yarn start

### Running Tests

To run tests or lint there are two more commands you can run in separate
terminals.

    $ yarn test

### Running Linter

If you don’t, the CI will, and your PR build will likely fail.

    $ yarn lint

You should be able to access the UI in your browser at
<http://localhost:4200>

### Code Documentation

We use [Compodoc](https://compodoc.github.io/website/) for
documentation, or
[here](https://compodoc.github.io/website/guides/comments.html) to see
how to format comments. Files get generated automatically in the
`/documentation` directory. Read the documentation
\[here\](<https://compodoc.github.io/website/guides/getting-started.html>)
to see how to properly document features. You can automatically generate
and run docs using Yarn:

``` bash
$ yarn compodoc
```

Or manually with `compodoc -s`, or `compodoc` if you want it to simply
generate the files in the default `/documentation` directory and run it
with an HTTP server.

### Technology Stack

Included in this stack are the following technologies:

  - Language: [TypeScript](http://www.typescriptlang.org) (JavaScript
    with @Types)

  - Framework: [Angular](https://angular.io/)

  - Testing: [Cucumber.js](https://cucumber.io/) (BDD Unit Test
    Framework), [Karma](https://karma-runner.github.io/1.0/index.html)
    (Unit Test Runner),
    [Istanbul](https://github.com/gotwarlost/istanbul) (Code Coverage)

  - Linting: [TsLint](https://github.com/palantir/tslint) (Linting for
    TypeScript)

  - Logging: WIP

  - Code Analysis: [Codelyzer](https://github.com/mgechev/codelyzer)
    (TsLint rules for static code analysis of Angular TypeScript
    projects) / WIP



## REST API

After you’ve set up your initial Local Development environment, you’re
ready to contribute to the REST API.


## Troubleshooting

When things go wrong, you want to try to identify the area that is
causing problems (UI, REST API, etc). If it’s the UI, look for errors in
the browser console or the terminal to see if it’s a dependency issue.

### UI Dependency Issues

    $ rm -rf node_modules
    $ yarn install

### VM Trouble

**Not getting latest API changes**

This is a known issue. This is the workaround for using the latest REST
image from the Docker stream.

**NOTE**: This deletes your Minishift instance, installs OpenShift
templates for the pods, and restarts Minishift.

Disclaimer: It’s not 100% clear what `-i` docker for `Syndesis Minishift
--install` does exactly, but there is no way to invoke those evals
before you get a running VM, which is what `--full-reset` does. So as a
rule of thumb, you can have a terminal with those evals and keep it open
and do all of the Syndesis building from there.

    $ syndesis minishift --full-reset --install -p syndesis -i docker

**syndesis command not found** If you get `'syndesis' command not found`
then use the full path to the `syndesis` binary instead. This assumes
you are in the root of the project
    directory.

    $ ./tools/bin/syndesis minishift --full-reset --install -p syndesis -i docker

**If OpenShift templates have been updated** This should not be the
first choice, since it changes the IP of the VM, and in general should
not be necessary for just building and updating the version.

    $ syndesis minishift --full-reset --install

**VM Trouble**

    $ syndesis build

Other things you can try: - `rm -rf ~/.minishift` - Check the OpenShift
console and look for logs. - Is it a xip or nip problem?
<http://downoruprightnow.com/status/nip.io>


### Still Having Trouble?

Ask on IRC \#syndesis

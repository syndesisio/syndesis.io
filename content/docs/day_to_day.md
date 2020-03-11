---
draft: false
title: "Day to Day"
sidebar: "sidenav"
menu:
  sidenav:
    name: Day to Day
    weight: 1
    parent: "CLI - Command Line Interface"
toc: true
weight: 20
---

This uses an existing Minishift instance.

**NOTE:** If you already followed the First-Time Setup section, you do not
need to follow this. The Minishift VM will already have been started.
Simply skip to the

### Get the Latest Changes

```shell
$ git checkout master
$ git pull upstream master
$ git checkout <branch>
$ git rebase master
```

### Start of the Day
Make sure Minishift is running.

```shell
$ minishift status
```

Which should look like:

```
Minishift:  Running
Profile:    minishift
OpenShift:  Running (openshift v3.6.0+c4dd4cf)
DiskUsage:  11% of 17.9G
```

If it isn’t, start it with:

```shell
$ minishift start
```

### Login into and Set up OpenShift

This step is required regardless of whether it’s a first-time install or
not. It logs you in and points OpenShift to use Minishift resources.

```shell
$ oc login -u developer
$ eval $(minishift oc-env)
$ eval $(minishift docker-env)
```

The eval’s set a number of environment variables, like change the
`$PATH` and `$DOCKER_HOST`, so each time you do a Syndesis build it’s
good to make sure those are invoked.

### End of the Day

```shell
$ minishift stop
```

### Start the UI App & Open in the Browser

```shell
$ yarn start:minishift
$ open https://$(oc get routes syndesis --template "{{.spec.host}}")
```

### Prune resources

You can free some disk space by removing and pruning obsolete resources
from openshift.

    $ syndesis dev --cleanup
    
    
### Resetting the Database

This step is optional. This command expects Minishift to be running
already. It’s the `-i docker` that determines the workflow, for Roland
it seems to work without that though.

It would clean the database if we increase the schema version, if we
don’t it remains the same.

```
$ syndesis build -m rest -f -i docker -k
```

Alternatively, you can use the REST API Endpoint:
`/api/v1/test-support/reset-db`

### Connecting to the Database

You can also port forward the DB’s port using `oc port-forward` and then
connect to the database using a tool like
[pgadmin](https://www.pgadmin.org/download/) to view the data. First get
the DB pod’s name either from `oc get pods` or from the OpenShift
console. Then use the following command:

```shell
$ oc port-forward <db pod name> 5432:5432
```

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

```shell
$ cd app/ui
$ yarn install
```

### Start up the App

**Using Minishift resources (recommended):**

```shell
$ yarn start:minishift
```

The `yarn start:minishift` command works when it can properly detect
your local development machine’s IP address. A proxy server inside the
minishift deployment will use that IP address to connect back to the
development server being run by the yarn command. If detection of the IP
is failing for you, then set the `SYNDESIS_DEV_LOCAL_IP` env variable to
your local machine’s IP address before running the yarn `yarn
start:minishift` command.

### Open in Your Browser

Open the Syndesis UI in your browser from the command line by running:

```shell
# on macOS
$ open https://$(oc get routes syndesis --template "{{.spec.host}}")
```

```shell
# on linux
$ xdg-open https://$(oc get routes syndesis --template "{{.spec.host}}")
```

```shell
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

```shell
$ yarn start
```

### Running Tests

To run tests or lint there are two more commands you can run in separate
terminals.

```shell
$ yarn test
```

### Running Linter

If you don’t, the CI will, and your PR build will likely fail.

```shell
$ yarn lint
```

### Technology Stack

Included in this stack are the following technologies:

  - Language: [TypeScript](http://www.typescriptlang.org) (JavaScript
    with @Types)
  - Framework: [React](https://reactjs.org/)
  - Testing: [Jest](https://jestjs.io/) and [Karma](https://karma-runner.github.io/1.0/index.html)
    (Unit Test Runner),
  - Linting: [TsLint](https://github.com/palantir/tslint) (Linting for
    TypeScript)
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

```shell
$ rm -rf node_modules
$ yarn install
```

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

```shell
$ syndesis minishift --full-reset --install -p syndesis -i docker
```

**syndesis command not found** If you get `'syndesis' command not found`
then use the full path to the `syndesis` binary instead. This assumes
you are in the root of the project directory.

```shell
$ ./tools/bin/syndesis minishift --full-reset --install -p syndesis -i docker
```

**If OpenShift templates have been updated** This should not be the
first choice, since it changes the IP of the VM, and in general should
not be necessary for just building and updating the version.

```shell
$ syndesis minishift --full-reset --install
```

**VM Trouble**

```shell
$ syndesis build
```

**Pods self updating**. Occasionally you can notice some syndesis pods
may have been updated, it occurs because the image streams are pointing
to dockerhub and whenever there is an update of that image on dockerhub,
then your local pod will be updated. To prevent theses updates, set the
`DEV_SUPPORT=true` environment variable on syndesis-operator deployment
config.

```shell
$ oc set env dc/syndesis-operator DEV_SUPPORT=true
```

Other things you can try: - `rm -rf ~/.minishift` - Check the OpenShift
console and look for logs. - Is it a xip or nip problem?
<http://downoruprightnow.com/status/nip.io>

### Diagnostics

**Examining logs**

When a problem occur, the first thing should be to examine the logs.

```shell
# syndesis-server pod
$ oc logs -f `oc get -o name pod -l syndesis.io/component=syndesis-server`

# log of an integration named "twilog"
$ oc logs -f `oc get -o name pod -l syndesis.io/type=integration -l syndesis.io/integration=i-twilog`

# postgresql log
$ oc logs -f `oc get -o name pod -l syndesis.io/component=syndesis-db` -c postgresql
```

You can examine the pod initialization events and many other details
about the pod.

```shell
$ oc describe `oc get -o name pod -l syndesis.io/component=syndesis-server`
```

**Enable the java debug agent on a pod**

```
# to enable debug on an integration named "twilog"
$ oc set env `oc get dc -o name|grep twilog` JAVA_DEBUG=true

# to enable debug on syndesis-server
$ oc set env dc/syndesis-server JAVA_DEBUG=true
```

**Connect to postgresql database** You can use `psql` tool to connect to
the postgresql database.

```
$ oc port-forward `oc get -o name pod -l syndesis.io/component=syndesis-db` 5432:5432
$ psql -U syndesis -h localhost syndesis
```

### Still Having Trouble?

Ask on [Gitter](https://gitter.im/syndesisio/community)

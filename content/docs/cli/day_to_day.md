---
draft: false
title: "Day to Day"
toc: true
weight: 20
---

## Minishift

We are assuming an existing Minishift instance.

### Startup

Make sure Minishift is running.

```shell
$ minishift status
```

Which should look like:

```shell
$ minishift status
Minishift:  Running
```

If it says something like:

```shell
$ minishift status
Minishift:  Stopped
```

Then start minishift with:

```shell
$ minishift start
```

### Environment

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

### Prune resources

You can free some disk space by removing and pruning obsolete resources
from openshift.

```shell
$ syndesis dev --cleanup    
```

If that's not enough to cleanup the Syndesis installation, you can try a more aggresive approach.

First make sure you are properly logged in and the environment variables are setup:

```shell
$ oc login -u developer
$ eval $(minishift oc-env)
$ eval $(minishift docker-env)
```

Then you can try this commands, but be careful and understand what this is doing because it may break stuff and force you to reinstall things.

```shell
# delete all syndesis integration resources 
oc delete all -l syndesis.io/type=integration 

# remove old integration runtime images 
docker rmi $(docker images -f "reference=*/syndesis/i-*" -q) 

# remove old syndesis images 
docker rmi $(docker images -f "reference=*/syndesis/syndesis-*" -q) 

# remove docker containers from previous minishift starts 
docker rm $(docker ps -qa) 
docker rmi $(docker images -f "dangling=true" -q)

# remove exited containers:
docker ps --filter status=dead --filter status=exited -aq | xargs -r docker rm -v

docker system prune --all

docker system prune --volumes
```

### End of the Day

You just shutdown minishift to finish.

```shell
$ minishift stop
```

## Backend Development

Here are some common commands to run while developing on the backend.

### Update Server image

Useful when server changes.

```shell
$ syndesis -m server -i -f -d      
```

### Update Meta image

Useful when meta changes.

```shell
$ syndesis -m meta -i -f -d     
```

### Update Connector

When working with a specific connector and just want to update this specific connector with executing all tests and style checks, you can:

```shell
$ syndesis -m :connector-$name    
```
### Update s2i image

When you want to try a new connector (or an upgraded connector) as an integration through the user interface:

```shell
$ syndesis -m s2i -i -f -d     
```

### Resetting the Database

This step is optional. This command expects Minishift to be running
already.

It would clean the database if we increase the schema version, if we
don’t it remains the same.

```
$ syndesis build -m rest -f -k
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

#### Cleanup DB (Remove Integrations)

Once inside the database, we can cleanup the database to save some space and cleanup the installation.

```sql
DELETE FROM jsondb WHERE path NOT LIKE '/connect%';
```

## UI Development

Here are some common commands to run while developing on the frontend.

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
    

## Got any questions?

Ask on [Gitter](https://gitter.im/syndesisio/community)

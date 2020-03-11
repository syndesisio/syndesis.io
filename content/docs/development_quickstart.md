---
draft: false
title: "Development QuickStart"
sidebar: "sidenav"
menu:
  sidenav:
    name: "Development QuickStart"
    weight: 1
    parent: "Developer Docs"
toc: true
weight: 20
---


If you’d like to get a local development environment up and running, for
both the UI and REST API, this is how you’d do it.

**Tips**

  - Build on branch, not master.
  - Callback URL Example:
    <https://syndesis.192.168.64.29.nip.io/api/v1/credentials/callback>

## Requirements

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

### macOS

If you’ll be using the Homebrew method, you’ll obviously need to have
Homebrew installed. Then, to install the hypervisor for Minishift and
Minishift itself:

```shell
$ brew install docker-machine-driver-xhyve
$ brew cask install minishift
```

Finally, to install the OpenShift CLI, we recommend using Homebrew:
`brew install openshift-cli`

### Linux & Windows

  - [Install a hypervisor for Minishift](https://docs.openshift.org/latest/minishift/getting-started/installing.html#install-prerequisites).
    For macOS, we recommend using the Docker xhyve plugin
    [here](https://docs.openshift.org/latest/minishift/getting-started/setting-up-driver-plugin.html#xhyve-driver-install),
    which can be installed using Homebrew.
  - [Install Minishift](https://docs.openshift.org/latest/minishift/getting-started/installing.html#installing-instructions).
    For macOS, we recommend you use the Homebrew method.

Please note that you need to have the `oc` binary available in your
`PATH`. To do that, see here:
<https://docs.openshift.org/latest/cli_reference/get_started_cli.html>

## First-Time Setup

The goal here is to download the project to your laptop/PC, and to
install Minishift, the VM that contains OpenShift.

```shell
$ git pull https://github.com/syndesisio/syndesis.git # or own fork
$ cd syndesis

# install minishift
$ syndesis minishift --full-reset --project syndesis --maven-mirror --disk-size 60GB
```

You can also include other options when setting up, for example
including an addon:

```shell
# install syndesis with jaeger addon
$ syndesis minishift --install --project syndesis --nodev --app-options " --addons jaeger"
```
<div class="alert alert-info admonition" role="alert"> <i class="fa
important"></i> The jaeger is installed to support the activity log
backed by jaeger opentracing, which is faster than the activity log
stored in postgresql.  </div>

## Running without Kubernetes/OpenShift

For some development tasks you can run Syndesis without running on a
Kubernetes/OpenShift cluster. You won't be able to publish integrations,
see activities or gather metrics, or any other functionality that
requires a running cluster. This is best suited for quick turnaround
development of backend APIs together with UI features. You'll need three
components running the Syndesis backend, the PostgreSQL database it uses
and the UI.

Start by running a PostgreSQL database in a Docker container:

```shell
$ docker run -d --rm -p 5432:5432 -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=syndesis postgres
```
<div class="alert alert-info admonition" role="alert"> <i class="fa
important"></i> the `--rm` option will remove the container once done
and all the stored data in the database with it, if you wish to keep the
data omit that option </div>

Next run the Syndesis backend, this step requires that you have
downloaded all the dependencies and built the backend:

```shell
$ syndesis build -f -c --backend # to download dependencies and build the backend
$ (cd app && ./mvnw -f server/runtime spring-boot:run)
```

The backend is started once you see a line containing this in the
output:

```
Started Application in 28.9 seconds (JVM running for 29.615)
```

After that UI can be started by running (in two separate terminal
sessions):

```shell
$ (cd app/ui-react && watch:packages)
$ (cd app/ui-react && BACKEND=http://localhost:8080 yarn watch:app:proxy)
```

You can now access a running instance at <https://localhost:3000>.


## Use latest image instead of fixed version

Sometimes the operator pod does override the version we have installed so we can't really test our own custom code. We can manually set the image stream to `latest` in OpenShift console and build the syndesis-operator image with syndesis CLI.


```shell
eval $(minishift docker-env)
oc login -u developer -p developer
oc project syndesis

syndesis build -t -f -m operator

docker login -u developer -p $(oc whoami -t) $(minishift openshift registry)

docker tag syndesis/syndesis-operator $(minishift openshift registry)/syndesis/syndesis-operator

docker push $(minishift openshift registry)/syndesis/syndesis-operator
```

After this we have a new syndesis-operator:latest image in the Minishift registry and the syndesis-operator deployment starts working. The operator will automatically setup arbitrary deployments for syndesis-oauthproxy, syndesis-db, syndesis-prometheus and pull the images.

## Get the Latest Changes

Every now and then we should update the code we are working on to get the latest changes to make pull requests easy to merge.

```shell
$ git pull --rebase origin $branch
```

where $branch is usually master.

## Install Maven Nexus as mirror

It is a good idea to have a local Nexus installation that Maven can use to cache dependencies. We can automatically install a maven mirror on our environment with the following command:

```shell
$ syndesis dev --install-maven-mirror
```

You should check now the [Day to Day section](/docs/day_to_day)

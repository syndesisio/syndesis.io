---
bref: ""
date: 2017-05-16T15:58:18+01:00
description: ""
draft: false
menu:
  sidenav:
    pre: <i class='fa fa-fw fa-rocket'></i>
    weight: -200
  topnav:
    name: quickstart
    identifier: quickstart
    weight: -200
sidebar: sidenav
title: "Quickstart"
toc: true
weight: 20
---

<center>
<iframe width="560" height="315" src="https://www.youtube.com/embed/9vaVMbsHJqk?rel=0" frameborder="0" allowfullscreen></iframe>
</center>

We aim to make it as simple as possible for users to try out Syndesis. If you want to try out locally on your laptop, follow the [Using Minishift]({{< relref "#using-minishift" >}}) instructions.

- - -

## Using Minishift

Minishift is a tool that helps you run OpenShift locally by running a single-node OpenShift cluster inside a VM locally. With Minishift you can easily try out Syndesis without requiring a "real" cluster or servers, a laptop will suffice.

### Prerequisites

#### Minishift itself

You're going to need a working Minishift installation, which is really easy. If you haven't got Minishift already installed, please follow the [Minishift installation documentation](https://docs.openshift.org/latest/minishift/getting-started/installing.html).

Fire up Minishift if it's not already running. You need to add some memory, 4192 or more is recommended, and allocate a couple of CPUs:

```bash
$ minishift start --memory 4192 --cpus 2
```

Tip: If you want to switch the OpenShift config permanently use:

```bash
$ minishift config set memory 8384
$ minishift config set cpus 2
```

### Template selection

Deploying Syndesis is made easy thanks to [OpenShift templates](https://docs.openshift.org/latest/dev_guide/templates.html). The template to use in the installation instructions depend on your use case:

* **Developer** : Use the template [`syndesis-dev-restricted`](https://raw.githubusercontent.com/syndesisio/syndesis/master/app/deploy/syndesis-dev-restricted.yml) which directly references Docker images without image streams. Then before building the images e.g. with `mvn fabric8:build` set your `DOCKER_HOST` environment variable to use the Minishift Docker daemon via `eval $(minishift docker-env)`. When new images are built you only need to delete the appropriate pod so that the new pod spinning up will use the freshly built image.

* **Tester** / **User** : In case you only want to have the latest version of Syndesis on your local Minishift installation, use the template [`syndesis-restricted`](https://raw.githubusercontent.com/syndesisio/syndesis/master/app/deploy/syndesis-restricted.yml) which uses image stream referring to the published Docker Hub images. Minishift will update its images and trigger a redeployment when the images at Docker Hub changes. Therefore it checks every 15 minutes for a changed image. You do not have to do anything to get your application updated, except for waiting on Minishift to pick up new images.

Depending on your role please use the appropriate template in the instructions below.

### Deployment instructions

Install the OpenShift template (syndesis-dev-restricted.yml or syndesis-restricted.yml as discussed [above]({{< relref "#template-selection" >}})):

```bash
$ oc create -f https://raw.githubusercontent.com/syndesisio/syndesis/master/app/deploy/syndesis-dev-restricted.yml
```

In order to make it easy to run Syndesis on a cluster without requiring admin rights, Syndesis takes advantage of OpenShift's ability to use a [Service Account as an OAuth client](https://docs.openshift.org/latest/architecture/additional_concepts/authentication.html#service-accounts-as-oauth-clients). Before we create the app, we'll need to create this Service Account:

```bash
$ oc create -f https://raw.githubusercontent.com/syndesisio/syndesis/master/app/deploy/support/serviceaccount-as-oauthclient-restricted.yml
```

Deploy syndesis using the following command, replacing "syndesis-dev-restricted" with "syndesis-restricted" depending on the template
you have just installed:

```bash
$ oc new-app syndesis-dev-restricted \
    -p ROUTE_HOSTNAME=syndesis.$(minishift ip).nip.io \
    -p OPENSHIFT_MASTER=$(oc whoami --show-server) \
    -p OPENSHIFT_PROJECT=$(oc project -q) \
    -p OPENSHIFT_OAUTH_CLIENT_SECRET=$(oc sa get-token syndesis-oauth-client)
```

Wait until all pods are running. You can either use OpenShift's intrinsic watch feature for a line-by-line update

```bash
$ oc get pods -w
```

or use `watch` for a more curses like full screen user interface:

```bash
$ watch oc get pods
```

You should now be able to open `https://syndesis.$(minishift ip).nip.io` in your browser.

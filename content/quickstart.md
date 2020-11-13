---
bref: ""
date: 2017-05-16T15:58:18+01:00
description: ""
draft: false
menu:
  sidenav:
    pre: <i class='fas fa-rocket'></i>
    weight: -200
sidebar: sidenav
title: "Quickstart"
toc: true
weight: 20
---

You can try out Syndesis very easily locally, too.
All you need is a [Minishift](https://www.openshift.org/minishift/) installation which is available for all the  major operating systems (Linux, OS X and Windows).
The following examples assume that you have Minishift installed and can be called with `minishift` from the command line. So, `minishift` is supposed to be available in your search path, i.e. located in a directory contained in your `$PATH` environment variable (Linux, macOS) or in a directory from your system path (Windows).

## Rocket launch

Follow the instructions on our QuickStart project https://github.com/syndesisio/syndesis-quickstarts/blob/master/README.md#syndesis-quickstarts

This will take some time until all images are downloaded and installed but eventually your browser should open with the landing page for Syndesis.

```
=====================================================================
SYNDESIS QUICKSTART

Hybrid integration on OpenShift made easy
=====================================================================

This install will reset your current MiniShift. OK to continue? y
--2019-03-20 08:42:12--  https://github.com/syndesisio/syndesis/archive/master.zip
Resolving github.com (github.com)... 192.30.253.113, 192.30.253.112

....
....
Sleeping 10s ...
syndesis-ui-1-kz5qx   0/1       Running   0         34s
syndesis-ui-1-kz5qx   1/1       Running   0         40s
syndesis-ui-1-deploy   0/1       Completed   0         46s
---------------------------------------------------------------------
Opening http://syndesis.192.168.64.56.nip.io
```

Here you will be first asked twice to add a security exception for Minishift's self-signed certificate. Please allow this exception:

![security exception](https://syndesis.io/images/security_exception.png)

Then you reach the OpenShift login mask asked to login. Just use "developer" / "developer" as credentials

![login](https://syndesis.io/images/login.png)

Finally you are asked to grant OpenShift permissions to this account which you should accept

![grant](https://syndesis.io/images/grant.png)

Et voilà, welcome in Syndesisland !

![syndesis](https://syndesis.io/images/landing_page.png)


## Using "syndesis" CLI tool

An alternative to the standard installation, you can also use the [syndesis script](https://github.com/syndesisio/syndesis/blob/master/tools/bin/syndesis) ([documentation](https://syndesis.io/docs/cli/syndesis/)).
This tool, which is also used for building Syndesis itself, provides many more options to tune the installation.
As it's a bash script it it mostly targeted to Unix users (Linux, macOS)

Go to the [releases page](https://github.com/syndesisio/syndesis/releases), choose the latest version, download the syndesis-cli.zip and unpack it in a new directory.

```bash
unzip syndesis-cli.zip -d ~/syndesis-cli
```

Now you have now two different ways available to install Syndesis:

* [syndesis minishift](https://syndesis.io/docs/cli/syndesis/#syndesis-minishift) for setting up a Minishift Syndesis installation like described above
* [syndesis install](https://syndesis.io/docs/cli/syndesis/#syndesis-install) for installing Syndesis to any OpenShift cluster.

Please refer to the [Syndesis Developer Handbook](https://doc.syndesis.io/#syndesis) (SDH) for all the details and possible options. You can always use `syndesis --help` for get an online help or `syndesis --man` to open the corresponding chapter in the SDH.

## Openshift Cluster

1. Login to the openshift cluster as an user with permission to create cluster objects

Use the "oc" openshift client to login to the openshift cluster
Example: 

```bash
oc login -u admin -p <password> https://<openshift api url>
```

2. Install syndesis

```bash
cd ~/syndesis-cli
```  

Install CRD and setup cluster objects

```bash
./syndesis install -s
```  
Grant permissions to admin user

```bash
./syndesis install -u admin
```

Install syndesis components and wait for them to be ready

```bash
./syndesis install -p syndesis --app-options " --addons jaeger" -w
```
See "syndesis install --help" for more information  

3. Access the syndesis application

Display the URL

```bash
echo "https://$(oc get routes syndesis --template "{{.spec.host}}")"
```

## Vanilla Minishift

Unfortunately, our scripts are currently not adapted for the Windows operating system.
Nevertheless Syndesis also runs on Windows Minishift instances.

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

Install all syndesis components with the syndesis-cli script.

```bash
syndesis minishift --install --nodev --deploy-latest --app-options " --addons jaeger"
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

## Let's run some QuickStarts!

You are now ready to run your first integration. We've prepared a bunch of QuickStarts to get you going. You can either import or build them from scratch with the accompanying instructions. Here is a link to the QuickStart repositories

https://github.com/syndesisio/syndesis-quickstarts/blob/master/README.md#lets-run-some-quickstarts

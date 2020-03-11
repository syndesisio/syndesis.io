---
draft: false
title: "Troubleshooting"
sidebar: "sidenav"
menu:
  sidenav:
    name: Troubleshooting
    weight: 1
    parent: "CLI - Command Line Interface"
toc: true
weight: 20
---

## Common Problems

When things go wrong, you want to try to identify the area that is
causing problems (UI, REST API, etc). If it’s the UI, look for errors in
the browser console or the terminal to see if it’s a dependency issue.

### UI Dependency Issues

```shell
$ rm -rf node_modules
$ yarn install
```

### Not getting latest API changes

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
$ syndesis minishift --full-reset --install -p syndesis --disk-size=60GB
```

### syndesis command not found
If you get `'syndesis' command not found` then use the full path to the `syndesis` binary instead. This assumes you are in the root of the project directory.

```shell
$ ./tools/bin/syndesis ${options}
```

### If OpenShift templates have been updated

This should not be the first choice, since it changes the IP of the VM, and in general should not be necessary for just building and updating the version.

```shell
$ syndesis minishift --full-reset --install -p syndesis --disk-size=60GB
```

### VM Trouble

```shell
$ syndesis build
```

### Pods self updating
Occasionally you can notice some syndesis pods
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

# Diagnostics

### Examining logs

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

### Enable the java debug agent on a pod

```
# to enable debug on an integration named "twilog"
$ oc set env `oc get dc -o name|grep twilog` JAVA_DEBUG=true

# to enable debug on syndesis-server
$ oc set env dc/syndesis-server JAVA_DEBUG=true
```

### Connect to postgresql database
You can use `psql` tool to connect to the postgresql database.

```
$ oc port-forward `oc get -o name pod -l syndesis.io/component=syndesis-db` 5432:5432
$ psql -U syndesis -h localhost syndesis
```

### nip.io domains are not working

Some DNS resolvers don't work properly with nip.io domains because they point to local IPs. You can fix this by adding those domains to your hosts file.

On Linux, this can be solved with something like:

```shell
IP=$(minishift ip)
echo "$IP    $IP.nip.io syndesis.$IP.nip.io docker-registry-default.$IP.nip.io" | sudo tee -a /etc/hosts;
```


### Syndesis behaves strangely/Complains of low space

Try to prune Minishift. More info on the [Day to Day command guide](/docs/day_to_day/).

# Still Having Trouble?

Ask on [Gitter](https://gitter.im/syndesisio/community)

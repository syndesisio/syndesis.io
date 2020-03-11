---
draft: false
title: "Maven Architecture"
sidebar: "sidenav"
menu:
  sidenav:
    name: Maven Architecture
    weight: 1
    parent: Architecture
toc: true
weight: 20
---

## Maven Groups

Syndesis uses [Maven](http://maven.apache.org/) as build tool. Maven
groups are used to separate the various Syndesis parts.

In details Syndesis consists of the following groups:

| Group           | Package                   | Docker Image               | Description                                                       |
| --------------- | ------------------------- | -------------------------- | ---------------------------------------------------------------   |
| **common**      | `io.syndesis.common`      |                            | Syndesis shared common module                                     |
| **connector**   | `io.syndesis.connector`   |                            | Supported connectors                                              |
| **dv**          | `io.syndesis.dv`          |                            | Tool that manages dynamic VDBs for the Teiid OpenShift Deployment.|
| **extension**   | `io.syndesis.extension`   |                            | Library and API for developing Syndesis extensions                |
| **integration** | `io.syndesis.integration` |                            | Library used in the the integration runtimes                      |
| **meta**        | `io.syndesis.meta`        | `syndesis/syndesis-meta`   | Service for connector meta-data and verification of connections   |
| **s2i**         | `io.syndesis.s2i`         | `syndesis/syndesis-s2i`    | S2I base image for building integrations                          |
| **server**      | `io.syndesis.server`      | `syndesis/syndesis-server` | Backend for storing integrations and REST endpoint to interact with `ui` |
| **ui**          | `io.syndesis.ui`          | `syndesis/syndesis-ui`     | User interface SPA, talking to the `server REST` backend endpoint |
| **test**        | `io.syndesis.test`        |                            | System tests for testing the whole applications                   |
| **ui-react**    |                           |                            | User Interface based on ReactJS                                   |

![Figure 1. Group dependencies](/images/syndesis-group-dependencies.png)

_Figure 1. Group dependencies_

### Naming Conventions

The following conventions are used for naming directories, modules and
Java packages.

<div class="alert alert-info admonition" role="alert"> <i class="fa
important"></i> These conventions are mandatory and should be forced for when doing pull request reviews.  </div>

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

<div class="alert alert-info admonition" role="alert"> <i class="fa
note"></i> Not every module has been already transformed to this scheme.
This will happen step-by-step. But for new groups and modules this
scheme has to be followed.  </div>


### Still Having Trouble?

Ask on [Gitter](https://gitter.im/syndesisio/community)

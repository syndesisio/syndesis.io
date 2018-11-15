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

# Maven Groups

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

**Group dependencies.**

![](images/syndesis-group-dependencies.png)

## Naming Conventions

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


# Issue Labels

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

## Groups

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

## Categories

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

## Pull Requests

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

## Notification

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
should be applied to help in triaging and priotizing.

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

## Status

Status labels are unique since they may trigger some automatic actions.

The current status labels
are:

| Status             | Description                                                                                                                                  |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- |
| **status/blocked** | The current issue is blocked by another issue. Refer to the issue itself to see what is blocking this issued. This label is purely informal. |



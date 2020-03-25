---
bref: ""
date: 2017-05-19T15:02:30+01:00
description: ""
draft: false
sidebar: sidenav
title: "Categorization"
weight: 20
toc: true
---


On this section we will explore how to contribute to the project with issues and pull requests.

## Issue Labels

We use [GitHub labels](https://github.com/syndesisio/syndesis/labels) to
categorize epics, issues and tasks. They are the foundation of our
process, so please use labels for issues.

<div class="alert alert-info admonition" role="alert"> <i class="fa
caution"></i> Labels are living entities. This document describes the
current status and might be slightly outdated. Please send a PR to adopt
this section if the label structure changes. Also feel free to discuss
the label structure anytime. It’s essential that labels describe our
process, not that we have to adapt our process for these labels.  </div>

Labels are grouped. Each label consists of two parts: A **Group** and a
**Name** which are separated by a slash (`/`). For example, the label
`module/ui` is used to mark issue which is relevant to the Syndesis UI
module.

The following label groups are available. There must be only at most one
label from the "Exclusive" groups.

| Group       | Description                                                                                                                        | Excl. |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------- | ----- |
| **cat/**    | Misc categories which can be added freely                                                                                          |       |
| **prio/**   | Priority of the issue. Only one `prio/` label must be added per issue. `prio/p0` is of highest priority, `prio/p2` the lowest one. | ✔︎     |
| **ext/**    | Reference to external projects                                                                                                     |       |
| **source/** | Where did the issue originate from (stakeholders)? i.e. `source/qe` indicates that QE raised this issue.                           |       |
| **group/**  | Internal Syndesis modules                                                                                                          |       |
| **notif/**  | Notification label which can be added and removed to ping certain subteams                                                         |       |
| **pr/**     | Labels which are only relevant for pull request and which have also some semantics for the bot managing pull requests              |       |
| **size/**   | Tee shirt size for issues. Sizing is a subjective assessment and should be done relative to other issues.                          | ✔︎     |
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
below `app/`.

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

The following labels are involved:

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
specific issue might have them relevance to them.

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
which is not part of the Syndesis mono repo.

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

The current status labels are:

| Status             | Description                                                                                                                                  |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- |
| **status/blocked** | The current issue is blocked by another issue. Refer to the issue itself to see what is blocking this issued. This label is purely informal. |

## Issue Management and Communication

With Github as the primary tool for logging and handling issues, it is
important to become proficient in utilising its interface and taking
advantage of the extra tools available.

### Displaying Issues

Issues can be displayed natively in Github by clicking the
[Issues](https://github.com/syndesisio/syndesis/issues) button at the
top of the [main repository
page](https://github.com/syndesisio/syndesis). This provides a list of
all the issues which can be filtered according to text, status etc.

Have a look at [how to find information in a
repostiory](https://help.github.com/en/github/managing-your-work-on-github/finding-information-in-a-repository)
on GitHub help. For example to show only issues that one is assigned to,
the filter `is:issue is:open assignee:@me` can be used.

Correspondingly, for pull requests pull requests awaiting ones review
can be found using `is:pr is:open review-requested:@me ` filter.

### Being Notified of Issues

Once assigned to the project, the registered email address should being
receiving notifications from Github concerning any modifications to any
issues. This can quickly fill an inbox so filtering these into their own
folder is recommended (a new developer can expect to see 50-100 per
day). Additional tools, like Octobox or the new GitHub Notifications
(currently in beta), are available for helping with managing these
notifications so please ask other project members if you are struggling
to handle them.

### Administering Issues

Issues are the bedrock of the project and provide the window into
understanding what each developer is currently working on. Therefore, it
is important to log issues, assign issues and provide comments to
issues. Github provides tools to connect issues and Pull Requests (PRs)
and even if the PR does not require an issue (rarely!) then it should be
possible to provide sufficient context in the PR that spells out its
nature and relevance.

Once assigned, an issue is your's to log as much detail as required to
portray any problems, difficulties or solutions. Should you need help
then Github provides syntax using the _@UserName_ syntax to prompt
other's to comment on the issue. Given the plethora of notifications
that developers receive on a daily basis, it is recommended to use this
syntax if you require additional input, since this sends additional
notifications specifically asking the developer concerned to comment. In
the event that you are unsure who to contact then it is not impolite to
include a number of _@UserNames_ in the issue and someone will respond
and either reply directly or in turn notify a person who can. Everyone
understands the importance of collaboration so speaking up is to be only
encouraged.

### Closing Issues

Development is about solving the issues and closing them down.
Therefore, closing issues is a good thing. Do not be afraid to close an
issue if the problem has been solved or indeed if the problem has gone
away on its own (yes this does happen!). In the event. that a code
change has occurred and a PR submitted then that PR will have been
reviewed by another developer. There may be a back-and-forth in comments
and requests for changes but finally the PR will be approved by the
reviewer. Once that happens, the PR will be automatically merged and
closed. If an issue is directly linked to the PR then that too will be
closed as well. Should this not be required then the issue can of course
be re-opened. Once the issue is closed then it is back to the dashboard
to find a new one!


### Still Having Trouble?

Ask on [Gitter](https://gitter.im/syndesisio/community)

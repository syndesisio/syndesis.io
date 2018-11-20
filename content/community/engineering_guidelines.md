---
bref: ""
date: 2017-05-19T15:02:30+01:00
description: ""
draft: false
menu:
  sidenav:
    parent: Community
    weight: -100
sidebar: sidenav
title: "Engineering Guidelines"
weight: 20
---

<div class="alert alert-info" role="alert">
  <strong>Heads up!</strong> This is a work in progress... and may always be... Please check back regularly.
</div>

The Syndesis maintainers are always looking for the optimum way to develop Syndesis. We aim to have a development process that enables fast delivery across all features and components, taking into account priorities from the community. Speed of development has to be balanced against total community ownership, knowledge sharing, and stability of the software. That is what this process aims to bring. We welcome feedback from anyone interested to help us streamline further.

## Discuss new feature in an issue before development

In order to get the best possible experience when adding a feature, it is best for us to gather information from various people with different skillsets (e.g. UX, UI, backend, business users, operations, etc.). This gives us the chance to discuss up-front, not waste of development time, and maximises the chance for the best a feature can be. This period should be concise and timely - [yak shaving](http://catb.org/jargon/html/Y/yak-shaving.html) and [bikeshedding](https://en.wiktionary.org/wiki/bikeshedding) should be openly called out.

## Features should be proposed as documentation in a pull request before development

As an alternative to or extension of the [guideline above]({{< relref "#discuss-new-feature-in-an-issue-before-development" >}}), we need to keep the Syndesis documentation up to date. To ensure that we have up to date documentation for a feature and to gain agreement that the approach is correct, we require a feature proposed in a PR that includes relevant design documentation. This should of course be kept up to date when changes are made to features - we know this is hard to do, and it is up to the Syndesis maintainers to guide this during PR reviews.

## Feature development should have relevant engineers assigned from the start

Features normally span more than one component. Having relevant people assigned to an issue from the start will hopefully gain more complete ownership from beginning to end. As an example, for a feature that adds new pages to the UI, it is expected that UX, UI, backend, QE, and docs would all be involved. Let's call these "feature miniteams". Miniteams are adhoc teams and people can be expected to be a member of multiple miniteams at one time.

## Every pull request must be linked to an issue

This allows discussion on the particular feature or bug in the issue before necessarily any coding takes place. This does not mean that there should only be one pull request for an issue.

## A pull request that closes an issue should be properly commented

If a pull request closes the issue, then it should properly be commented using the [GitHub keywords for closing issues](https://help.github.com/articles/closing-issues-via-commit-messages/)  (e.g. `fixes #53`) to ensure the issue is automatically closed when the PR is merged.

## A pull request that is related to an issue or should be commented properly

Using [zenhub.io](https://zenhub.io) allows us to link PRs to issues without necessarily closing the issue when the PR is merged. This works great if an issue requires changes to multiple repositories, with no single commit fully closing the issue, or if an issue requires staged development, one piece at a time contributed by various PRs.

## No pull request should be merged before review approval

Pretty self-explanatory: no self-merged PRs without prior approval from maintainers. Reviews are everyone's responsibility and should focus on tests and documentation as much as implementation.

However, it should taken care that the PR review process does not take too long as it is easy to get lost in the reviews:

* A PR which is marked as 'done' (i.e. not marked as 'work-in-progress') should be merged or rejected with 3 business days.
* There should be at most 2 review turnarounds (i.e. reviewer requests changes - author makes changes - reviewer request final changes - author makes changes - reviewer accepts / rejects). This is **not** a hard rule, more a reminder to keep PR reviews focused.
* If after 2 turnarounds there are outstanding review issues but the overall functionality is ok and the CI checks are successful, it should be considered to merge the PR and to create new GitHub issues for these extra review comments.
* Discuss only the content of the PR in the review, don't drift away and discuss issues not directly related with the PR. Instead open a new issue for anything which is discovered aside.
* A reviewer should be actively selected by the author immediately after creating the PR, e.g. asking on IRC or mailing list.

## A pull request should include respective tests for the referenced feature (e.g. E2E, unit, integration)

The QE team will be assisting with manual testing and, in addition, automate the tests we provide for Syndesis. Considering we only have a handful of QE engineers and an ever growing list of requirements, we will need to assist them by providing our own E2E and unit tests when applicable and possible. This will help us get closer to maximum test coverage with more realistic expectations and is more efficient (as we will “know” and understand our code better from the get go) on a per-iteration basis.

## Development Workflow

We are using [ZenHub](https://www.zenhub.com/) for project management. 
ZenHub has some advantages over plain GitHub projects (like a view across selectable repositories from various organisations) 
The entry point is our [Syndesis Board](https://github.com/syndesisio/syndesis-project#boards?epics:settings=epicsOnly) for planning and progress tracking, however not for velocity tracking (yet).

### Scenarios, Epics, Tasks

The central entity in ZenHub is an _Epic_.
An Epic is not much more than a GitHub issue with the label "Epic" attached. 
In Scrum such an Epic is known as a "User Story".
Each Epic references one or more _Tasks_.
A Task is a simple GitHub issue linked to an Epic (but without a specific label).

But what about epics as known from Scrum ? 
Since ZenHub Epics are reserved for user stories, we introduced a label "Scenario" which can be attached to an Epic to mark it as a bigger story, which needs to be broken down in simple Epics.
Epics which originate from a _Scenario_ are linked back to this Scenario.
Scenarios only play a role in the planning to cut out Epics.
There is no work done directly on Scenarios.

Agreed, _that_ is confusing on first sight.So lets summarizes the relationships and clarify this structure a bit:


| Scrum | ZenHub | GitHub | Description |
| ----- | ------ | ------ | ----------- |
| Epic  | Scenario | Issue with "Epic" and "Scenario" label | High-Level story which need to be broken down into smaller Epics |
| User Story | Epic | Issue with "Epic" label | A user story describing a feature which adds business value |
| Task | Task | Issue linked to an Epic | Tasks about UX, UI, backend, ... to complete a Epic |

As a general rule of thumb: Each Task is associated with an Epic. 

However, there are certain GitHub issue which are neither Task nor Epic and are used for special purpose:

* **Retro Action Item** for tasks resulting as action items from a retrospective
* **Refactoring** for internal optimization task which do not have a direct business value (and hence can not be connected to an Epic)

The [Syndesis Board](https://github.com/syndesisio/syndesis-project#boards) is a Kanban like board with multiple columns:

| Column | Description |
| ------ | ----------- |
| New Issues | New issues which has not been evaluated |
| Backlog | Prioritized list of Epics to work on next |
| Running Epics | Epics which are worked on |
| Design Proposal Tasks | Tasks for creating design proposals |
| In Progress Tasks | Tasks which are worked on |
| Epics Done | Epics which has been finished|

![ZenHub columns](../../images/zenhub-columns.png)
### Syndesis ZenHub Flow

This section explains how the process setup described above is applied to the Syndesis project.
Syndesis itself consists of many GitHub Repos, the most important are:

| Repo | Description |
| ---- | ----------- |
| [syndesis-project](https://github.com/syndesisio/syndesis-project) | Codeless repo for project management |
| [syndesis-ui](https://github.com/syndesisio/syndesis-ui) | Angular based user interface | 
| [syndesis-rest](https://github.com/syndesisio/syndesis-rest) | REST services, serving syndesis-ui |
| [syndesis-ux](https://github.com/syndesisio/syndesis-ux) | User experience designs | 
| [syndesis-openshift-templates](https://github.com/syndesisio/syndesis-openshift-templates) | OpenShift templates for deploying Syndesis |
| [syndesis-verifier](https://github.com/syndesisio/syndesis-verifier) | Backend verification micro service |

All of these repos have their own area for GitHub issues and maybe own GitHub project boards, but they are linked together.

Syndesis uses a three week long beat (or "sprint" in short, although not a 'classical' Scrum sprint in the strict sense).
In the beginning is a planning meeting where product management provides the Epics and the team decides the scope for the following three weeks.
Each Epic chosen is moved to column "Backlog", with the higher priority stories at top and has a milestone for this spring attached.

As soon as work starts on an Epic it is moved from "Backlog" to "Running Epics".
The first thing is to create a design proposal Task in the "Design Proposal Tasks" column and linked it to the Epic.

The initial draft of the design proposal, which is a document in syndesis-project [`proposals/`](https://github.com/syndesisio/syndesis-project/tree/master/proposals) in Markdown format, should be submitted as a PR quickly so that people can review and discuss on it. 

Parallel and as a result of the overall discussion, work on the UX design can be started in [syndesis-ux](https://github.com/syndesisio/syndesis-ux). 
For this a Task is created in syndesis-ux and linked to the Epic in syndesis-project.
The UX design reviews itself work similar by creating a PR associated with this Task.
This Task is moved to column "In Progress Tasks"

When the design proposal is finished and the UX design is accepted (which means that the PRs are merged), then Tasks for UI and Backend are created (plus in any other repository required).
These Tasks are connected directly to the original Epic and moved to column "In Progress Tasks".
Work on those Tasks result in associated PRs which are reviewed and eventually merged.
If the tasks are clear from the Epic and Design proposal descriptions, then no extra Task issue needs to be created, which wouldn't add any extra information.
Instead the PR can be connected directly to the Epic and moved to the "In Progress Tasks".

When every Task associated with an Epic is done, the Epic issue is closed moved from "Running Epics" to "Epics Done".

### Some general rules

Following a set of rules which should be followed. But every rule has exceptions, which is ok, if there is a valid reason for.

* For each Epic a "design proposal" has to be written.
* Epics live in `syndesis-project` only.
* Every Task is connected to an Epic.
* Every Task will eventually result in a connected Pull Request (PR) _within the same repo_.
* It is allowed to have PRs connected directly to the Epic.
* Review and discussion will happen on the PR.
* When the PR gets merged, the task is closed and done.
* When all tasks of an epic are done, the epic is done.

Beside this, you are free to cross link dependencies across repos as ZenHub dependencies (e.g. when a Task in syndesis-ui depends on a design in syndesis-ux to be finished)

### Process FAQ

* **How get I quick overview of all epics for a certain Sprint ?**
  On the [Syndesis Board](https://github.com/syndesisio/syndesis-project#boards), select all repos by pushing "Show all". Then apply a milestone filter for the current sprint and within the Epics menu select "Show all epics and hide subtasks".

* **How can I find all tasks for a certain Epic quickly ?**
  On the [Syndesis Board](https://github.com/syndesisio/syndesis-project#boards) select the "Epics" tool menu and use the text search box to narrow down to epic you are looking for. Don't forget to enable all repositories with the "Show all" toolbar button.

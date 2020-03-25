---
bref: ""
date: 2017-05-19T15:02:30+01:00
description: ""
draft: false
title: "Engineering Guidelines"
weight: 30
toc: true
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

## Commit messages should follow the Conventional Commits standardized commit message format

This allows for automated changelog generation. Recommended tooling includes [Commitizen](https://github.com/commitizen/cz-cli) to make get the format correct rather than hand crafting. Commits should be linted in future in CI but aren't just yet... coming soon! See [Conventional Commits](http://conventionalcommits.org/) for details on the commit format.

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


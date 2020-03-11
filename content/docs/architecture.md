---
bref: ""
description: ""
draft: false
menu:
  sidenav:
    weight: -200
    name: Architecture
    identifier: Architecture
    parent: "Developer Docs"
sidebar: sidenav
title: "Architecture"
toc: true
weight: 20
---

This document want to illustrates at high level some of the components that makes up Syndesis and how they are communicating together to finally serves the creation of an integration. We are using [Apache Camel](https://camel.apache.org/) as a runtime target, though it would be possible to extend the project and makes it suitable to any other integration platform.

**Disclaimer:** the content illustrated here is related to version 1.8, it can change in future versions.

### Diagram
Before deep dive in the diagram illustration, let's recap the list of main components involved in Syndesis:

* **UI**: component dedicated to serve the user interface
* **Server**: mainly used for storing information persistently and retrieving its content from UI
* **JSonDB**: a database where we store json formatted documents
* **Meta**: used to report specific information of each connector
* **Connector**: acts as a proxy between Syndesis and integration platform
* **Integration**: generate an integration project based on the integration platform template
* **S2I**: used to create a runtime where the integration will run

Here is a bottom up view (from integration platform to UI) of Syndesis. As the aim of the document is to highlight the backend components we feel it more natural to start the dissertation from the target integration runtime.

![diagram](/images/syndesis_be_architecture.png)

_Figure 1. Backend architecture_

When you want to create an integration, you generally starts with the definition of how this integration will interact with the integration platform runtime. In Syndesis this is mediated by the _ComponentProxy_ whose goal is to decouple the Syndesis specific model from the integration platform. Through the development of a _Connector_ you will therefore be able to bring your integration platform functionality in Syndesis: in the case depicted you will be able to port any Camel component into Syndesis by developing a _Connector_. The whole list of connectors will be finally your list of available sources/destination that you will be able to use in your Syndesis installation.

A _ProjectGenerator_ is using the list of connectors and is built by the _S2I_ whose result is a *Dockerized* _IntegrationRuntime_. The runtime contains all the dependencies that any integration running upon it will be needing. For this reason the idea is to bundle together at this stage a docker image that will be used as extension point by the real integration that you will define later on: in our case the integration generated is a _Spring Boot_ application that will be kicked off in a container: everything completely transparent to the final user!

The user will finally interact to the system through a UI that will use a RESTful API (_Server_) to expose properly the feature. All is read/stored to a document based database (_JsonDB_) and any possible special feature needed by some connector is bridged by the _Meta_ component that is queried by the _Server_, again, through a RESTful API.
### Consideration
The discussion provided in this document is leaving other details (such as deployment, logging, authorization, ...) on purpose as it wants to be a first and quick approach to the architecture behind Syndesis.

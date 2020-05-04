---
draft: false
title: "Syndesis Architecture"
toc: true
weight: 40
---

This document illustrates at high level the core components of Syndesis and how they communicate together to serve integrations. 


<div class="alert alert-info" role="alert">
  <strong>Heads up!</strong> 
The discussion provided in this document is leaving many details and additional components on purpose as it wants to be a high level approach to the architecture behind Syndesis.
</div>

## Overview

Syndesis is composed by several components that are deployed automatically by the **operator** component. To install Syndesis, you just have to deploy an instance of the operator which will take care of deploying the rest of the components and make sure there is always one healthy instance up. The operator version will be determining the version of Syndesis you are deploying.

![diagram](/images/architecture_basic_structure.png)

_Figure 1. Overview of the architecture_

### Components

Let's recap the list of main components involved in Syndesis:

* **UI**: component dedicated to serve the user interface
* **Server**: orchestrates the interaction between components and provides an API to the UI
* **DataBase**: stores configuration regarding configuration, connections and integrations
* **Meta**: reports specific information of each connector
* **S2I**: creates runtimes where the integrations will run

## Basic Workflow

Here is a bottom up view of how an integration is created on Syndesis. 

### Creating an Integration

The user will interact to the system through the **UI** that will use the REST API of the **Server** to create the integration. All the data regarding that integration is stored on a PostgreSQL **Database**. Any possible special feature needed by some connector is bridged by the **Meta** component that is queried by the **Server**, again, through another REST API.

![diagram](/images/syndesis_be_architecture.png)

_Figure 2. Backend architecture_

### Integration Runtime

There is a *Project Generator*, built by the **S2I** component, whose output is a *Dockerized* *Integration Runtime* used by all our integrations. This runtime contains all the dependencies that the integration will be needing. It bundles together a docker image that will be used as extension point by the final defined integration.

In our case the integration generated is a *Spring Boot* application that will be kicked off in a container: everything completely transparent to the final user!

#### Apache Camel

By default, Syndesis uses [Apache Camel](https://camel.apache.org/) as a runtime target, though it would be possible to extend the project and use any other similar integration platform. Both Camel and Camel-k are supported.

### Custom Connectors

When you need a new type of connection, you generally start by defining how this connection will interact with the Integration Runtime (Apache Camel by default). In Syndesis this is mediated by the *ComponentProxy* whose goal is to decouple the Syndesis specific model from the integration platform. 

Through the development of a *Connector* you will be able to bring your integration platform functionality in Syndesis. For example, you will be able to port any Camel component into Syndesis by developing a wrapper that acts as *Connector* inside Syndesis. 

You can find more information about Connectors and how to implement them on the [Connectors section](/docs/connectors/whatis/).

The whole list of connectors will be your list of available sources/destination that you will be able to use in your Syndesis integration.


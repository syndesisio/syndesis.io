---
draft: false
title: "Syndesis connectors development"
sidebar: "sidenav"
menu:
  sidenav:
    name: Connectors development
    weight: 3
    parent: Developer Docs
toc: true
weight: 20
---

One of the most important features of Syndesis is to be able to connect to a variety of sources and destinations. The middleware developed is going to take care of transparently of the integration to such source/destination of data requiring a custom development of the specific transport involved in the chosen component.

Since Apache Camel is providing a large [offering of integrations components](https://camel.apache.org/components.html), Syndesis does offer the possibility to use them thanks to a proxy component whose goal is to identify the component and provide the correct configuration settings to make them available through the user interface.

### Tutorial
We will use as a reference the development of a connector for MongoDB and we will try to show explicitly all the configuration and development you will have to perform in order to develop your own connector.

If you haven’t done yet, fork the syndesis project, check it out locally and familiarize with its structure. Also you may want to read the [engineering guidelines](https://syndesis.io/community/contributing/#1-fork-the-repository) before starting to work on it.
### Camel upstream component
The first thing you will have to do is to have a look at the list of camel components provided in the introduction. Fortunately there is quite a lot of components available, so you should be lucky as in the example I’m going to show for [MongoDB](https://camel.apache.org/mongodb.html).

If by any chance you are out of luck and the component is not available, well, it is a good opportunity to contribute by [developing the component yourself](http://oscerd.github.io/2016/07/06/contributing-camel-components/). 

First thing to do is to familiarize with the URI structure that the component is going to use in camel. For the MongoDB example this is a typical example:

    mongodb:connectionBean?database=databaseName&collection=collectionName&operation=operationName[&moreOptions...]

The most important thing you have to check is the protocol. In this example is “mongodb”, so, make sure to take note of that one as it will be the way to configure and identify the component on the Camel catalog from now onward.
Also it is quite important for you to identify which are the parameters used, in particular the mandatory ones and which are needed for producer or for consumer purpose and their type: typically they are text representing a configuration, but in some circumstances they may represent more complex java objects such as a Datasource or a connection bean of some sort.

I would even suggest to make some experiment and test directly on the upstream component in order to familiarize with the component itself. Finally, your goal is to integrate on Syndesis, but this will end up in a Camel route deployed (probably to a container), so, you better know what to expect there. There are [endless example you can run](https://github.com/apache/camel/tree/master/examples), so you will be easily find the one for your component too.

At this stage we should have enough clarity on what our component does, which is the expected URI structure and the expected configuration settings.
###### Changes in existing camel components
If you are going to make any changes to the existing camel components, in order to be able to use them properly make sure to bring the correct version and to rebuild the `camel-catalog` dependency. This one is used at runtime by Syndesis to read configuration information such as the expected parameters, so, any change must be reflected by refreshing this dependency as well.
### Maven project structure
As there is not yet an archetype available, we need to make some manual `pom.xml` configuration in order to prepare our project. In order to maintain the original structure of the project you will have to create a connector folder under the `app/connector` directory. In order to maintain the convention, call it `connector-nameOfComponent` (ie, `connector-mongodb`).

Next step is to create the minimum viable pom in order to be able to wrap all the needed dependencies for our connector.
###### Connector description
Almost all related to the project is managed by the connector parent pom. So, you just have to provide the name of this new dependency:

    <?xml version="1.0" encoding="UTF-8"?>
    <!-- Copyright (C) 2016 Red Hat, Inc. Licensed under the Apache ...-->
    <project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
        <parent>
            <groupId>io.syndesis.connector</groupId>
            <artifactId>connector-parent</artifactId>
            <version>1.7-SNAPSHOT</version>
            <relativePath>../pom.xml</relativePath>
        </parent>
    
        <modelVersion>4.0.0</modelVersion>
        <artifactId>connector-mongodb</artifactId>
        <name>Connector :: MongoDB</name>
        <packaging>jar</packaging>

You will have to change the version and name of your connector accordingly. 
###### Dependencies
Next section is related to the dependencies. You can start with the basic ones and then iteratively adding the ones needed by your development:

        <dependencies>
            <dependency>
                <groupId>org.apache.camel</groupId>
                <artifactId>camel-core</artifactId>
            </dependency>
            <dependency>
                <groupId>io.syndesis.common</groupId>
                <artifactId>common-model</artifactId>
                <scope>provided</scope>
            </dependency>
            <dependency>
                <groupId>org.slf4j</groupId>
                <artifactId>slf4j-api</artifactId>
            </dependency>
            <dependency>
                <groupId>io.syndesis.integration</groupId>
                <artifactId>integration-component-proxy</artifactId>
            </dependency>
            <dependency>
                <groupId>com.fasterxml.jackson.core</groupId>
                <artifactId>jackson-databind</artifactId>
            </dependency>
            <dependency>
                <groupId>org.mongodb</groupId>
                <artifactId>mongo-java-driver</artifactId>
            </dependency>

Of course you can skip the `mongodb` related dependencies in your development.
We also want to include the testing dependencies that will help us in setting up all the unit test we will need:

            <!-- Testing -->
            <dependency>
                <groupId>junit</groupId>
                <artifactId>junit</artifactId>
                <scope>test</scope>
            </dependency>        
            <dependency>
                <groupId>org.apache.camel</groupId>
                <artifactId>camel-test</artifactId>
                <scope>test</scope>
            </dependency>
            <dependency>
                <groupId>org.assertj</groupId>
                <artifactId>assertj-core</artifactId>
                <scope>test</scope>
            </dependency>
            <dependency>
                <groupId>io.syndesis.connector</groupId>
                <artifactId>connector-support-test</artifactId>
                <scope>test</scope>
            </dependency>
            <dependency>
                <groupId>com.github.spotbugs</groupId>
                <artifactId>spotbugs-annotations</artifactId>
                <scope>test</scope>
            </dependency>
            <dependency>
                <groupId>org.hibernate.validator</groupId>
                <artifactId>hibernate-validator</artifactId>
                <scope>test</scope>
            </dependency>
            <dependency>
                <groupId>org.glassfish</groupId>
                <artifactId>javax.el</artifactId>
                <scope>test</scope>
            </dependency>
            <dependency>
                <groupId>ch.qos.logback</groupId>
                <artifactId>logback-classic</artifactId>
                <scope>test</scope>
            </dependency>
            <dependency>
                <groupId>org.apache.camel</groupId>
                <artifactId>camel-mongodb3</artifactId>
                <scope>runtime</scope>
            </dependency>
            <dependency>
                <groupId>de.flapdoodle.embed</groupId>
                <artifactId>de.flapdoodle.embed.mongo</artifactId>
                <scope>test</scope>
            </dependency>
            <!-- Analyzer is requiring to explicit this dependency -->
            <dependency>
                <groupId>de.flapdoodle.embed</groupId>
                <artifactId>de.flapdoodle.embed.process</artifactId>
                <version>1.50.2</version>
                <scope>test</scope>
            </dependency>
        </dependencies>

The last three dependencies are specific to this sample development, the rest is needed by any generic test case. Please notice that in our first development we scope `camel-mongodb3` dependency as runtime: this is because during the first development we won’t make explicit use of this dependency, only the unit test and finally the integration will do that.
###### Plugins
The last part of the pom is related to the plugins configuration:

        <build>
            <resources>
                <resource>
                    <directory>src/main/resources</directory>
                    <filtering>true</filtering>
                </resource>
            </resources>
    
            <plugins>
                <plugin>
                    <artifactId>maven-resources-plugin</artifactId>
                    <configuration>
                        <delimiters>
                            <delimiter>@</delimiter>
                        </delimiters>
                    </configuration>
                </plugin>
    
                <plugin>
                    <groupId>io.syndesis.connector</groupId>
                    <artifactId>connector-support-maven-plugin</artifactId>
                    <executions>
                        <execution>
                            <id>inspections</id>
                            <phase>process-classes</phase>
                            <goals>
                                <goal>generate-connector-inspections</goal>
                            </goals>
                        </execution>
                    </executions>
                </plugin>
            </plugins>
        </build>
    </project>

You can make an exact copy of this part as we are introducing a utility that will help you setting up a descriptor configuration file through the execution of the phase highlighted in the code above.

At this stage you can set up your IDE in order to get the maven project and also execute `mvn install` to confirm that the structure of the project is fine (although empty).
###### Syndesis CLI
We will make use of `mvn` directly in order to see all low level details but there is a cool [CLI for Syndesis](https://syndesis.io/docs/cli/) project with more advanced features that you may get familiarity with during your Syndesis development.
### JSON Schema definition
Now that you have a valid maven structure you will have to define the descriptor information that describes your connector. The whole explanation of all the parameters is provided in a [dedicated document](https://access.redhat.com/documentation/en-us/red_hat_fuse/7.3/html-single/integrating_applications_with_fuse_online/index#about-extension-definitions_extensions). In the first iteration we will use just a few of them.

The connector support plugin mentioned in the previous chapter is going to take care of validating the structure of such descriptor that is expected to be found at `/META-INF/syndesis/connector` directory. Also recall the URI scheme of the component and create a json empty file named after it (in our example, `mongodb.json`).

    $ mkdir -p src/main/resources/META-INF/syndesis/connector
    $ touch src/main/resources/META-INF/syndesis/connector/mongodb.json

Let’s run now the validation and, since the descriptor is still empty, let’s expect an error too!

    $ mvn process-classes
    ….
    [ERROR] Failed to execute goal io.syndesis.connector:connector-support-maven-plugin:1.7-SNAPSHOT:generate-connector-inspections (inspections) on project connector-mongodb: Execution inspections of goal io.syndesis.connector:connector-support-maven-plugin:1.7-SNAPSHOT:generate-connector-inspections failed: unhandled token type NOT_AVAILABLE -> [Help 1]

No fear. The plugin is your friend and is there to drive you through the correct development of the connector notifying any configuration error. We are going to fix in a minute.
#### Basic descriptor
The goal of the descriptor is to provide to Syndesis enough information on which are the expected parameters that are needed by the upstream component in order to create a route and be able to properly create endpoints with such configuration.
Here you have to retake the analysis you did when you selected your components and recall all those options required and the one you want to provide in order to customize in on Syndesis. I will split the configuration to ease the explanation:

    {
      "description": "Mongo DB connector.",
      "icon": "data:image/svg+xml;base64,aFancyBase64CodeHere!![...see Appendix A]",
      "id": "mongodb",
      "name": "MongoDB",
      "properties": {
        "host": {
          "componentProperty": true,
          "deprecated": false,
          "displayName": "Database host",
          "group": "common",
          "javaType": "java.lang.String",
          "kind": "property",
          "label": "",
          "labelHint": "Database host.",
          "order": "1",
          "required": true,
          "secret": false,
          "tags": [],
          "type": "string"
        }
      },

This first part describes the information such as a name you want to assign to this connector and the possibility to include an icon embedded as base64. An important part to understand is represented by the properties that represent which are the common configuration expected by this component. In general you may expect here to have information on how to connect to a certain datasource: in my example I just need to identify the host where the database is located, assuming the default port and public access to the db. In a second iteration I will add those properties there as well.

      "actions": [
        {
          "actionType": "connector",
          "description": "Mongo DB producer",
          "descriptor": {
            "componentScheme": "mongodb",     
            "inputDataShape": {
              "kind": "json-schema"
            },
            "outputDataShape": {
              "kind": "json-schema"
            }
          },
          "id": "io.syndesis.connector:connector-mongodb-producer",
          "name": "Mongo DB producer",
          "pattern": "To",
          "propertyDefinitionSteps": [
              {
                "description": "Enter a database.",
                "name": "Database",
                "properties": {
                  "database": {
                    "deprecated": false,
                    "displayName": "Database name",
                    "group": "common",
                    "javaType": "java.lang.String",
                    "kind": "path",
                    "labelHint": "Database name",
                    "placeholder": "database",
                    "required": true,
                    "secret": false,
                    "type": "string"
                  },
                  "collection": {
                    "deprecated": false,
    ...
                    "type": "string"
                  },
                  "operation": {
                    "deprecated": false,
    ...
                    "type": "string"
                  }              
                }
            }    
            ]
        }    
      ],

The second part of the descriptor is where we introduce to provide the expected behavior of our component. We can define “actions” that are going to be performed over the connection according to the pattern specified (mainly `From` for a consumer and `To` for a producer type - also `Pipe` exists and can be configured).

Here we just want to use the connector as a producer of data in order to perform certain operations as final result of a route. As an example, we want to get data from a certain source (a sql db, your twitter mentions, …) and write to a mongoDB database and collection.

In order to perform such operation I need to know the following 3 parameters: `database`, `collection` and `operation`. Therefore in the `propertiesDefinitionStep` we include them. The runtime result will be that we’re going to be prompted from the GUI to provide those configuration every time that we’ll create a new integration on Syndesis.

      "dependencies": [
        {
          "id": "@project.groupId@:@project.artifactId@:@project.version@",
          "type": "MAVEN"
        }
      ]
    }

The last part of the descriptor is used to declare maven dependencies. The above one should work from most of the case if the development conventions are respected.
### Unit test preparation
At this stage we have our connector, so, we can even try to include in Syndesis bundle, deploy and make a real integration. However, a better strategy is to make some unit test in order to verify that our integration is not going to fail and to serve as regression for the future.

There is a class you have to extend in order to benefit all the environment provided by Syndesis and Camel and just worry about making your testsuite: [io.syndesis.connector.support.test.ConnectorTestSupport](https://github.com/syndesisio/syndesis/blob/master/app/connector/support/test/src/main/java/io/syndesis/connector/support/test/ConnectorTestSupport.java) that is extending the upstream Camel supporting test class [org.apache.camel.test.junit4.CamelTestSupport](https://github.com/apache/camel/blob/master/components/camel-test/src/main/java/org/apache/camel/test/junit4/CamelTestSupport.java).

As far as you progress with the development of your test suit you will be able to discover all the features offered by these 2 classes. For the first iteration you will have to just provide the implementation of an abstract method that would take care of building the final route (involving your connector too!). Here is a simple test for the MongoDB:

    @Override
    protected List<Step> createSteps() {
        return Arrays.asList(
                newSimpleEndpointStep("direct", builder -> builder.putConfiguredProperty("name", "start")),
                newEndpointStep("mongodb", "io.syndesis.connector:connector-mongodb-producer",
                    builder -> {},
                    builder -> {
                        builder.putConfiguredProperty("connectionBean", "connectionBeanContextRef");
                        builder.putConfiguredProperty("database", DATABASE);
                        builder.putConfiguredProperty("collection", COLLECTION);
                        builder.putConfiguredProperty("operation", "insert");
                    })
                );
    }
The mother class will use this method in order to build a route that would consume from a [direct component](https://camel.apache.org/direct.html) named start and produce to the mongodb component through the usage of the connector we’ve just created. Please notice that we are configuring a connector endpoint with the identification provided in the json descriptor and passing the map of parameters expected by the implementation: `database`, `collection` and `operation` (this component expect a further one named `connectionBean`, we’ll come back to this in a while).

The last step is to provide the test case, here one as a reference:

    @Test
    public void mongoInsertTest() {
        // When
        // Given
        String uniqueId = UUID.randomUUID().toString();
        String message = String.format("{\"test\":\"unit\",\"uniqueId\":\"%s\"}", uniqueId);
        template().sendBody("direct:start", message);
        // Then
        List<Document> docsFound = collection.find(Filters.eq("uniqueId", uniqueId)).into(new ArrayList<Document>());
        assertEquals(1, docsFound.size());
    }

In order to kick off the integration we will use the `template()` method offered by the super class, providing as a body a simple json text with a unique field in it. We do expect that the route configured above would use the insert operation to write this json into the database and the collection specified.
As a simple assert condition we verify that the content of a json field corresponds to the one that the same test has produced.

In your development you may use a similar strategy when you need to produce some data to your connector and an approach with [Mock component](http://camel.apache.org/mock.html) when you need to consume data from your connector.
###### Connection Bean
To have a complete test you will need the possibility to either mock the service that is providing the connection to your component or a real instance of it. In the example it translates into a real instance of MongoDB to connect to (or an embedded instance of a MongoDB).

Depending on the component you’re going to use you may expect to create some sort of connection on demand or to pass it through properties or context configuration. In the example proposed here, the component is expecting a connection bean to be available in Camel Context:
    
    @Override
    public void postProcessTest() {
        MongoClient mongoClient = new MongoClient("localhost");
        context().getRegistry(JndiRegistry.class).bind("mongoConnection", mongoClient);
    }

The method used here is inherited from the `CamelTestSupport` class and it’s called as soon a context has been created. What we’re doing is to wire a bean with a reference that will be looked up at runtime by the `camel-mongodb3` component.
### Customization development
The goal of this first part of the tutorial is to show how to possibly make an integration without adding any customization or further functionality to the upstream component. There may be certain connector that would not require anything else and they would work just setting the proper configuration through the descriptor and defining the proper actions.

However we do expect some sort of customization almost always because we likely have to deal with connection configuration as our components are typically bound to services responding to certain protocols.
As an example, the development done so far would work only for test because it expects such a connection bean injected before to execute the integration. This is a typical use case that call out for a custom connector integration.

We will see two different approaches when you want to perform a connector customization taking as a reference the need to configure directly in the connector a connection bean.

As soon as you start the customization you may need to change the scope of the camel component in your maven configuration to be available at compile time (remind, at the beginning we scoped `camel-mongodb3` as runtime).
##### Customizer
The connector proxy development expected by Syndesis has taken in consideration the possibility to include any customization during the lifecycle of the connector action you’ve configured. Recall the configuration we’ve provided above: here we can introduce a new variable named connectorCustomizers whose goal is to enrich the behavior of the connector when that is created:

    {
      "actions": [
        {
          "actionType": "connector",
          "description": "Mongo DB to",
          "descriptor": {
            "componentScheme": "mongodb",
            "connectorCustomizers": [
              "io.syndesis.connector.mongo.MongoCustomizer"
            ],        
    ...
          "id": "io.syndesis.connector:connector-mongodb-to",
          "name": "Mongo to",
          "pattern": "To"
        }

What Syndesis connector is expecting there is an implementation of the [io.syndesis.integration.component.proxy.ComponentProxyCustomizer](https://github.com/syndesisio/syndesis/blob/master/app/integration/component-proxy/src/main/java/io/syndesis/integration/component/proxy/ComponentProxyCustomizer.java) functional interface. Let’s illustrate it through the example:

    public class MongoCustomizer implements ComponentProxyCustomizer, CamelContextAware {
        private CamelContext camelContext;
    ...
        @Override
        public void customize(ComponentProxyComponent component, Map<String, Object> options) {
            if (!options.containsKey("connectionBean")) {
                try {
                    String host = (String) options.get("host");
                    MongoClient mongoClient = new MongoClient(host);
                     options.put("mongoConnection", mongoClient);
                } catch (@SuppressWarnings("PMD.AvoidCatchingGenericException") Exception e) {
                    throw new IllegalArgumentException(e);
                }
            }
        }

The customize method is the one that will take care to get information on the `host` (provided as a connection parameter of your connector json!), create a connection and inject the connection into the bean reference expected by the component.

Typically you will have to provide a similar implementation in order to set up the proper connection settings or if by any chance you need to transform the parameters passed by your user in something else.

One thing you may notice is that in this example we’ve implemented the `CamelContextAware` interface whose goal is to wire the runtime Camel context into this class and make it available for anything you may need to do with it. This is something you may not need to do.

As soon as this change is applied we can change the test case removing the context injection and setting the host in the properties passed into the connector:

    ...
    builder -> {
        builder.putConfiguredProperty("connectionBean", "connectionBeanContextRef");
    builder.putConfiguredProperty("host", “localhost”);
        builder.putConfiguredProperty("database", DATABASE);
    ...

This is now ready to be tested in a real Syndesis integration!
###### Multiple connector customizer
We’ve described how to use a connector customizer specific of a certain action. It means that if you have several actions using the same connection customizer you should copy the same configuration in all the actions. In order to prevent this you can configure this behavior on the generic connector configuration and even have more than one customizer at a time. As an example here you can see a configuration where we defined a specific operation customizer and a generic connector customizer:

    {
      "actions": [
        {
    ...
            "connectorCustomizers": [
              "io.syndesis.connector.mongo.MongoOperationCustomizer"
            ],        
    ...
          "pattern": "From"
        }    
      ],
      "configuredProperties": {},
      "connectorCustomizers": [
        "io.syndesis.connector.mongo.MongoClientCustomizer"
      ],   
      "description": "Mongo DB connector.",
    ...
    }

You can notice the presence of two different customizer that can work together to customize either a general behavior or a specific one bound to an action.
##### ComponentDelegate
A second approach to customization is possible through the definition of a component delegate, whose goal is to have a more advanced control on the whole lifecycle of the component itself thanks to the presence of a series of customizable methods.

Let’s retake the first json descriptor and let’s add a new parameter:

    {
      "description": "Mongo DB connector.",
      "connectorFactory": "io.syndesis.connector.mongo.MongoConnectorFactory",
      "icon": "data:image/svg+xml;base64,aFancyBase64CodeHere!![...]",
      "id": "mongodb",
    …

With this configuration we’re telling Syndesis connector manager to call this component factory (which implements [ComponentProxyFactory](https://github.com/syndesisio/syndesis/blob/master/app/integration/component-proxy/src/main/java/io/syndesis/integration/component/proxy/ComponentProxyFactory.java)) whenever it has to create a new connector:

    public class MongoConnectorFactory implements ComponentProxyFactory{
        @Override
        public ComponentProxyComponent newInstance(String componentId, String componentScheme) {
            return new MongoConnector(componentId,componentScheme);
        }
    }

The real logic is actually developed from the connector class that have to extend the [ComponentProxyComponent](https://github.com/syndesisio/syndesis/blob/master/app/integration/component-proxy/src/main/java/io/syndesis/integration/component/proxy/ComponentProxyComponent.java) class whose goal is to provide the integration with the camel component. If you don’t specify any customization, this default class is the one that will be used behind the scene by Syndesis connector.

Let’s see through an example how we can perform the customization needed by our component (ie providing a connection bean available at runtime):

    @SuppressWarnings("PMD.SignatureDeclareThrowsException")
    @Override
    protected Map<String, String> buildEndpointOptions(String remaining, Map<String, Object> options) throws Exception {
        if(this.getCamelContext().getRegistry().lookup(remaining) == null){
            String host = (String) options.get("host");
           MongoClient mongoClient = new MongoClient(host);
            options.put("mongoConnection", mongoClient);
        }
        return super.buildEndpointOptions(remaining, options);
    }

The typical workflow however would expect to either create a complete new delegate component by extending the `createDelegateComponent(...)` method. You will find many connectors performing such operation.
Another approach when you just have to deal with changes in the `Exchange` would be to use the pre/post producer and consumer processors available, here is an example:

    MongoConnector(String componentId, String componentScheme) {
        super(componentId, componentScheme);
        this.setBeforeProducer(this::beforeProduced);
    }
    
    public void beforeProduced(Exchange exchange) throws Exception{
           … do something with the Exchange
    }

As you can see, through delegate approach you have a higher degree of flexibility that should help you fixing most of the features you need to develop.

We can reuse the same unit test in order to verify that the component is working as expected and then make some real integration test on Syndesis.
### Local integration test
As soon as you’ve prepared your implementation and this has been tested properly through unit test, you will be able to integrate the new connector to the rest of components in Syndesis. The process would require you to edit a few `pom.xml` in order to let the different Syndesis modules know about the availability of this new component.

    app/connector/pom.xml
    app/connector/support/catalog/pom.xml
    app/integration/bom/pom.xml
    app/integration/bom-camel-k/pom.xml
    app/meta/pom.xml
    app/pom.xml

In the first pom (which is your connector parent pom) you must find the modules list and add an entry with your new module, whilst in the rest you must find the connector dependency list and just include your newly created dependency (plus the version in some of them, just copy a reference from another sample connector).

Try to maintain the alphabetical order so that it would be easier to spot any dependency when you’re looking for it.

You may now be able to execute the build of the whole syndesis either directly through mvn execution at base application path (app/pom.xml) or through the syndesis CLI. The second option is preferred as we will use shortly for deployment as well:

    $ syndesis build

The build will take some time as it compiles and test all the modules. There are several shortcut and flags you can use to accelerate this process, [see guidelines here](https://syndesis.io/docs/cli/).
###### First deployment
As soon as the build completed you are ready to deploy the application in your local minishift environment. You can run the following command to do so:

    $ syndesis minishift --install --local

You may take a base installation remotely if you don’t use the `--local` flag. You can also specify a base tag from where your installation starts (ie, `--tag 1.7`).

Make sure your minishift has started correctly (`$ minishift start`) and that you’ve logged in with proper development profiles (`$ oc login`) in order to grant the `fabric8` maven plugin the proper privileges either in first deployment and any following one.
###### Following deployment
Once your application is up and running, you may decide to make changes to the connector. So, after building and setting the proper dependencies in the poms mentioned above, you can refresh the local deployment with the new changes by updating 2 modules:

    $ syndesis build -f -i -m server
    $ syndesis build -f -i -m s2i

The `server` component is taking care of setting the metadata used by the UI in order to configure your integration (ie, the parameters), whilst the `s2i` component is taking care of the creation of the Camel route itself by allowing the integration deploy to be bound to a docker image and deployed to the platform through the project-generator. Depending on the change you’ve performed you may need to build again also integration and meta or the same connector catalog. In such a situation it’s safer to rebuild the whole backend modules by running the following statement:

    $ syndesis build -f -i -b

The `-i` or `--image` flag will instruct your local installation to refresh the deployment on your local environment and be able therefore to apply the changes you’ve built.
###### Remote deployment
Once you have all ready, tested and carefully reviewed, then, [proceed with a PR and follow the rest of the process](https://syndesis.io/community/contributing/#submitting-a-pull-request). As soon as the feature is merged on master you will be able to test your feature on the staging environment as well.
### Connection verifier
During the configuration of a new connection you will typically end up making requests to an external system with specific user credentials. Syndesis offers a feature to validate such connection parameters directly from the UI, so let’s see which are the development needed to make it happens.

<mark>WARNING</mark>: you should consider adding the `verifier` on Syndesis instead of the camel upstream component only if there is any specific requirement that is impeding you to do that upstream. The normal process should be providing the verifier upstream first and later be able to just use the class from the verifier descriptor.

The first thing is to have a look at your json descriptor file and recall the id you’ve provided to the connector:

    …
      "id": "mongodb",
    …

Let’s create a new resource file following the structure here:

    $ mkdir -p src/main/resources/META-INF/syndesis/connector/verifier
    $ touch src/main/resources/META-INF/syndesis/connector/verifier/mongodb

The meta component will take care of looking that descriptor when invoked. The file will simply provide a configuration with the name of the class that you are going to develop:

    class=io.syndesis.connector.mongo.verifier.MongoDBVerifier

Then, the following step will be to develop the business logic expected according to a specific class we must extend:

    public class MongoDBVerifier extends ComponentVerifier {
       public MongoDBVerifier() {
           super("mongodb");
       }
    
       @Override
       protected ComponentVerifierExtension resolveComponentVerifierExtension(CamelContext context, String scheme) {
           return new MongoConnectorVerifierExtension(context);
       }
    }

Please notice that you are providing in the constructor, the name of your component (same of the verifier in this case). Finally we delegate the verification to a further class:

    public class MongoConnectorVerifierExtension extends DefaultComponentVerifierExtension {
    
       public MongoConnectorVerifierExtension(CamelContext camelContext) {
           super("mongodb", camelContext);
       }
    
       @Override
       public Result verifyParameters(Map<String, Object> parameters) {
           ResultBuilder builder = ResultBuilder.withStatusAndScope(Result.Status.OK, Scope.PARAMETERS)
                   .error(ResultErrorHelper.requiresOption("host", parameters))
           return builder.build();
       }
    
       @Override
       public Result verifyConnectivity(Map<String, Object> parameters) {
           return ResultBuilder.withStatusAndScope(Result.Status.OK, Scope.CONNECTIVITY)
                   .error(parameters, this::verifyCredentials)
                   .build();
       }
    
       private void verifyCredentials(ResultBuilder builder, Map<String, Object> parameters) {
           try (MongoClient mongoClient = new MongoClient(parameters.get("host"))) {
               // Just ping the server
               mongoClient.getConnectPoint();
           } catch (Exception e) {
               ResultErrorBuilder errorBuilder = ResultErrorBuilder.withCodeAndDescription(
                       VerificationError.StandardCode.GENERIC,
                       e.getMessage());
               builder.error(errorBuilder.build());
           }
       }
    }

Through the `verifyParameters` method you will check which are the mandatory parameters needed by your connection validation, in our sample case we just need the host parameter to perform the following `verifyConnectivity` which is in charge to perform a connection test against the host provided as a parameter.

Please, consider that we are using a further `verifyCredentials` method reference as we eventually will provide more advanced test than simply connecting to the server. In fact, although we are just catching a generic exception, we will likely want to catch different specialized exceptions and provide also specific message for every error we may face (authentication failed, network failures, files missing, …).

Last configuration you have to apply is adding a tag to let the GUI know to enable verification on this component:

     "id": "mongodb3",
     "name": "MongoDB",
    ...
     "tags": [
       "verifier"
     ]
    }

### Appendix A - Base64 image conversion
Older UI of Syndesis uses a base 64 encoded image built from a binary. You can use the following script to convert any generic image to base64:

    #!/bin/bash
    
    mimetype=$(file -bN --mime-type "$1")
    content=$(base64 -w0 < "$1")
    echo "data:$mimetype;base64,$content"
    
Just copy the output to your json descriptor file.

### Reference used

- [Syndesis documentation](https://github.com/syndesisio/syndesis/blob/ed4f0f14e755a3cada1a18c95562b3f4a316fd6b/doc/integrating-applications/topics/r_develop-connector-extensions.adoc)
- [Fuse online documentation](https://access.redhat.com/documentation/en-us/red_hat_fuse/7.3/html-single/integrating_applications_with_fuse_online/index#develop-connector-extensions_extensions)


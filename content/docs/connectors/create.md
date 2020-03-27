---
draft: false
title: "Create a Connector"
toc: true
weight: 10
---

If Syndesis does not provide a connector for the application or service that you want to connect to in an integration, an experienced developer can develop and contribute a new Syndesis connector.

This documentation provides details about developing, testing, and deploying a new Syndesis connector. It uses the example of creating the MongoDB connector to illustrate internal behavior and analyze development choices.

Before you start to develop a connector, you should:

 - [Fork the Syndesis project](https://github.com/syndesisio/syndesis) and become familiar with its structure.
 - [Learn about Syndesis development.](https://syndesis.io/docs/development/)
 - [Read the Syndesis engineering guidelines.](https://syndesis.io/community/contributing/#1-fork-the-repository)

### Overview of how to develop a connector
A connector is essentially a proxy for a [Camel component](https://camel.apache.org/components.html). A connector configures the underlying component and creates endpoints according to options that are defined in the connector definition and in user-supplied options that the Syndesis web interface collects.

Before you start to develop a connector, become familiar with the tasks that you will need to accomplish.

**Prerequisites**

 - Familiarity with Maven
 - Familiarity with Camel 
 - Experience programming

**General procedure**

1. Learn about the Camel component that the connector will use. In particular, determine whether the connector will need to customize any behavior defined in the Camel component.
2. Configure a Maven project for developing the connector.
3. Define the connector definition JSON file.
4. Create a unit test for the connector.
5. Optional. Customize the behavior of one or more connector actions.
6. Optional. Customize the general behavior of the connector.
7. Provide a connector icon. 
8. Integrate the new connector with existing Syndesis connectors.
9. Verify connections that are created from the new connector.

### Learning about the Camel component that the connector uses
Typically, you are developing a Syndesis connector that uses an existing Apache Camel component. For example, the Syndesis MongoDB connector uses the [Apache Camel MongoDB component](https://camel.apache.org/components/latest/mongodb-component.html).

If you want to develop a connector for which a Camel component does not yet exist, you will need to develop the Camel component first. See [Contributing new components to the Apache Camel project](https://oscerd.github.io/2016/07/06/contributing-camel-components/).

Learn as much as you can about the Camel component that your connector will use. In particular:

 - Learn about the URI structure that the component uses in Camel. For the MongoDB component uses this structure:

    `mongodb:connectionBean?database=databaseName&collection=collectionName&operation=operationName[&moreOptions...]`

    The most important thing you must know is the protocol. In this example, the protocol is **mongodb**. Specification of the protocol is how you will configure and identify the component in the Camel catalog that the connector uses.

 - Identify the Camel component parameters that are important for connector development:
    - Required parameters
    - Parameters needed for consumer endpoints
    - Parameters needed for producer endpoints

 - You must know the expected type for each parameter value. Often, a parameter requires a string value that indicates a configuration option. But sometimes a parameter value must be something more complicated, such as a Java object that represents a data source or a connection bean.

  - Experiment with the Camel component as a way to learn about it.    
      When your new connector is deployed, it will be used in a Camel route that is running, typically, in a container. Consequently, you want to be familiar with how the Camel component behaves in a deployed Camel route in a container. [Look at examples that use the Camel component](https://github.com/apache/camel/tree/master/examples) that your connector will use.

If you are going to make any changes to an existing Camel component, be sure to bring the correct Camel component version into your project. You must also rebuild the `camel-catalog` dependency since Syndesis uses this dependency at runtime to read configuration information, such as the expected parameters. Any changes that you make to the Camel component must be reflected by refreshing this dependency.

### Configuring a Maven project for developing a connector
There is not yet a Maven archetype for creating a Syndesis connector. Consequently, you must manually configure a `pom.xml` file for the Maven project that you will use to develop the connector.

**Procedure**

1. In your local Syndesis clone, in the `app/connector` folder, create a folder for your new connector. For example, the MongoDB connector is in the `app/connector/mongodb` folder.

2. In the folder that you just created, create the minimum viable `pom.xml` file that wraps all needed dependencies for your new connector. Be sure to maintain the structure of the sample file shown here.

    1. Add the connector description.

        Almost everything related to the project is managed by the 
        `connector-parent` artifact. You just have to provide the name of this new dependency:

        ```xml
        <?xml version="1.0" encoding="UTF-8"?>
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
        ...
        ```

        Change the `<version>`, the second `<artifactId`> and the `<name>` as needed. The value of the second `<artifactId>` element should follow the convention shown in this example. That is, the format for the value is `connector-`*camel-component-name*.    

    2.  Add the basic dependencies to the connector’s `pom.xml` file as well as the dependencies needed to develop your connector. For example:

        ```xml
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
        ...
        ```

        In the `pom.xml` file for your connector, you can of course omit the MongoDB dependency. You might notice that the `camel-mongodb` dependency is not yet specified. This is addressed later.

    3. Add the testing dependencies that will help you set up a unit test. For example: 

        ```xml
            ...
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
        ...
        ```

        The last three dependencies are specific to the MongoDB example. The rest are needed by any generic test case. Initially, the scope of the `camel-mongodb3` dependency is `runtime`. This is because initial development does not explicitly use this dependency. Only the unit test and finally the integration will do that.
 
    4. Configure plugins in the `pom.xml` file. For example:

        ```xml
        ...
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
        ```

3. Set up your IDE to get the Maven project for developing the connector.

4. Run `mvn install` to confirm that the structure of the project is valid, though empty.

**Additional resource**

There is a new [Syndesis project CLI](https://syndesis.io/docs/cli/) with more advanced features that you might want to use to develop your connector.

### Specifying a connector definition JSON file
Each connector must have a `.json` file that defines the connector by specifying values for data structures such as name, description, supported actions, and dependencies. The purpose of the connector’s JSON file is to provide enough information for the underlying Camel component to create the route and endpoints. This is where you apply what you learned about the Camel component that your connector uses.

For new connectors, it is not yet possible to automatically generate the connector definition JSON file from Java code.

**Prerequisites**

Familiarity with the requirements, parameters, and behavior of the Camel component that the connector uses. 

**Procedure**

1. Create an empty file that will contain the connector definition. You must follow the folder hierarchy and naming conventions used by other connectors. For example, the following commands create the connector definition JSON file for the MongoDB connector:

  ```shell
  $ cd app/connector/mongodb
  $ mkdir -p src/main/resources/META-INF/syndesis/connector
  $ touch src/main/resources/META-INF/syndesis/connector/mongodb.json
  ```

2. Run the validation tool be expect an error because the `.json` file is still empty.  

  ```shell
  $ mvn process-classes
  ...
  [ERROR] Failed to execute goal io.syndesis.connector:connector-support-maven-plugin:1.7-SNAPSHOT:generate-connector-inspections (inspections) on project connector-mongodb: Execution inspections of goal io.syndesis.connector:connector-support-maven-plugin:1.7-SNAPSHOT:generate-connector-inspections failed: unhandled token type NOT_AVAILABLE -> [Help 1]
  ```

    The plugin guides you to correctly develop the connector by notifying you of any configuration errors. 

3. In the empty connector `.json` file, specify the basic description of the connector, including its name, description, ID, icon, and any properties that provide configuration parameters that are required by the underlying Camel component. The following example, which is part of the MongoDB connector, shows that the Camel MongoDB component requires specification of a MongoDB database host.

  ```json
  {
    "description": "Mongo DB connector.",
    "icon": "assets:mongodb.png",
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
    }
    ...
  ```

4. Define the behavior of connections that will be created from this connector by adding action specifications. An action is an operation that the connection performs according to the pattern specified in the JSON file. Typically, this is a `From` pattern for consumer endpoints and a `To` pattern for producer endpoints. You can also specify a `Pipe` pattern. Add an action specification for every operation that you want a connection to perform.

    The following example shows more of the JSON file for the MongoDB connector. This section specifies the MongoDB producer action.

  ```json
    ...
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
    ...
  ```

    This action definition specifies a producer endpoint that performs certain operations at the end of a route. For example, suppose that you want to obtain data from a source, such as a SQL database or a Twitter feed, and write that data to a collection in a MongoDB database. To write to a MongoDB database, the connection must have values for three parameters: `database`, `collection` and `operation`. The `propertyDefinitionSteps` object specifies these parameters. When someone creates a connection from your new connector and adds the connection to an integration, the user interface prompts for values for the parameters that you specify in a `propertyDefinitionSteps` object, that is, `database`, `collection`, and `operation` in this example.

5. Declare Maven dependencies in the connector definition JSON file. Typically, if you are following connector development conventions, you just need to add the following: 

  ```json
    ...
    "dependencies": [
      {
        "id": "@project.groupId@:@project.artifactId@:@project.version@",
        "type": "MAVEN"
      }
    ]
  ```

**Additional resources** 

 - [Requirements in an extension definition JSON file](https://access.redhat.com/documentation/en-us/red_hat_fuse/7.5/html/integrating_applications_with_fuse_online/customizing_ug#about-extension-definitions_extensions)
 
 - [Syndesis connector schema explained](https://syndesis.io/docs/connector-schema/)
 
### Example of creating a unit test for a connector
With a Maven project, the connector’s definition JSON file, and the Java classes that implement the connector, you have a connector that you can try to include in a Syndesis bundle and deploy. However, before you do that, create a unit test that verifies that the connector will work correctly.

The [org.apache.camel.test.junit4.CamelTestSupport](https://github.com/apache/camel/blob/master/components/camel-test/src/main/java/org/apache/camel/test/junit4/CamelTestSupport.java) class provides upstream Camel support for testing. The [io.syndesis.connector.support.test.ConnectorTestSupport](https://github.com/syndesisio/syndesis/blob/master/app/connector/support/test/src/main/java/io/syndesis/connector/support/test/ConnectorTestSupport.java) class extends the `CamelTestSupport` class. By extending the `ConnectorTestSupport` class, you can benefit from the environment provided by Camel and Syndesis.

As you develop a test suite, you will learn about the features offered by these two classes. For the first iteration, implement an abstract method that builds the final route, which includes your new connector. The following example code is a simple test for the MongoDB connector:

```java
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
```

The parent class uses this method to build a route that consumes data from a [direct component](https://camel.apache.org/direct.html) named `start` and produces data for the `mongodb` component by using the new connector. This code configures a connector endpoint with the identification that is defined in the connector’s JSON file and passes the map of parameters expected by the implementation: `database`, `collection` and `operation`. (This component also expects a `connectionBean` parameter and this is discussed later.)

The last step is to provide the test case. Here is an example of a MongoDB test case: 

```java
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
```

To trigger the integration, the code calls the `template()` method, which is provided by the super class, and provides a body that contains a simple JSON text string with a unique field in it. The route configured above invokes the insert operation to write this JSON into the specified collection in the specified database.

Finally, as a simple assert condition, the code verifies that the content of a JSON field corresponds to the one that the same test has produced.

In your development, use a similar strategy when you need to produce some data for your connector. Follow the approach of using a [mock component](http://camel.apache.org/mock.html) when you need to consume data from your connector.

###### Connection bean
To develop a complete test, you need to do one of the following:

 - Create a mock service that provides the connection to the Camel component.
 - Use an actual service instance. 

In this example, an embedded instance of MongoDB provides the connection. Depending on the Camel component you are using, you might create some sort of connection on demand or to pass it through properties or context configuration. In the example shown here, the component is expecting a connection bean to be available in a Camel `Context`:

```java
@Override
public void postProcessTest() {
    MongoClient mongoClient = new MongoClient("localhost");
    context().getRegistry(JndiRegistry.class).bind("mongoConnection", mongoClient);
}
```

The method used here is inherited from the `CamelTestSupport` class and it is called as soon a context has been created. This wires a bean with a reference that the `camel-mongodb3` component looks up at runtime. 

### Customizing the behavior of an action in a connector
As the previous sections show, it is possible to develop a connector without customizing the behavior of the Camel component. Some Syndesis connectors do not require customization. Such connectors provide the needed features through correct specification of the JSON connector definition file, including the definition of relevant actions.

However, customizing a connector is often needed because:

 - Connecting to a particular Camel component requires configuration that is bound to services that use certain protocols.

 - A connection bean is missing. For example, the connector development described so far would work only for a test case because the connector expects a connection bean to be injected before execution of the integration.

 There are two different approaches for customizing a connector by configuring a connection bean. The first approach, described here, is to customize one or more actions. The second approach, described in the next section, is to customize the connector by defining a component delegate.
 
 As soon as you start customizing your connector, in your Maven `pom.xml` file, you might need to change the scope of the Camel component to be available at compile time. For example, without customizations, the `camel-mongodb` component scope of test is okay.
 
 Syndesis connector proxy development makes it possible to define the exact action behavior you need because you can customize behavior through the lifecycle of a connector action. That is, you can define:
 
  - Behavior that occurs before or after execution of the action itself
  - Behavior when creating the connection action
  
 The following section of the MongoDB connector definition JSON file introduces the `connectorsCustomizers` variable, which customizes the behavior of the action in which it is specified:

```json
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
```

In the `connectorCustomizers` object, specify an implementation of the 
[io.syndesis.integration.component.proxy.ComponentProxyCustomizer](https://github.com/syndesisio/syndesis/blob/master/app/integration/component-proxy/src/main/java/io/syndesis/integration/component/proxy/ComponentProxyCustomizer.java) interface. For example:

```java
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
```

In this example, the `customize()` method:

 - Obtains information about the MongoDB host, which is defined as a parameter in the connector definition JSON file. When this connector is used to create a connection in the user interface, the user specifies the host.
 
  - Creates a connection.

 - Injects the connection into the bean reference that the Camel component is expecting.

Typically, you must provide a similar implementation to set up the proper connection settings or possibly to transform the parameters that are passed by your user in some other object.

In this example, the implementation of the `CamelContextAware` interface wires the runtime Camel context into the `MongoCustomizer` class. This makes the runtime Camel context available in a `MongoCustomizer` instance, if you need it.

With the `MongoCustomizer` class defined, you can change the test case by removing the context injection. In the unit test example, you would remove the `postProcessTest()` method. This method is replaced by setting the host from the properties that are passed into the connector. For example:

```java
...
builder -> {
    builder.putConfiguredProperty("connectionBean", "connectionBeanContextRef");
builder.putConfiguredProperty("host", “localhost”);
    builder.putConfiguredProperty("database", DATABASE);
...
```

The connector is now ready to be tested in a Syndesis integration.

###### Multiple action customizations
Sometimes, a connector requires the same customization for several actions. In this case, rather than copying the same configuration to these actions, configure the customized behavior for the connector rather than for each action. Also, it is possible to have more than one instance of `connectorCustomizers` in the connector definition JSON file. In the following example, you can see a configuration that defines both a generic connector customizer and a specific action customizer:

```json
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
```

The two definitions of `connectorCustomizers` work together to customize the general behavior as well as the behavior of a specific action.

##### Customizing general behavior in a connector
Another approach to customization is to define a component delegate, which lets you control behavior through the lifecycle of the Camel component. A series of customizable methods that you define specifies the needed behaviors. These methods are exposed in the `ComponentProxyComponent` class that your connector class must extend.

In your connector definition JSON file, add a `connectorFactory` parameter. The following segment of the MongoDB JSON file provides an example:

```json
{
  "description": "Mongo DB connector.",
  "connectorFactory": "io.syndesis.connector.mongo.MongoConnectorFactory",
  "icon": "assets:mongodb.svg",
  "id": "mongodb",
 ...
 ```

This configuration instructs the Syndesis connector manager to instantiate the `MongoConnectorFactory` class whenever the connector manager needs to create a MongoDB connector. The `MongoConnectorFactory` class implements the [`ComponentProxyFactory`](https://github.com/syndesisio/syndesis/blob/master/app/integration/component-proxy/src/main/java/io/syndesis/integration/component/proxy/ComponentProxyFactory.java)) interface, as shown in this example:

```java
public class MongoConnectorFactory implements ComponentProxyFactory{
    @Override
    public ComponentProxyComponent newInstance(String componentId, String componentScheme) {
        return new MongoConnector(componentId,componentScheme);
    }
}
```

The real logic is in the connector class that you define. This class must extend the [`ComponentProxyComponent`](https://github.com/syndesisio/syndesis/blob/master/app/integration/component-proxy/src/main/java/io/syndesis/integration/component/proxy/ComponentProxyComponent.java) class, which provides integration with the Camel component. If you do not specify any customization, this default class is the one that your Syndesis connector uses.

The following sample code customizes component behavior by providing a connection bean that is available at runtime:

```java
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
```

However, the typical workflow, which many connectors perform, expects a complete new delegate component to be created by calling the `createDelegateComponent()` method.

If you need to handle only changes in the `Exchange` object, another approach is to use the available pre/post producer/consumer processors, as shown in this example:

```java
MongoConnector(String componentId, String componentScheme) {
    super(componentId, componentScheme);
    this.setBeforeProducer(this::beforeProduced);
}

public void beforeProduced(Exchange exchange) throws Exception{
      ... do something with the Exchange
}
```

By using a component delegate, you have a higher degree of flexibility for implementing the features that you need to develop. To verify that the connector is working as expected, you can reuse the same unit test. You can then create integrations that test connector behavior in Syndesis.

### Providing an icon for a connector 

To show the flow of an integration, Syndesis displays icons that identify the applications that the integration is connecting to. When you develop a connector, you should provide an image that Syndesis can use as the connector icon and as the icon for connections created from the connector.

**Prerequisites**

 - An image that represents the application that your connector accesses
 - A connector definition JSON file that defines your connector

**Procedure**

1. Add an image to the Syndesis `app/ui-react/syndesis/public/icons` folder. The image should identify the application that your connector accesses. For example, the image for the MongoDB connector is `mongodb.png`: ![MongoDB icon](/images/mongodb.png) 

2. In the connector definition JSON file, specify the `icon` attribute. with the name of your image file. Follow the format shown here:

    ```json
    "description": "Read and write MongoDB collections",
    "icon": "assets:mongodb.png",
    "id": "mongodb3",
    ```

3. Optional. If your connector is not yet ready for a production environment, set the `tech-preview` attribute in the connector definition JSON file. For example:

    ```json
    "description": "Read and write MongoDB collections",
    "icon": "assets:mongodb.png",
    "id": "mongodb3",
    "metadata": {
    "tech-preview": "true"
    ```

    Remember to remove or unset `tech-preview` when the connector has all needed features and can be used in production.

### Integrating a new connector with existing connectors 

After you implement and successfully test a new connector, integrate the new connector with the other Syndesis components. When review and testing is complete, submit a pull request.

**Procedure**

1. To indicate to other Syndesis modules that a new connector is available, in the `syndesis` directory, edit the following `pom.xml` files:

    ```
    app/connector/pom.xml
    app/connector/support/catalog/pom.xml
    app/integration/bom/pom.xml
    app/integration/bom-camel-k/pom.xml
    app/meta/pom.xml
    app/pom.xml
    ```

    In the `app/connector/pom.xml` file, which is the parent `pom.xml` file for your connector, find the modules list and add an entry for your new module. In the rest of the `pom.xml` files, find the connector `<dependencies>` list and add an entry for your new connector. Some files might require specification of a version number. Copy and edit an existing entry. Try to maintain alphabetical order so that it is easier to find a particular dependency.

2. Build Syndesis by invoking the following command:

    ```shell
    $ syndesis build
    ```

    This is preferred because the same command can deploy Syndesis. Alternatively, you can build Syndesis by executing Maven at the base application path, which is `app/pom.xml`.

    The build takes some time as it compiles and tests all modules. There are several [shortcuts and flags that you can use to accelerate this process](https://syndesis.io/docs/cli/#syndesis-build).

3. Start minishift:

    ```shell
    $ minishift start
    ```

4. Log in with the proper development profile, for example:

    ```shell
    $ oc login -u developer -p developer
    ```

    This grants the required deployment privileges to `fabric8-maven-plugin`.

5. After the build completes, deploy Syndesis in your local minishift environment by invoking the following command: 

    ```shell
    $ syndesis minishift --install --local
    ```

    Omit the `--local` option for a remote installation.
    Optionally, specify a base tag, such as `--tag 1.8` to indicate where to start the installation.

6. When Syndesis is running, iteratively: 

    1. Test your connector by creating and using it in an integration. 

    2. Update the connector as needed.

    3. Refresh your deployment to add your changes by updating two Syndesis modules. To do this, invoke the following commands: 
    
    ```shell
    $ syndesis build -f -i -m server
    $ syndesis build -f -i -m s2i
    ```

        The `server` module sets the metadata (parameter values) that the Syndesis user interface needs to configure an integration. The `s2i` module:

         - Creates the Camel route by binding the integration runtime to a docker image
         - Provides Camel dependencies and configuration
         - Deploys the integration to the platform, Camel in this case, through the Syndesis `project-generator` module

    4. Optionally, rebuild the Syndesis backend modules by invoking the following command:

    ```shell
    $ syndesis build -f -i -b
    ```

        The `-i` or `--image` flag instructs your local installation to refresh the deployment in your local environment. This applies your changes.

        For a change to metadata information, such as a datashape change, or a change related to the connector definition JSON file, rebuilding backend modules is not required.
        
    When you change any connector or integration (app/integration package) code, the resulting jar files should be placed in the `app/s2i/target/image/repository/`,
    this repository is used to build the integrations at runtime. After building the integration or connector project, the s2i project doesn't detect
    these changes, so for this moment, you should remove the package from `app/s2i/target/image/repository/` before `s2i` build. As an example, if you changed 
    the `TwitterCustomizer` class, you can do theses steps to ensure the changes are seem when the integration is running:
    
    ```shell
    # this is the same as mvn -Pflash install in the app/connector/twitter directory
    $ syndesis build -f -m io.syndesis.connector:connector-twitter
    
    # remove the twitter connector artifact from the s2i image repository
    $ rm -rf app/s2i/target/image/repository/io/syndesis/connector/connector-twitter/
    
    # build the s2i will update the maven repository in app/s2i/target/image/repository
    $ syndesis build -f -i -m s2i
    ```


7. After careful review and successful local testing, [create a pull request](https://syndesis.io/community/contributing/#submitting-a-pull-request).

8. After your updates are merged to Syndesis `master`, open an incognito browser window and test your connector in the [Syndesis staging environment](https://syndesis-staging.b6ff.rh-idev.openshiftapps.com). Syndesis uses CircleCI pipelines to keep its staging environment up to date.

### Verifying connections that are created from a connector
Using a connector to create a connection typically requires a request that contains specific user credentials and that goes to an external system. Syndesis provides a feature for validating the configuration of this kind of connection directly from the user interface. Several development tasks are required to implement connection validation from the user interface.

The typical procedure is to add the connection verifier to the upstream platform, for example, to the Camel component that the connector uses. In other words, you provide the verifier upstream first and then later you use the class from the verifier descriptor. If there is a specific requirement that prevents adding the verifier upstream, only then should you consider adding the verifier to Syndesis.

**Procedure**

1. Examine your connector definition JSON file to obtain the id that it specifies for the connector. For example:

    ```json
    ...
      "id": "mongodb",
    ...
    ```

2. Create a new resource file and use the structure shown in the following commands. 
In this example, the result is the resource file for the MongoDB connector: 

```shell
$ cd ~/syndesis/app/connector/mongodb
$ mkdir -p src/main/resources/META-INF/syndesis/connector/verifier
$ touch src/main/resources/META-INF/syndesis/connector/verifier/mongodb
```

    The `META-INF/syndesis/connector/meta/mongodb3` class, when invoked, takes care of looking up the connector definition JSON file.

3. In the `verifier` resource file, specify the name of the verifier class that you plan to develop. For example, the content of the `verifier/mongodb` resource file is:     

```
class=io.syndesis.connector.mongo.verifier.MongoDBVerifier
```

4. Develop the required business logic in a class that extends the `ComponentVerifier` class, which is defined in `syndesis/app/connector/support/verifier/src/main/java/io/syndesis/connector/support/verifier/api/`. For example:

    ```java
    public class MongoDBVerifier extends ComponentVerifier {
        public MongoDBVerifier() {
            super("mongodb");
        }

       @Override
       protected ComponentVerifierExtension resolveComponentVerifierExtension(CamelContext context, String scheme) {
           return new MongoConnectorVerifierExtension(context);
       }
    }
    ```

    Notice that the constructor provides the name of the Camel component that the connector uses. In the `verifier` folder, the file must have this same name. 

5. Delegate the verification to a further class:

    ```java
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
    ```

    In the `verifyParameters()` method, indicate the parameters that are required for connection validation. In the MongoDB example, only the `host` parameter is required to verify connectivity.

    Consider that this example defines a further `verifyCredentials()` method for eventually defining a more advanced test than simply connecting to the server. Initially, the method just catches a generic exception. A more advanced approach is to catch different specialized exceptions and provide specific messages for the error that might occur, such as authentication failed, network failure, file missing, and so on.

6. In the connector definition JSON file, add a tag to indicate to the user interface how to enable verification of this connector. For example:

    ```json
     "id": "mongodb3",
     "name": "MongoDB",
        ...
     "tags": [
       "verifier"
     ]
    }
    ```

### Additional resources

- [Developing extensions](https://access.redhat.com/documentation/en-us/red_hat_fuse/7.5/html/integrating_applications_with_fuse_online/customizing_ug#developing-extensions_custom)
- [Brief example of developing a connector extension](https://access.redhat.com/documentation/en-us/red_hat_fuse/7.5/html/integrating_applications_with_fuse_online/customizing_ug#develop-connector-extensions_extensions)

---

title: Maven入门教程

date: 2019-01-07 10:00:00

tags: [Java]

keywords: Java, Maven

description: Maven入门教程

---

**摘要：** Java构建工具Maven。

<!-- more -->

GitHub仓库：[Fundebug/maven-tutorial](https://github.com/Fundebug/maven-tutorial)

### Maven简介

[Maven](https://maven.apache.org/)是Java项目构建工具，可以用于管理Java依赖，还可以用于编译、打包以及发布Java项目，类似于JavaScript生态系统中的NPM。

Maven的命令行工具为**mvn**，其常用命令如下表所示：

| 命令         | 说明                    | 
| ----------- | -----------------------| 
| mvn compile | 编译Java源代码           | 
| mvn package | 打包Java项目             |
| mvn deploy  | 将Java项目发布到Maven仓库 |
| mvn clean   | 删除构建目录             |

Maven的配置文件为**pom.xml**，这个文件有个很吓人的学术名字Project Object Model，但是怎么看它都只是个普通的配置文件，与NPM中的package.json没啥本质区别。

Maven的中央仓库为**[Maven Repository](https://mvnrepository.com/)**，这里可以找到各种Java依赖，例如我们[Fundebug](https://www.fundebug.com/)的异常监控插件[fundebug-java](https://mvnrepository.com/artifact/com.fundebug/fundebug-java)与[fundebug-spring](https://mvnrepository.com/artifact/com.fundebug/fundebug-spring)。

### 安装Maven

在MacBook上使用brew安装很方便

```bash
brew install maven
```

我安装的是maven版本**3.5.4**

```bash
mvn -version
Apache Maven 3.5.4 (1edded0938998edf8bf061f1ceb3cfdeccf443fe; 2018-06-18T02:33:14+08:00)
Maven home: /usr/local/Cellar/maven/3.5.4/libexec
Java version: 1.8.0_192, vendor: Oracle Corporation, runtime: /Library/Java/JavaVirtualMachines/jdk1.8.0_192.jdk/Contents/Home/jre
Default locale: zh_CN, platform encoding: UTF-8
OS name: "mac os x", version: "10.14.2", arch: "x86_64", family: "mac"
```

### 示例代码

本文示例代码都在GitHub仓库[Fundebug/maven-tutorial](https://github.com/Fundebug/maven-tutorial)。

使用[tree](http://macappstore.org/tree/)命令可以查看项目的目录结构：

```bash
tree -v
.
├── pom.xml
└── src
    └── main
        └── java
            └── com
                └── fundebug
                    └── Hello.java
```

[pom.xml](https://github.com/Fundebug/maven-tutorial/blob/master/pom.xml)为Maven配置文件，位于项目的根目录。

[Hello.java](https://github.com/Fundebug/maven-tutorial/blob/master/src/main/java/com/fundebug/Hello.java)为Java源代码，位于**src/main/java/com/fundebug**目录中。根据Maven对目录结构的要求，Java源代码必须位于**src/main/java**目录。

### Hello.java

```java
package com.fundebug;

import org.json.JSONObject;

public class Hello {
        public static void main(String[] args) {
                JSONObject tomJsonObj = new JSONObject();
                tomJsonObj.put("name", "Fundebug");
                tomJsonObj.put("url", "https://www.fundebug.com");
                System.out.println(tomJsonObj.toString(4));
        }
}
```

[Hello.java](https://github.com/Fundebug/maven-tutorial/blob/master/src/main/java/com/fundebug/Hello.java)非常简单，定义了一个JSON对象，然后把它打印出来了。

package定义的包名为com.fundebug，需要与所在的目录结构相吻合，因此Hello.java位于**src/main/java/com/fundebug**目录中，而不是**src/main/java/**目录中。

代码依赖于第三方模块[json](https://mvnrepository.com/artifact/org.json/json)，因此需要在pom.xml配置dependency：

```xml
<dependency>
    <groupId>org.json</groupId>
    <artifactId>json</artifactId>
    <version>20180813</version>
</dependency>
```

### pom.xml

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0" 
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/maven-v4_0_0.xsd">
        <modelVersion>4.0.0</modelVersion>
        <!-- 坐标 -->
        <groupId>com.fundebug</groupId>
        <artifactId>hello</artifactId>
        <version>1.0</version>
        <!-- 依赖 -->
        <dependencies>
                <!-- https://mvnrepository.com/artifact/org.json/json -->
                <dependency>
                        <groupId>org.json</groupId>
                        <artifactId>json</artifactId>
                        <version>20180813</version>
                </dependency>
        </dependencies>
</project>
```

[pom.xml](https://github.com/Fundebug/maven-tutorial/blob/master/pom.xml)中，`<project></project>`为最外层的标签；`<modelVersion>4.0.0</modelVersion>`定义了所使用的POM版本。这2个标签基本上是不变的。

groupId、artifactId与version一起则定义了模块的**坐标(Coordinates)**，每个公共模块的坐标应该是唯一的：

- groupId：组织名称，通常是把域名反过来，例如[com.fundebug](https://mvnrepository.com/artifact/com.fundebug)
- artifactId：模块名称，例如[fundebug-java](https://mvnrepository.com/artifact/com.fundebug/fundebug-java)
- version：模块版本，例如[0.2.0](https://mvnrepository.com/artifact/com.fundebug/fundebug-java/0.2.0)

`<dependencies></dependencies>`定义了当前项目所依赖的模块：

```xml
<dependencies>
    <!-- https://mvnrepository.com/artifact/org.json/json -->
    <dependency>
        <groupId>org.json</groupId>
        <artifactId>json</artifactId>
        <version>20180813</version>
    </dependency>
</dependencies>
```

Maven可以根据`<dependency></dependency>`中定义的坐标，自动下载所依赖的模块。在MacBook上，Maven将下载的模块缓存在**$HOME/.m2/**目录。

### 使用mvn打包

执行**mvn package**命令，即可将源码打包为.jar文件：

```bash
mvn package
[INFO] Scanning for projects...
[INFO]
[INFO] -------------------------< com.fundebug:hello >-------------------------
[INFO] Building hello 1.0
[INFO] --------------------------------[ jar ]---------------------------------
[INFO]
[INFO] --- maven-resources-plugin:2.6:resources (default-resources) @ hello ---
[WARNING] Using platform encoding (UTF-8 actually) to copy filtered resources, i.e. build is platform dependent!
[INFO] skip non existing resourceDirectory /Users/fundebug/Desktop/maven-tutorial/src/main/resources
[INFO]
[INFO] --- maven-compiler-plugin:3.1:compile (default-compile) @ hello ---
[INFO] Changes detected - recompiling the module!
[WARNING] File encoding has not been set, using platform encoding UTF-8, i.e. build is platform dependent!
[INFO] Compiling 1 source file to /Users/fundebug/Desktop/maven-tutorial/target/classes
[INFO]
[INFO] --- maven-resources-plugin:2.6:testResources (default-testResources) @ hello ---
[WARNING] Using platform encoding (UTF-8 actually) to copy filtered resources, i.e. build is platform dependent!
[INFO] skip non existing resourceDirectory /Users/fundebug/Desktop/maven-tutorial/src/test/resources
[INFO]
[INFO] --- maven-compiler-plugin:3.1:testCompile (default-testCompile) @ hello ---
[INFO] No sources to compile
[INFO]
[INFO] --- maven-surefire-plugin:2.12.4:test (default-test) @ hello ---
[INFO] No tests to run.
[INFO]
[INFO] --- maven-jar-plugin:2.4:jar (default-jar) @ hello ---
[INFO] Building jar: /Users/fundebug/Desktop/maven-tutorial/target/hello-1.0.jar
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
[INFO] Total time: 2.789 s
[INFO] Finished at: 2019-01-05T15:23:02+08:00
[INFO] ------------------------------------------------------------------------
```

mvn package执行之后，项目中会新增一个**tartget**目录，编译的字节码文件位于**target/classes**目录，而jar包位于**target/hello-1.0.jar**：

```bash
tree -v
.
├── pom.xml
├── src
│   └── main
│       └── java
│           └── com
│               └── fundebug
│                   └── Hello.java
└── target
    ├── classes
    │   └── com
    │       └── fundebug
    │           └── Hello.class
    ├── hello-1.0.jar
```

### 使用mvn运行

打包好的jar包，可以直接使用**java**命令运行时，注意需要指定所依赖的jar包。对于所依赖的jar包，Maven则会自动下载依赖，放在本地仓库中。在MacBook上，Maven本地仓库位于**$HOME/.m2/**目录。

```bash
java -cp target/hello-1.0.jar:$HOME/.m2/repository/org/json/json/20180813/json-20180813.jar com.fundebug.Hello
{
    "name": "Fundebug",
    "url": "https://www.fundebug.com"
}
```

也可以使用**mvn exec:java**命令执行，不需要指定依赖的jar包，更加方便：

```bash
mvn exec:java -Dexec.mainClass="com.fundebug.Hello"
[INFO] Scanning for projects...
[INFO]
[INFO] -------------------------< com.fundebug:hello >-------------------------
[INFO] Building hello 1.0
[INFO] --------------------------------[ jar ]---------------------------------
[INFO]
[INFO] --- exec-maven-plugin:1.6.0:java (default-cli) @ hello ---
{
    "name": "Fundebug",
    "url": "https://www.fundebug.com"
}
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
[INFO] Total time: 0.837 s
[INFO] Finished at: 2019-01-05T15:33:57+08:00
[INFO] ------------------------------------------------------------------------
```


### 参考

- [Simple Maven Project](http://www.codetab.org/apache-maven-tutorial/simple-maven-project/)
- [Maven Dependency Management](http://www.codetab.org/apache-maven-tutorial/maven-dependency-management/)
- [Java JSON Tutorial and Example: JSON-Java (org.json)](https://www.codevoila.com/post/65/java-json-tutorial-and-example-json-java-orgjson)



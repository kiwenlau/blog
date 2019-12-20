---
title: Fundebug 后端 Java 异常监控插件更新至 0.3.1，修复 Maven 下载失败的问题

date: 2019-02-26 10:00:00

tags: [Fundebug]

keywords: Fundenbug, Java

description: Fundebug 后端 Java 异常监控插件更新至 0.3.1，修复 Maven 下载失败的问题
---

**摘要：** **0.3.1**修复 Maven 下载失败的问题。

<!-- more -->

![](https://image.fundebug.com/2019-02-26-0-3-1.jpg)

### 监控 Java 应用

### 1. pom.xml 配置[fundebug-java](https://mvnrepository.com/artifact/com.fundebug/fundebug-java)依赖

```xml
<dependency>
    <groupId>com.fundebug</groupId>
    <artifactId>fundebug-java</artifactId>
    <version>0.3.1</version>
</dependency>
```

### 2. 在项目中引入 fundebug 并配置 apikey

```java
import com.fundebug.Fundebug;
Fundebug fundebug = new Fundebug("apikey");
```

注意：获取**apikey**需要[免费注册](https://www.fundebug.com/team/create)帐号并且[创建项目](https://www.fundebug.com/project/create)。

可以参考 Demo 项目[Fundebug/fundebug-java-demo](https://github.com/Fundebug/fundebug-java-demo)。

### 监控 Spring 应用

#### 1. pom.xml 配置[fundebug-spring](https://mvnrepository.com/artifact/com.fundebug/fundebug-spring)依赖

```xml
<dependency>
    <groupId>com.fundebug</groupId>
    <artifactId>fundebug-spring</artifactId>
    <version>0.3.1</version>
</dependency>
```

#### 2. 在项目中引入 fundebug 并配置 apikey

新增 FundebugConfig.java

```java
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

import com.fundebug.Fundebug;
import com.fundebug.SpringConfig;

@Configuration
@Import(SpringConfig.class)
public class FundebugConfig {
	@Bean
	public Fundebug getBean() {
		return new Fundebug("apikey");
	}
}
```

注意：获取**apikey**需要[免费注册](https://www.fundebug.com/team/create)帐号并且[创建项目](https://www.fundebug.com/project/create)。

可以参考 Demo 项目[Fundebug/fundebug-spring-demo](https://github.com/Fundebug/fundebug-spring-demo)。

### 参考

-   [Fundebug 文档 - Java](https://docs.fundebug.com/notifier/java/)
-   [Maven 入门教程](https://blog.fundebug.com/2019/01/07/maven-tutorial/)

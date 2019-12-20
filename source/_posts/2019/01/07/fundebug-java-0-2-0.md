---

title: Fundebug后端Java插件更新至0.2.0，支持Spring及Maven

date: 2019-01-07 10:00:00

tags: [Fundebug, Java, Spring]

keywords: Java, Spring, Maven

description: Fundebug后端Java插件更新至0.2.0，支持Spring及Maven

---

**摘要：** **0.2.0**支持监控Spring应用，并且支持使用Maven接入插件，请大家及时更新。

![](https://image.fundebug.com/2019-01-08-fundebug_java_spring.jpg)

<!-- more -->

### 支持监控Spring应用

#### 1. pom.xml配置[fundebug-spring](https://mvnrepository.com/artifact/com.fundebug/fundebug-spring)依赖

```xml
<dependency>
    <groupId>com.fundebug</groupId>
    <artifactId>fundebug-spring</artifactId>
    <version>0.2.0</version>
</dependency>
```

#### 2. 在项目中引入fundebug并配置apikey

新增FundebugConfig.java

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

可以参考Demo项目[Fundebug/fundebug-spring-demo](https://github.com/Fundebug/fundebug-spring-demo)。

### 支持使用Maven接入插件

Fundebug的Java异常监控插件[fundebug-java](https://mvnrepository.com/artifact/com.fundebug/fundebug-java)与[fundebug-spring](https://mvnrepository.com/artifact/com.fundebug/fundebug-spring)都发布到了Maven中央仓库，因此可以在pom.xml直接配置依赖。

#### 接入fundebug-java

```xml
<dependency>
    <groupId>com.fundebug</groupId>
    <artifactId>fundebug-java</artifactId>
    <version>0.2.0</version>
</dependency>
```

#### 接入fundebug-spring

```xml
<dependency>
    <groupId>com.fundebug</groupId>
    <artifactId>fundebug-spring</artifactId>
    <version>0.2.0</version>
</dependency>
```

### 参考

- [Fundebug文档 - Java](https://docs.fundebug.com/notifier/java/)
- [Maven入门教程](https://blog.fundebug.com/2019/01/07/maven-tutorial/)



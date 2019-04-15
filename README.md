# About

中转豆瓣电影官方 API，另外还有注册、登录、发送邮箱验证码进行验证、收藏电影等功能，认证用户使用 `JsonWebToken`。

## 说明

> 部署环境 Google Cloud Platform CentOS 7.2 64位
> 相关项目地址：[前端项目地址](https://github.com/vdorchan/vue-movie)

## 技术栈

nodejs + Koa + mongodb + mongoose + es6/7 + Json Web Token + MailGun

## 项目运行

项目运行之前，请确保系统已经安装以下应用

* 1、node
* 2、mongodb (开启状态)

```bash
git clone https://github.com/vdorchan/node-movie

cd node-movie

yarn

node app
```

访问: http://localhost:8080

## MailGun

Mailgun 是一项第三方电子邮件服务，该服务可让 Compute Engine 用户每月免费发送一万封电子邮件。Mailgun 还提供编程 API、日志保留、电子邮件个性化、分析、电子邮件验证等功能。

## JSON Web Token

JSON Web Token（JWT）是一个轻量级的认证规范。
这个规范允许我们使用JWT在用户和服务器之间传递安全可靠的信息。

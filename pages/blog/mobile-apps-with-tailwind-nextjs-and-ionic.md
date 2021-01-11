---
title: Build Mobile Apps with Tailwind CSS, Next.js, Ionic Framework, and Capacitor
slug: mobile-apps-with-tailwind-css-nextjs-ionic-and-capacitor
description: Learn how to build iOS, Android, and Progressive Web Apps with Tailwind CSS, Next.js, Ionic Framework, and Capacitor
date: 2020-12-23 08:00:00
author: Max Lynch <max@ionic.io>
authorUrl: https://twitter.com/maxlynch
---

A very popular stack for building responsive web apps is [Tailwind CSS](https://tailwindcss.com/) and [Next.js](https://nextjs.org/).

Tailwind, a utility-first CSS framework that replaces the need to write custom class names or even any CSS at all in many cases, makes it easy to design responsive web apps through small CSS building blocks and a flexible design foundation.

Next.js, a React framework for building high performance React apps, is one of the leading environments for building production React apps on the web.

As these technologies have grown, they are increasingly used together for web app development. This has prompted many users of these projects to ask whether they can be used to build mobile apps, too.

Turns out, they can! And they make a great fit for cross-platform mobile development when paired with Ionic Framework and Capacitor.

Confused by all the project names yet? Don't worry, I'll break down each part of the stack each project is concerned with, along with some visuals and code smaples demonstrating how all the projects work together. At the end I'll share a starter project with these technologies installed and working together that can form the foundation of your next app.

## Ionic Framework

[Ionic Framework](https://ionicframework.com/) is a cross-platform, mobile-focused UI library for the web. It provides ~100 components that implement platform UI standards across iOS and Android. Things like toolbars, navigation/transitions, tabs, dialog windows, and more. The big draw is those components work on the web and work in frameworks like React, Angular, Vue, or plain HTML/CSS/JS.

Ionic Framework is highly popular and powers upwards of 15% of apps in the app store.

## Capacitor

Historically, Ionic Framework would be paired with a project like Cordova which provided the native iOS and Android building and runtime capabilities. However, most new Ionic Framework apps use Capacitor (this here project) for this part of the stack.

[Capacitor](https://capacitorjs.com/) is a project built by the team behind Ionic Framework focused on the _native_ side of a web-focused mobile app.

Capacitor provides a plugin layer and runtime that runs web apps natively on iOS, Android, Desktop, and Web, and provides full access to device APIs and features (including extending the web environment by writing additional native code).

As such, any popular web technologies and libraries can be used to build mobile apps with Capacitor, and then deploy the same apps with the same code to the web and desktop.

## The Stack Visualized

There are a lot of projects working in tadem to provide the full experience here. To visualize it, I've tried to overlay the different layers and how they correspond to each project in this diagram:

![Diagram of layers in a Capacitor Tailwind Next.js Ionic app](/assets/img/blog/tailwind-nextjs-ionic/layers.png)

In the diagram above, we can see that Capacitor is concerned with the app and device layer of the app, Next.js is concerned with the entire web/React app our code and UI is running in, then Ionic handles the navigation toolbar (including system title and toolbar buttons) as well as the bottom tabs.

## Introducing the Next.js + Tailwind CSS + Ionic Framework + Capacitor Starter

Interested in building mobile apps that look and feel like this using standard HTML/CSS/JS and Tailwind?

This starter also comes with a few small opinions around folder structure and state management.

## How do Tailwind and Ionic Framework work together?

The way to think about the UI portions that Ionic Framework is concerned with and the ones Tailwind is concerned with is that Ionic Framework provides the _platform controls_ that iOS and Android would, and Tailwind styles your _app content_. This is consistent with traditional native mobile development where much of the UI is standardized and provided by the OS/platform, but can still be customized beyond that to fit your app experience. Of course, any custom elements can be built with just Tailwind and some custom JavaScript, including whole replacements for any of the platform controls provided by Ionic Framework.

## Getting Started

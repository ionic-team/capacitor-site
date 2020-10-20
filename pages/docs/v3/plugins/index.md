---
title: Capacitor Plugins
description: Capacitor Plugins
contributors:
  - mlynch
  - jcesarmobile
  - dotNetkow
---

# Capacitor Plugins

Plugins in Capacitor enable JavaScript to interface directly with Native APIs.

<style>
  .ui-grid {
    column-gap: 20px;
    margin: 0 20px;
  }
  .ui-card p {
    padding: 0;
    margin: 10px 20px 20px 20px;
  }
  .ui-card p.title {
    font-size: 18px;
    font-weight: 700;
    margin: 20px 20px 0 20px;
  }
  .ui-card .title a {
    color: black !important;
    border: 0;
  }
  .ui-card {
    margin: 0;
    overflow: hidden;
    min-height: 200px;
  }
  .ui-card img {
    margin: 0;
  }
  .ui-card .heading-anchor {
    display: none;
  }
</style>
<ui-grid>
  <ui-card class="ui-col ui-col-12 ui-col-xs-12 ui-col-sm-6 ui-col-md-6">
    <img src="/assets/img/docs/core-plugins.png">
    <p class="title"><a href="/docs/apis">Official Plugins</a></p>
    <p>Official Plugins are maintained by the Capacitor team.</p>
  </ui-card>
  <ui-card class="ui-col ui-col-12 ui-col-xs-12 ui-col-sm-6 ui-col-md-6">
    <img src="/assets/img/docs/community-plugins.png">
    <p class="title"><a href="/docs/plugins/community">Community Plugins</a></p>
    <p>Community Plugins are maintained by the <a href="https://github.com/capacitor-community">Capacitor Community</a>.</p>
  </ui-card>
</ui-grid>

Web apps can access the full power of Native APIs with plugins. Plugins wrap common native operations that might use very different APIs across platforms while exposing a consistent, cross-platform API to JavaScript.

Additionally, the plugin capability in Capacitor makes it possible for teams with a mix of traditional native developers and web developers to work together on different parts of the app.

Capacitor automatically generates JavaScript hooks on the client, so most plugins only need to use Swift/Obj-C for iOS and/or Java/Kotlin for Android. Of course, adding custom JavaScript for a plugin is also possible.

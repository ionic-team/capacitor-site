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
  plugin-cards {
    display: flex;
    margin-block-start: -32px;
    margin-inline-start: -16px;
    margin-block-end: 40px;
  }
<<<<<<< HEAD

  plugin-cards .card {
    margin-block-start: var(--space-6);
    margin-inline-start: var(--space-3);;
    padding: var(--space-6) var(--space-5);

    flex-basis: 100%;
    border-radius: var(--radius-2);
    box-shadow: var(--elevation-5);    

    transition: transform .2s ease-out, box-shadow .2s ease-out;
=======
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
>>>>>>> f961e580e2dad48de3f263cf495388aeee3c3c52
  }
  plugin-cards .card p {
    margin-block-end: 0;
  }
  plugin-cards .card:hover, .card:active, .card:focus {
    transform: translateY(-2px);
    box-shadow: var(--elevation-6);
  }

  @media screen and (max-width: 500px) {
    plugin-cards {
      flex-direction: column;
    }   
  }
</style>
<<<<<<< HEAD
<plugin-cards>
  <a class="card" href="/docs/apis">
    <img
      src="/assets/img/docs/core-plugins.png"
      width="40" height="40"
    >
    <p class="ui-heading-5">Core Plugins</p>
    <p class="ui-paragraph-5">Step-by-step guides to setting up your system and installing the framework.</p>
  </a>
  <a class="card" href="/docs/plugins/community">
    <img
      src="/assets/img/docs/community-plugins.png"
      width="40" height="40"
    >
    <p class="ui-heading-5">Community Plugins</p>
    <p class="ui-paragraph-5">Dive into Ionic Framework’s beautifylly designed UI component library.</p>
  </a>
</plugin-cards>
=======
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
>>>>>>> f961e580e2dad48de3f263cf495388aeee3c3c52

Web apps can access the full power of Native APIs with plugins. Plugins wrap common native operations that might use very different APIs across platforms while exposing a consistent, cross-platform API to JavaScript.

Additionally, the plugin capability in Capacitor makes it possible for teams with a mix of traditional native developers and web developers to work together on different parts of the app.

Capacitor automatically generates JavaScript hooks on the client, so most plugins only need to use Swift/Obj-C for iOS and/or Java/Kotlin for Android. Of course, adding custom JavaScript for a plugin is also possible.

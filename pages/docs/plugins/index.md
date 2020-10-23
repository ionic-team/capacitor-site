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

  plugin-cards .card {
    margin-block-start: var(--space-6);
    margin-inline-start: var(--space-3);;
    padding: var(--space-6) var(--space-5);

    flex-basis: 100%;
    border-radius: var(--radius-2);
    box-shadow: var(--elevation-5);    

    transition: transform .2s ease-out, box-shadow .2s ease-out;
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
<plugin-cards>
  <a class="card" href="/docs/apis">
    <img
      src="/assets/img/docs/core-plugins.png"
      width="40" height="40"
    >
    <p class="ui-heading-5">Official Plugins</p>
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

With Plugins, a web app can access the full power of the Native APIs, doing everything a traditional native app can. Plugins are especially great for wrapping common native operations that might use very different APIs across platforms, while exposing a consistent, cross-platform API to JavaScript.

Additionally, the Plugin capability in Capacitor makes it possible for teams with a mix of traditional native developers and web developers to work together on different parts of the app.

Capacitor auto generates JavaScript hooks on the client, so most plugins only need to build a native Swift/Obj-C plugin for iOS, and/or a Java one for Android. Of course, adding custom JavaScript for a plugin is possible, and is just like providing a JavaScript npm package.

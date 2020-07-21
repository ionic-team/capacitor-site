---
title: Security
description: Security best practices for your Capacitor apps
url: /docs/guides/security
contributors:
  - mlynch
---

# Security Best Practices for Capacitor

Every Capacitor developer is responsible for making sure their app is following security best practices. Without proper care, major security issues can crop up which can prove extremely damaging and expensive.

Security is a wide topic, but there are a number of areas that Capacitor developers should audit for security compliance, including Data, Authentication/Deep Linking, Network, and Web View security.

## Data Security

Data Security deals with the security of data stored locally and also in app code.

### Avoid Storing Secrets

One of the most important security tips for Capacitor apps is to _never store secrets_ in the client. That means make sure your code never contains secret API keys, encryption keys, or any other sensitive data that could be easily stolen using basic app analysis techniques.

For apps that must store and work with sensitive values, the _only_ safe way is by using secure keychain/keystore techniques as detailed below.

### Storing Encryption Keys, Session Tokens, etc.

Modern mobile devices and operating systems provide powerful security APIs and dedicated security hardware for storing sensitive values on device. This is how apps provide biometric or secure passcode authentication while managing highly sensitive values such as encryption keys or session tokens.

The APIs that provide this functionality are available in the [iOS Keychain Services](https://developer.apple.com/documentation/security/keychain_services) and [Android Keystore](https://developer.android.com/training/articles/keystore) APIs. These APIs are complex and low-level, so you will likely want to find a plugin that uses them for you.

For enterprise use cases, the Capacitor team provides [Identity Vault](https://ionicframework.com/enterprise/identity-vault) which provides an easy-to-use API and frequently updated experience on top of these native security APIs. Identity Vault can be used with other Capacitor enterprise products such as [Offline Storage](https://ionicframework.com/enterprise/offline-storage) and [Auth Connect](https://ionicframework.com/enterprise/auth-connect) to provide the encryption key or authentication token management component of each experience, respectively.

## Authentication and Deep Linking

Authentication flows in native apps require extra care, since authentication often happens through the use of Custom URL Schemes. Custom URL Schemes, such as `instagram://`, are not globally controlled like web domains are, so it's possible that a malicious app could intercept a request meant for one app by defining and overriding a custom URL scheme. Imagine a secure token being sent to the wrong app!

Generally, an app should never send sensitive data through a Custom URL scheme deep link (newer techniques such as Universal Links are more secure as they rely on actual web domain ownership, see the [Deep Links](./deep-links) guide for details).

This is especially important for oAuth2 flows, where the last step in the authentication experience relies on a deep link back to the app. To mitigate the possibility of a malicious app receiving a token, [PKCE](https://oauth.net/2/pkce/) must be used for oAuth2 in Capacitor apps.

To ensure your oAuth2 flow is secure, make sure your plugin supports PKCE. For enterprise use cases, the official [Auth Connect](https://ionicframework.com/enterprise/auth-connect) Capacitor solution fully supports PKCE for oAuth2 authentication flows.

See this great [oAuth2 Best Practices for Native Apps](https://auth0.com/blog/oauth-2-best-practices-for-native-apps/) guide for more info.

## Network Security

Network security deals with making sure network requests are to trusted endpoints and encrypted to avoid sending sensitive data (such as passwords) in plain text.

### SSL

Apps should only make requests to SSL-enabled endpoints. This means never make request to endpoints with `http://`, but rather always use `https://`. This makes sure data is never sent in plain text.

However, this by itself isn't enough. To avoid possible [man-in-the-middle](https://en.wikipedia.org/wiki/Man-in-the-middle_attack) attacks, SSL certificates should be pinned so only known certificates are accepted. This must be done natively and on both the client and server. Today, the [cordova-plugin-advanced-http](https://github.com/silkimen/cordova-plugin-advanced-http) plugin supports this and there may be other plugins that do as well.

## Web View Security

### Content Security Policy

[Content Security Policy (CSP)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP) is a set of security features available in the browser (and, thus, your Capacitor Web View). CSP can be used to limit the resources the user agent is allowed to load in the Web View (such as images, XHR, videos, Web Sockets, etc).

CSP can be configured in your Capacitor app by adding a `meta` tag to the `<head>` with an acceptable CSP format (CSP can be configured both server and client side using the same format). For example, this configuration would allow all requests to the current origin and `foo.com`:

```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self' foo.com">
```

CSP supports a wide variety of configurations, and the [CSP reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP) is a must-read. Another useful resource is [content-security-policy.com](https://content-security-policy.com/).

### JavaScript Security Techniques

Since the bulk of a Capacitor app is a web app using JavaScript, typical JS security techniques apply.

JS security is beyond the scope of this document, and there are many existing resources out there for proper JS and web app security techniques. Here's [one good one](https://wpengine.com/resources/javascript-security/) to get you started.

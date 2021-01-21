---
title: Capacitor Data Types
description: Data types in Capacitor
---

# Capacitor Data Types

Data moving between the web runtime and native environments in Capacitor have to be serialized and deserialized so that they can be stored natively in each language. The supported data types are those that can be represented in JSON such as numbers, strings, booleans, arrays, and objects (or dictionaries or key-value stores).

## iOS

While Swift is the preferred language on iOS, it interoperates with Objective-C (upon which the system frameworks are built) and so the platform supports the intersection of three languages. Most data types will be translated as expected but there are some cases that may require special attention.

### Null Values

Objective-C does not support storing null values in collections such as arrays, dictionaries, or sets. Instead it uses a special placeholder object, [`NSNull`](https://developer.apple.com/documentation/foundation/nsnull?language=objc), to represent a null value. In contrast, Swift uses [Optionals](https://docs.swift.org/swift-book/LanguageGuide/TheBasics.html) to describe a value that might be null. Swift can manipulate `NSNull` values but Objective-C cannot handle Optionals (although, in some contexts, the runtime will automatically map optionals into the underlying value or `NSNull`). These `NSNull` objects can appear regardless of which language you are using.

As an example, consider the following object being passed to a Capacitor plugin call:

```typescript
{ 'foo': null, 'bar': [1, 2, null, 4]}
```

#### Dictionaries

`CAPPluginCall` stores this data as its `options` property but has a variety of convenience accessors that operate on it. The accessors will cast the value to the expected type(s) so `NSNull` values will get filtered out.

```swift
if let value = call.getString("foo") {
    // GOOD: `value` is nil, so this block won't run
}
```

However, accessing the storage property directly can return an `NSNull` object.

```swift
if call.options["foo"] != nil {
    // BAD: the key returned a truthy `NSNull` object, so this block will run
}
if let value = call.options["foo"] {
    // BAD: `value` is a truthy `NSNull` object, so this block will run
}
```

> It is not recommended to rely on the presence of a key to convey meaning. Always type-check the corresponding value to evaluate it.

#### Arrays

Since accessing an array typically requires typing the whole collection, it is important to consider if it contains a single type or might be heterogenous.

```swift
if let values = call.getArray("bar") {
    // NEUTRAL: the array is all valid objects, so this block will run, but each value will need to be typed individually
}
if let values = call.getArray("bar", Int?) {
    // BAD: the array is a mix of `Int` and `NSNull` and can't be cast to `Int?`, so this block won't run
}
```

To help with this behavior, Capacitor includes a convenience extension that can map an array with `NSNull` values into an array of optionals. It works on the `JSValue` protocol, which represents all of the valid types that can be bridged between environments, but can be cast to a specific subtype.

```swift
if let values = call.getArray("bar").capacitor.replacingNullValues() as? [Int?] {
    // GOOD: `values` is now cast to `Int?` with `nil` at index 2
}
```

---

### Dates

Data moving from the web runtime to native iOS code uses a different mechanism than data going in the other direction. In practice, this difference doesn't matter except for one data type: dates. The WebView can automatically translate JavaScript `Date` objects into native `NSDate` or `Date` objects but dates being returned from a plugin must be serialized as a string.

Consider the following data being passed to a plugin:

```typescript
{ 'foo': new Date(1611144000), 'bar': '2021-01-20T17:00:00+00:00' }
```

The `CAPPluginCall` convenience accessor, `getDate`, will handle both fields by casting the first and parsing the second. It will return native `Date` objects.

```swift
if let date = getDate("foo") {
    // GOOD: `date` is a valid Date, so this block will run
}
if let date = getDate("bar") {
    // GOOD: `date` is a valid Date, so this block will run
}
```

Accessing the `options` dictionary means that the differing types will need to be handled separately:

```swift
if let value = call.options["foo"] as? Date {
    // GOOD: `value` is a valid Date, so this block will run
}
if let value = call.options["bar"] as? Date {
    // BAD: `value` is nil because `String` cannot be cast to `Date`, so this block won't run
}
if let value = call.options["bar"] as? String {
    // NEUTRAL: `value` is a valid `String`, so this block will run, but it will need to be parsed
}
```

However, JSON does not officially include a date type so returning a date from a plugin requires that it be stored as a `String`. By convention, it should be formatted according to the [ISO 8601 standard](https://www.iso.org/iso-8601-date-and-time-format.html) for the most reliable transmission.

```swift
let date = Date()
let formatter = ISO8601DateFormatter()
let result: JSObject = ['date': formatter.string(from: date)]
call.resolve(result)
```

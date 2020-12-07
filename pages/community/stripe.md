---
title: Stripe
description: Stripe plugin for Capacitor apps
contributors:
  - ihadeed
platforms:
  - ios
  - android
categories:
  - payments
---

# Installation

## Basic setup
<br>

#### 1. Install NPM package

```shell
npm i -S @capacitor-community/stripe
```
<br>

#### 2. Import from @capacitor/core
```ts
import { Plugins } from '@capacitor/core';

const { Stripe } = Plugins;
```

#### 3. Provide your publishable key
```ts
Stripe.setPublishableKey({ key: 'Your key here' });
```

<br><br>

## Android Setup

<br>

#### Requirements
This plugin requires `@capacitor/android@2.0.0` or higher as it relies on Android X support.

<br>

#### Basic setup
Include the plugin in your app's `MainActivity.java` file:
```java
//
// other imports
// ...

// 1. Import Stripe plugin
import ca.zyra.capacitor.stripe.Stripe;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Initializes the Bridge
        this.init(savedInstanceState, new ArrayList<Class<? extends Plugin>>() {{
            //
            // other plugins
            // ...

            // 2. Add Stripe plugin here
            add(Stripe.class);
        }});
    }
}
```

<br>

#### Google Pay
To enable payments using Google Pay you must add the following `<meta-data>` tag to `AndroidManifest.xml` inside the  
main `<application />` tag:
```xml
<application
  ...
  <meta-data
    android:name="com.google.android.gms.wallet.api.enabled"
    android:value="true" />
</application>
```

There is no need to add any Gradle dependencies as they are already included with this plugin.

> Review the steps outlined here for more details on [Going live with Google Pay](https://stripe.com/docs/google-pay#going-live-with-google-pay).

<br><br>

## iOS Setup
To enable payments using Apple Pay you must follow the first 3 steps in [this guide](https://stripe.com/docs/apple-pay#native):

- 1. [Register for Apple Merchant ID](https://stripe.com/docs/apple-pay#merchantid)
- 2. [Create a new Apple Pay certificate](https://stripe.com/docs/apple-pay#csr)
- 3. [Integrate with Xcode](https://stripe.com/docs/apple-pay#setup)

 
 # Usage Example
 
 
 ## Initializing the plugin
 ```ts
 import { Plugins } from '@capacitor/core';
 
 const { Stripe } = Plugins;
 
 ...
 
 await Stripe.setPublishableKey('pk_test_....');
 ```
 
 ## Validating card information
 ```ts
 const { valid } = await Stripe.validateCardNumber({ number: '424242424242' });
 // valid: true
 
 const { valid } = await Stripe.validateExpiryDate({ exp_month: 12, exp_year: 25 });
 // valid: true
 
 const { valid } = await Stripe.validateCVC({ cvc: '244' });
 // valid: true
 ```
 
 ## Creating card token 
 ```ts
 const res = await Stripe.createCardToken({
   number: '4242424242424242',
   exp_month: 12,
   exp_year: 25,
   cvc: '224',
 });
 
 // {
 //    id: 'tok_....',
 //    card: {
 //      last4: '4242',
 //      exp_month: 12,
 //      exp_year: 25,
 //    }
 // }
 ```
 
 ## Confirming setup intent
 ```ts
 const clientSecret: string = 'secret from your API';
 
 const res = await Stripe.confirmSetupIntent({
   clientSecret,
   card: {
       number: '4242424242424242',
       exp_month: 12,
       exp_year: 25,
       cvc: '224',
   },
   redirectUrl: 'https://app.myapp.com', // Required for Android
 });
 ```
 
 ## Confirming payment intent
 ```ts
 const clientSecret: string = 'secret from your API';
 
 //
 // confirm with card
 await Stripe.confirmPaymentIntent({
   clientSecret,
   card: {
       number: '4242424242424242',
       exp_month: 12,
       exp_year: 25,
       cvc: '224',
   },
   redirectUrl: 'https://app.myapp.com', // Required for Android
 });
 
 //
 // confirm with apple pay
 await Stripe.confirmPaymentIntent({
   clientSecret,
   applePayOptions: {
     // options here
     merchantId: 'merchant.company',
     country: 'CA',
     currency: 'CAD',
     items: [
       {
         label: 'Some item',
         amount: '50', // amount in dollars
       }
     ]
   },
 });
 
 //
 // confirm with payment method id
 await Stripe.confirmPaymentIntent({
   clientSecret,
   paymentMethodId: 'pm_...',
 });
 
 //
 // confirm with Google Pay
 await Stripe.confirmPaymentIntent({
   clientSecret,
   fromGooglePay: true,
   googlePayOptions: { // just demo options
     currencyCode: 'CAD',
     totalPrice: 500.00,
     totalPriceStatus: 'FINAL',
     allowedAuthMethods: ['PAN_ONLY'],
     allowedCardNetworks: ['VISA'],
   },
 });
 ```
 
 ## Payment methods
 
 ```ts
 // ephemeral key issued by your API
 const ephemeralKey = {
   id: 'eph_....',
   object: 'ephemeral_key',
   secret: '....',
   ...
 };
 
 await Stripe.initCustomerSession(ephemeralKey);
 
 // get payment methods
 const { paymentMethods } = await Stripe.customerPaymentMethods();
 
 // add new payment method
 const token = 'tok_....'; // token from createCardToken
 await Stripe.addCustomerSource({ sourceId: token });
 
 // set payment method as default
 // (Android only)
 const sourceId = 'card_....';
 await Stripe.setCustomerDefaultSource({ sourceId });
 ```

 

---
sidebar_position: 3
title: Payment & Licensing
description: How to test LemonSqueezy payments and manage licenses.
---

# Payment & Licensing

Undergrowth uses **LemonSqueezy** for processing payments and managing licenses. This guide explains how to test the payment flow and handle license keys.

## Testing Payments

You can test the checkout process without using real money by enabling **Test Mode**.

### 1. Enable Test Mode
1.  Log in to your [LemonSqueezy Dashboard](https://app.lemonsqueezy.com/).
2.  In the bottom-left corner, switch the toggle from **Live** to **Test**.
3.  **Important**: You must generate a new **API Key** while in Test Mode. API keys are specific to the mode they were created in.
    *   Go to **Settings > API**.
    *   Create a new key (e.g., `Test Mode Key`).
    *   Set this key as your `LEMONSQUEEZY_API_KEY` environment variable in your deployment.

### 2. Test Card Numbers
When making a purchase in Test Mode, use the following card details to simulate different scenarios:

| Scenario | Card Number | Expiry | CVC | Zip |
| :--- | :--- | :--- | :--- | :--- |
| **Successful Payment** | `4242 4242 4242 4242` | Any future date (e.g., `12/34`) | `123` | `12345` |
| **Card Declined** | `4000 0000 0000 0002` | Any future date | `123` | `12345` |
| **3D Secure Challenge**| `4000 0027 6000 3184` | Any future date | `123` | `12345` |

### 3. Simulating Webhooks (Optional)
If you have configured webhooks, you can manually trigger "Order Created" or "License Key Created" events from the LemonSqueezy dashboard settings to test your backend integration.

## License Management

### License Tiers
The Undergrowth API automatically maps LemonSqueezy product variants to software editions:
*   **Variant Name** containing "Pro" -> **Pro Edition**
*   **Variant Name** containing "Team" -> **Team Edition**
*   **Other/Default** -> **Starter Edition**

### Validation Logic
When a license is activated via the `/activate` endpoint:
1.  The system calls the LemonSqueezy API to verify the key.
2.  It checks if the **Email Address** provided matches the email on the license.
3.  It checks if the license is **Active** and not expired.

> **Note**: For local development, if you do not have a LemonSqueezy API key, the system defaults to "Starter" edition unless you use the specific test key `test_key` (which activates Pro mode).

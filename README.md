# Mass Actions

[![MIT license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/clarkwinkelmann/flarum-ext-mass-actions/blob/master/LICENSE.md) [![Latest Stable Version](https://img.shields.io/packagist/v/clarkwinkelmann/flarum-ext-mass-actions.svg)](https://packagist.org/packages/clarkwinkelmann/flarum-ext-mass-actions) [![Total Downloads](https://img.shields.io/packagist/dt/clarkwinkelmann/flarum-ext-mass-actions.svg)](https://packagist.org/packages/clarkwinkelmann/flarum-ext-mass-actions) [![Donate](https://img.shields.io/badge/paypal-donate-yellow.svg)](https://www.paypal.me/clarkwinkelmann)

This extension adds the ability to perform grouped actions on discussions through checkboxes.
A future version might re-use the logic for users.

On the discussion list, use the checkbox control in the top left or hover a discussion to select.
Once discussions are selected, the controls on the top right will change to show available mass actions.

The list of buttons appearing depends on the permissions the actor has.

Change "View mass selection controls" permission in the admin panel to configure who can see the checkboxes.
This control is only visual, and doesn't impact REST API permissions or rate limiting.

Currently supported features:

- Mark as read
- Delete/restore (soft delete only)
- Lock/unlock
- Set tags (exact list)
- Add tag (to existing list)

Technical details: current implementation uses existing REST API endpoints and loops through discussions client-side.
All API requests are dispatched at the same time, so this means there could be rate limiting issues.

This version has not been optimized for mobile.
It's probably a good idea to only make it visible to moderators for now.

> The intent is to integrate this UI/feature into Flarum in a future release. Please leave feedback on your experience, so we can see what needs tweaking!

## Installation

    composer require clarkwinkelmann/flarum-ext-mass-actions

## Support

This extension is under **minimal maintenance**.

It was developed for a client and released as open-source for the benefit of the community.
I might publish simple bugfixes or compatibility updates for free.

You can [contact me](https://clarkwinkelmann.com/flarum) to sponsor additional features or updates.

Support is offered on a "best effort" basis through the Flarum community thread.

## Links

- [GitHub](https://github.com/clarkwinkelmann/flarum-ext-mass-actions)
- [Packagist](https://packagist.org/packages/clarkwinkelmann/flarum-ext-mass-actions)
- [Discuss](https://discuss.flarum.org/d/30122)

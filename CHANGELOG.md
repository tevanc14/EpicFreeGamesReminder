# Changelog

## [3.0.3] - 2021-07-10

Changed

- Selectors

## [3.0.2] - 2020-10-30

Added

- Exclude the dumb free games that are always there

Changed

- Selectors

## [3.0.1] - 2020-08-25

Changed

- Selectors (going to just do bugfixes since it's not really doing anything significant and will happen often)

## [3.0.0] - 2020-08-13

Changed

- Consolidated image information to one property (major change)
- Selectors in variables

## [2.6.0] - 2020-07-23

Added

- Check if there are titles returned, and don't send an email if there aren't

Changed

- Title and subtitle selectors

## [2.5.0] - 2020-07-16

Changed

- Title and subtitle selectors back (don't know what they are doing)

## [2.4.1] - 2020-07-16

Changed

- Resolved lodash security vulnerability

## [2.4.0] - 2020-07-16

Changed

- Title and subtitle selectors

## [2.3.0] - 2020-06-25

Added

- Handle the "More Free Games" section of the page

Changed

- Using the dry run actually works

## [2.2.0] - 2020-05-15

Added

- When a "mystery game" is scraped, get the countdown and create a start date and ignore the end date
- Dry run mode for local testing

## [2.1.0] - 2020-05-07

Added

- Don't consider "mystery games" when checking for a new game. These include timestamps so they will always seem to be new.

## [2.0.0] - 2020-02-15

Changed

- Identifiers for elements that were changed on the Epic site

## [1.4.0] - 2020-01-30

Removed

- Time on email to avoid giving wrong time zone in emails (plus it is a little cleaner looking)

## [1.3.1] - 2020-01-30

Changed

- Forced the Sendpulse API call to block so it will get done during function execution
- Breaking in HTML template

## [1.3.0] - 2020-01-29

Added

- Description in README
- More `package.json` documentation fields

## [1.2.1] - 2020-01-28

Removed

- Main invocation in `index.js`

## [1.2.0] - 2020-01-23

Changed

- Alert for new games based on only game titles

## [1.1.1] - 2020-01-23

Changed

- Only log when no new game is found and not during each execution

## [1.1.0] - 2020-01-23

Added

- Log when no new game is found

## [1.0.0] - 2020-01-17

Added

- Functioning deploy process

Changed

- Tuned email template

## [0.4.0] - 2020-01-16

Changed

- Rewrote (untested) email template

## [0.3.0] - 2020-01-02

Added

- Dynamic email template (without images, kinda functioning)
- Cloud function deployment

## [0.2.0] - 2019-12-22

Added

- Check if latest file exists to account for the first run with no prior data

Changed

- Parse the GCS data to JSON instead of moving around a byte array

## [0.1.0] - 2019-12-22

Added

- Able to scrape the page for information and store results in a GCS bucket

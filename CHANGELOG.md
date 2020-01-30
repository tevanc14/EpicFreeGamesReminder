# Changelog

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

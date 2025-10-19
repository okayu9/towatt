# Microwave Heating Time Converter – Requirements

## Overview
- Single-page tool that converts microwave heating time between different wattages for quick reference on smartphones.
- Accepts wattage and heating time from a food label, then converts to the user’s preferred target wattage.
- Target wattage can be stored in the URL (for example, `?target=600`) so users can bookmark specific presets.

## Usage Scenarios
- First visit without a target wattage prompts the user to set one and shows the bookmark-friendly URL.
- Visiting with a `target` query parameter opens the conversion screen directly.
- Households using multiple microwaves can keep separate bookmark URLs for each wattage.

## Input Rules
- Label wattage selection offers presets (1500W / 700W / 600W / 500W) plus a manual numeric input.
- Manual wattage input accepts integers between 100 and 3000 inclusive, without additional step constraints.
- Heating time is entered via an on-screen keypad as a four-digit value (`0130` → 1 minute 30 seconds).
- Conversion does not run until four digits are entered; guidance is shown while input is incomplete.
- Once four digits are available, the UI transitions to the result view automatically.
- Keypad contains digits 0–9 along with Clear and Backspace controls.
- Only a single lowercase query parameter is used for the target wattage.
- When the target wattage is absent or invalid, the setup view is displayed and invites the user to set it.

## Output Rules
- The converted heating time is displayed in minutes and seconds, with optional supplementary seconds text.
- The top of the screen highlights both the input values and the conversion result for quick confirmation.
- After configuration, the UI prompts the user to bookmark the page for faster reuse.

## User Experience
- Layout favors one-handed smartphone operation with large buttons and generous touch targets.
- Automatic transition from input to result view once the required digits are entered.
- Application state relies on URL query parameters so repeated visits reproduce the same experience.


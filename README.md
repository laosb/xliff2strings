# xliff2strings

Turns Xcode-generated XLIFF files to .strings files.

## Why

For SwiftUI projects, it's more efficient to export localization from Xcode (which uses Swift compiler to extract strings) than collect them yourself. But, Weblate and many other in-flow translation platforms only supports .strings for that matter.

This quick CLI turns Xcode-generated XLIFF files (in `yourproject Localizations/*.xcloc/Localized Contents/*.xliff`) to plain .strings file, with untranslated strings filled with original text. This should be only used with source language and your translation platform should generate other .strings for corresponding languages.

## Usage

```sh
npm i -g xliff2strings
xliff2strings "yourproject Localizations/en.xcloc/Localized Contents/en.xliff"

# More options
xliff2strings help
```

## License

[MIT](https://laosb.mit-license.org).

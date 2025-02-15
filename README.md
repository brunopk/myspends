# Mis gastos

## How to use the App Script

1. [Create spread sheets](doc/Spreadsheets.md).
2. [Create the site with Google Sites](doc/Site.md).
3. Copy the correct project id to *.clasp.json* and upload the content to Google Apps Script with `clasp push`.
4. Edit [src/Config.gs](src/Config.ts) on Google Apps Script with the corresponding [configurations](doc/ConfigFile.md).
5. Copy the content of *html/GSite.html* to Google Site and follow instructions in section "Google Site" below.
6. Upload the content :

   ```shell
   clasp push
   ```

7. Set the corresponding triggers for Google Apps Script (function `processGoogleFormInput`).

The format for *.clasp.json* is the following:

```json
{
  "scriptId":"19xyz",
  "rootDir":"/Users/user/mis-gastos"
}
```

## Development

Node version: 16.17.0

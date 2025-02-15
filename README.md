# Mis gastos

**Node version:** 16.17.0

---

1. Copy the correct project id to *.clasp.json* and upload the content to Google Apps Script with `clasp push`.
2. Edit *src/Config.gs* on Google Apps Script with the corresponding [configurations](doc/ConfigFile.md).
3. Copy the content of *html/GSite.html* to Google Site and follow instructions in section "Google Site" below.
4. Upload the content :

   ```shell
   clasp push
   ```

The format for *.clasp.json* is the following:

```json
{
  "scriptId":"19qnNqPDCRF2qnT4dgZwHoUCzuFEjC4eY5nDzN74dEeYi8n3cckM5wdhg",
  "rootDir":"/Users/youruser/git/mis-gastos"
}
```

1. Set the corresponding triggers for Google Apps Script (function `processGoogleFormInput`).

## Google Site

After copying the HTML edit the following constants :

- `categoryTree` (categories and subcategories must match with names in sheets).
- `defaultCategory` 
- `defaultSubCategory` (this is the default sub-category. It may also appear in the categoryTree if, for example, a category includes this default sub-category, but it is not mandatory)
- `defaultAccountList`
- `forms`

## Spread sheets

When creating spreadsheets and sheets don't forget :

- Category sheets within the *Monthly* spreadsheet **must be** named with valid category names.
- Account sheets withing the *Monthly* spreadsheet **must be** named with valid account names.
- The last column for all sheets is the total column.

For more information refer to [doc/Spreadsheets](doc/Spreadsheets.md).

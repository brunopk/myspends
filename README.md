# Mis gastos

**Node version:** 16.17.0

---

1. Copy the correct project id to *.clasp.json* and upload the content to Google Apps Script with `clasp push`.
2. Edit *src/Config.gs* on Google Apps Script with the corresponding configurations :
  
   - For `RecurrentSpend` elements, value for `value` **must be** *Automatic* or *Manual* (strings).
   - Category and subcategory names should match with names in spreadsheets as described below.
   - `forms.sheets` within *src/Config.gs* **must have** two keys: `main` and `reimbursements` for main and reimbursements forms respectively.
     - `forms.sheets.main.columns` and `forms.sheets.reimbursements.columns` **must have** the following keys to indicate column numbers:
       - `category`
       - `date`
       - `amount`
       - `subCategory`
       - `account`
       - `description`
     - Values for previously mentioned keys of `forms.sheets.main.columns` and `forms.sheets.reimbursements.columns` **must be** the same.
   - `spreadSheets` within *src/Config.gs* **must have** one object `main` to configure the main spreadsheet.
     - `main.sheets` **must have** two objects: `main.sheets.main` and `main.sheets.recurrentSpends`, one for the main sheet and the other for recurrent spends.
     - `main.sheets.main.columns` **must have** the following keys to indicate column numbers:
       - `category`,
       - `subCategory`
       - `date`
       - `amount`
       - `account`
       - `origin`
     - `main.sheets.recurrentSpends.columns` **must have** the following keys to indicate column numbers:
       - `timestamp`
       - `taskId`
       - `category`
       - `description`
       - `account`
       - `amount`
       - `completed`
     - The following keys are optional in `main.sheets.recurrentSpends.columns`:
       - `subCategory`
   - `spreadSheets` within *src/Config.gs* may have other objects of type `SpreadSheetConfig` representing other spread sheet with any number of sheets.
   - `*.sheets.*.columns` **must have** the `Total` key.
   - `*.sheets.*.columns` may have the `Reimbursement` (or `Devolución`) key.
   - Values on `*.class` must match with a spread sheet handler (classes in *src/spreadsheets* that extends from `BaseSpreadSheetHandler`).
   - Values on `*.sheets.*.class` must match with a sheet handler (classes in *src/spreadsheets* that extends from `BaseSheetHandler`).
3. Copy the content of *html/GSite.html* to Google Site and follow instructions in section "Google Site" below.
4. Upload the content :

   ```shell
   clasp push
   ```

5. Set the corresponding triggers for Google Apps Script (function `processGoogleFormInput`).

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

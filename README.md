# Mis gastos

**Node version:** 16.17.0

1. Copy the correct project id to *.clasp.json* and upload the content to Google Apps Script with `clasp push`.
2. Edit *src/Config.gs* on Google Apps Script with the corresponding configurations :
  
   - For `RecurrentSpendConfig` elements, value for `value` **must be** *Automatic* or *Manual* (strings).
   - Category and subcategory names should match with names in spreadsheets as described below.
   - `spreadSheets` configuration within *src/Config.gs* **must have** two keys: `main` and `monthly` for the main and monthly spreadsheets respectively.
   - The object in `main.sheets` **must have** two keys: `main` and `pending`, one which correspond to the main sheet and the other for recurrent spends pending confirmation.
   - The object in `main.sheets.main.columns` **must have** the following keys :
     - `category`,
     - `subCategory`
     - `date`
     - `amount`
     - `account`
     - `origin`
   - The object in `main.sheets.pending.columns` **must have** the following keys :
     - `timestamp`
     - `taskId`
     - `category`
     - `subCategory`
     - `description`
     - `account`
     - `amount`
     - `completed`
3. Copy the content of *html/GSite.html* to the corresponding part of the Google Site in order to edit the web interface.

When creating spreadsheets and sheets don't forget :

- Category sheets within the *Monthly* spreadsheet **must be** named with valid category names.
- Account sheets withing the *Monthly* spreadsheet **must be** named with valid account names.
- The last column for all sheets is the total column.

# Mis gastos

**Node version:** 16.17.0

---

1. Copy the correct project id to *.clasp.json* and upload the content to Google Apps Script with `clasp push`.
2. Edit *src/Config.gs* on Google Apps Script with the corresponding configurations :
  
   - For `RecurrentSpendConfig` elements, value for `value` **must be** *Automatic* or *Manual* (strings).
   - Category and subcategory names should match with names in spreadsheets as described below.
   - `forms.formSheet` within *src/Config.gs* **must have** two keys: `main` and `reimbursements` for main and reimbursements forms respectively.
     - `main.sheets.main.columns` **must have** the following keys to indicate column numbers:
       - `date`,
       - `isCash`
       - `account`
       - `amount`
   - `spreadSheets` within *src/Config.gs* **must have** two keys: `main` and `monthly` for the main and monthly spreadsheets respectively.
     - `*.sheets.*.columns` **must have** `Total` for the total column.
     - `main.sheets` **must have** two keys: `main` and `pending`, one which correspond to the main sheet and the other for recurrent spends pending confirmation.
     - `main.sheets.main.columns` **must have** the following keys to indicate column numbers:
       - `category`,
       - `subCategory`
       - `date`
       - `amount`
       - `account`
       - `origin`
     - `main.sheets.pending.columns` **must have** the following keys to indicate column numbers:
       - `timestamp`
       - `taskId`
       - `category`
       - `description`
       - `account`
       - `amount`
       - `completed`
     - The following keys are optional in `main.sheets.pending.columns`:
       - `subCategory`
     - `monthly.sheets.*.columns` **must** include the following columns:
       - `Total`
       - `Reimbursement` (`Devolución`)
3. Copy the content of *html/GSite.html* to the corresponding part of the Google Site in order to edit the web interface. Take into account that available options for dropdowns in Google Forms must match with options in the HTML.
4. Upload the content :

   ```shell
   clasp push
   ```

5. Set the corresponding triggers for Google Apps Script (function `processGoogleFormInput`).

---

When creating spreadsheets and sheets don't forget :

- Category sheets within the *Monthly* spreadsheet **must be** named with valid category names.
- Account sheets withing the *Monthly* spreadsheet **must be** named with valid account names.
- The last column for all sheets is the total column.

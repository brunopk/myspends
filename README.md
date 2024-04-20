# Mis gastos

**Node version:** 16.17.0

1. Copy the correct project id to *.clasp.json* and upload the content to Google Apps Script with `clasp push`.
2. Edit *src/Config.gs* on Google Apps Script with the corresponding configurations.
3. Copy the content of *html/GSite.html* to the corresponding part of the Google Site file in order to edit the web interface.

When creating spreadsheets and sheets don't forget :

- Category sheets within the "Monthly" spreadsheet **must be** named with valid category names.
- Account sheets withing the "Monthly" spreadsheet **must be** named with valid account names.
- The last column for all sheets is the total column.

import { google, GoogleApis } from "googleapis"

// TODO: CONTINUE
// TODO: test buildColumnChart
// TODO: continue sendHistoricData creating a function to extract the corresponding data from all categories sheet to build the column chart

/**
 * Helper function to build
 * [column charts](https://developers-dot-devsite-v2-prod.appspot.com/chart/interactive/docs/gallery/columnchart).
 * For more information also see
 * [ColumnChartBuilder](https://developers.google.com/apps-script/reference/charts/column-chart-builder).
 * @param data Data used to generate the chart.
 * @param title Char title
 * @param xAxisTitles Axis titles for columns.
 * @returns Returns `GoogleAppsScript.Base.BlobSource` containing generated chart (image) as binary data.
 */
function buildColumnChart(data: any[][], title: string, xAxisTitles: string[]): GoogleAppsScript.Base.BlobSource {
  if (data.length !== xAxisTitles.length) {
    throw new Error(
      `Number of rows (${data.length}) do not match with number titles for x axis (${xAxisTitles.length})`
    )
  }

  const rowLength = data[0].length
  const dataTable = Charts.newDataTable()
  data.forEach((currentRow, index) => {
    if (currentRow.length !== rowLength) {
      throw new Error(`Row ${index} do not match with expected row length (${rowLength})`)
    }
    dataTable.addRow(currentRow)
  })

  const chartBuilder = Charts.newColumnChart().setTitle(title).setDimensions(600, 500).setDataTable(dataTable)
  xAxisTitles.forEach((xAxisTitle) => chartBuilder.setXAxisTitle(xAxisTitle))

  return chartBuilder.build()
}

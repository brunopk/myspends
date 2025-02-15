import { google, GoogleApis } from "googleapis"

// TODO: CONTINUE
// TODO: continue sendReport creating a function to extract the corresponding data from all categories sheet to build the column chart

/**
 * Helper function to build
 * [column charts](https://developers-dot-devsite-v2-prod.appspot.com/chart/interactive/docs/gallery/columnchart).
 * For more information also see
 * [ColumnChartBuilder](https://developers.google.com/apps-script/reference/charts/column-chart-builder).
 * @param data Data used to generate the chart. All rows must have the same length.
 * @param title Chart title
 * @param rowLabel Label for each row. It will be displayed as a point in the x axis
 * @param columnLabels label for each column
 * @param xAxisTitle Title for the x axis.
 * @returns Returns `GoogleAppsScript.Base.BlobSource` containing the generated chart image as binary data.
 */
function buildColumnChart(
  data: number[][],
  title: string,
  rowLabel: string[],
  columnLabels: string[],
  xAxisTitle: string
): GoogleAppsScript.Base.BlobSource {
  console.info("Building column chart")

  // Validates data and builds data table
  const dataTable = Charts.newDataTable()
  dataTable.addColumn(Charts.ColumnType.STRING, columnLabels[0])
  columnLabels.forEach((columnLabel) => dataTable.addColumn(Charts.ColumnType.NUMBER, columnLabel))

  const rowLength = data[0].length
  data.forEach((currentRow, index) => {
    if (currentRow.length !== rowLength) {
      throw new Error(`Row ${index} do not match with expected row length (${rowLength})`)
    }
    dataTable.addRow([rowLabel[index], ...currentRow])
  })

  const chartBuilder = Charts.newColumnChart()
    .setTitle(title)
    .setXAxisTitle(xAxisTitle)
    .setDimensions(600, 500)
    .setDataTable(dataTable)

  return chartBuilder.build()
}

/**
 * Helper function to build
 * [pie charts](https://developers-dot-devsite-v2-prod.appspot.com/chart/interactive/docs/gallery/piechart).
 * For more information also see
 * [PieChartBuilder](https://developers.google.com/apps-script/reference/charts/pie-chart-builder).
 * @param data Data used to generate the chart. The length of each row must match with `labels`.
 * @param labels Label for each quantity in `data`
 * @param title Chart title
 * @returns Returns `GoogleAppsScript.Base.BlobSource` containing the generated chart image as binary data.
 */
function buildPieChart(data: any[][], labels: string[], title: string): GoogleAppsScript.Base.BlobSource {
  console.info("Building pie chart")

  // Validates data and builds data table
  const dataTable = Charts.newDataTable()
  dataTable.addColumn(Charts.ColumnType.STRING, labels[0])
  dataTable.addColumn(Charts.ColumnType.NUMBER, labels[1])
  data.forEach((row) => {
    if (row.length !== 2) {
      throw new Error(`Each row item must have two columns, one for name and value`)
    }
    dataTable.addRow(row)
  })

  const chartBuilder = Charts.newPieChart().setTitle(title).setDimensions(600, 500).setDataTable(dataTable)

  return chartBuilder.build()
}

/**
 * Helper function to build
 * [line charts](https://developers-dot-devsite-v2-prod.appspot.com/chart/interactive/docs/gallery/linechart).
 * For more information also see
 * [LineChartBuilder](https://developers.google.com/apps-script/reference/charts/line-chart-builder).
 * @param data Data used to generate the chart. The length of each row must match with `labels`.
 * @param label label for the line (values in y axis)
 * @param title Chart title
 * @param xAxisTitle Title for the x axis.
 * @param yAxisTitle Title for the y axis.
 * @returns Returns `GoogleAppsScript.Base.BlobSource` containing the generated chart image as binary data.
 */
function buildLineChart(
  data: number[][],
  label: string,
  title: string,
  xAxisTitle: string,
  yAxisTitle: string
): GoogleAppsScript.Base.BlobSource {
  console.info("Building line chart")

  // Validates data and builds data table
  const dataTable = Charts.newDataTable()
  dataTable.addColumn(Charts.ColumnType.NUMBER, "")
  dataTable.addColumn(Charts.ColumnType.NUMBER, label)
  data.forEach((row) => {
    if (row.length !== 2) {
      throw new Error(`Each row item must have two columns, one for name and value`)
    }
    dataTable.addRow(row)
  })

  const chartBuilder = Charts.newLineChart()
    .setTitle(title)
    .setXAxisTitle(xAxisTitle)
    .setYAxisTitle(yAxisTitle)
    .setDimensions(600, 500)
    .setCurveStyle(Charts.CurveStyle.NORMAL)
    .setPointStyle(Charts.PointStyle.MEDIUM)
    .setDataTable(dataTable)

  return chartBuilder.build()
}

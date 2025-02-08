function buildRecurrentSpendHtmlMailBody(recurrentSpend: RecurrentSpend, recurrentSpendTaskId: string) {
  let result = `<span>${recurrentSpend.mailBody}</span><br><br>`
  result += `<span>Task ID: ${recurrentSpendTaskId}</span><br>`

  switch (recurrentSpendsLanguage) {
    case "es":
      result += `<span>Fecha: ${formatDate(new Date(), 1)}</span><br>`
      break
    case "en":
      result += `<span>Date: ${formatDate(new Date(), 1)}</span><br>`
      break
    default:
      throw new Error(`Invalid language ${recurrentSpendsLanguage}, allowed values are 'es' or 'en'}`)
  }

  return result
}

function buildHistoricDataMail(chart: GoogleAppsScript.Base.BlobSource): GoogleAppsScript.Mail.MailAdvancedParameters {
  const imageKey = "chart_1"
  const htmlBody = `<img src="cid:${imageKey}" />`
  return {
    htmlBody,
    inlineImages: {
      [imageKey]: chart
    }
  }
}

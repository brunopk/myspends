// Form sheet
const CATEGORY_COLUMN = 3
const DATE_COLUMN = 2
const VALUE_COLUMN = 9
const SUBCATEGORY_COLUMN = 4
const SUBCATEGORY_COLUMN_1 = 5
const SUBCATEGORY_COLUMN_2 = 6
const ACCOUNT_COLUMN = 8

// Monthly sheet
const MONTHLY_SHEET_NAME = "Mensual"

// Other constants
const ACCOUNT_1 = "Itaú"
const SHEET_FOR_ACCOUNT_1 = "Mensual Itaú"

const ACCOUNT_2 = "BROU"
const SHEET_FOR_ACCOUNT_2 = "Mensual BROU"

const ACCOUNT_3 = "Itaú Alimentos"

const ACCOUNT_4 = "Cuenta de Papá"
const SHEET_FOR_ACCOUNT_4 = "Mensual Cuenta de Papá"

const ACCOUNT_SHEETS = [SHEET_FOR_ACCOUNT_1, SHEET_FOR_ACCOUNT_2, SHEET_FOR_ACCOUNT_4]

const CATEGORY_1 = "Comida"
const CATEGORY_1_SHEET_NAME = "Mensual Comida"
const CATEGORY_1_NUMBER_OF_SUBCATEGORIES = 2
const CATEGORY_1_SUBCATEGORY_1 = "Mercado Pago (70% OFF)"
const CATEGORY_1_SUBCATEGORY_2 = "VISA Alimentos"

const CATEGORY_2 = "Transporte"
const CATEGORY_2_SHEET_NAME = "Mensual Transporte"
const CATEGORY_2_NUMBER_OF_SUBCATEGORIES = 4

const INCOME = 117168
const TASKS_LIST = ""
const TASK_TITLE_TEMPLATE = "Verificar pago de X"
const TASK_DESCRIPTION_TEMPLATE = "Verificar pago de X realizado el día Z desde Y"
const MAIL_RECIPIENT = ""
const MAIL_SUBJECT = "Gasto recurrente agregado a planilla de gastos"
const MAIL_BODY = "Se agrego %S a la planilla de gastos. Verificar el pago realizado desde %A el día %D"
const MAIN_SHEET = "Gastos"
const RECURRENT_SPEND_DESCRIPTION_FOR_MAIN_SHEET = "Gasto recurrente"
const RECURRENT_SPENDS = [
  {
    name: "SUAT",
    day: 25,
    value: 1000,
    category: "Salud",
    subCategory: "SUAT",
    account: "BROU"
  }
]

const FORMS = {
  MAIN: {
    NAME: "Principal",
    COLUMNS: {
      CATEGORY: 3,
      DATE: 2,
      VALUE: 9,
      SUBCATEGORY: 4,
      ACCOUNT: 8,
      DESCRIPTION: 9,
      DISCOUNT_APPLIED: 0
    }
  }
}

const CATEGORIES = {
  CATEGORY_1: {
    NAME: "Comida"
  },
  CATEGORY_2: {
    NAME: "Transporte",
    SUBCATEGORIES: {
      SUBCATEGORY_1: "Bus",
      SUBCATEGORY_2: "Nafta",
      SUBCATEGORY_3: "Taxi",
      SUBCATEGORY_4: "Uber"
    }
  },
  CATEGORY_3: {
    NAME: "Psicólogo"
  },
  CATEGORY_4: {
    NAME: "Celular"
  },
  CATEGORY_5: {
    NAME: "Otros"
  },
  CATEGORY_6: {
    NAME: "Salud"
  }
}

const ACCOUNTS = {
  ACCOUNT_1: "Itaú",
  ACCOUNT_2: "BROU",
  ACCOUNT_3: "Cuenta de Papá",
  ACCOUNT_4: "Itaú Alimentos"
}

const YES = "Si"

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

const INCOME = 1

const TASKS_LIST = "TUg5NVN0TjNGdEJqTlEtVQ"

const TASK_TITLE_TEMPLATE = "Verificar pago de X"

const TASK_DESCRIPTION_TEMPLATE = "Verificar pago de X realizado el día Z desde Y"

const MAIL_RECIPIENT = ""

const MAIL_SUBJECT = "Gasto recurrente agregado a planilla de gastos"

const MAIL_BODY = "Se agrego %S a la planilla de gastos. Verificar el pago realizado desde %A el día %D"

const RECURRENT_SPEND_DESCRIPTION = "Gasto recurrente"

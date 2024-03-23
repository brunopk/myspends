// Columns numbers starts with 0

const forms:  { [name: string]: FormConfig } = {
  main: {
    spreadSheet: {
      columns: {
        category: 3,
        date: 2,
        value: 9,
        subCategory: 4,
        account: 8,
        description: 9
      }
    }
  }
}

const categories: { [name: string]: CategoryConfig } = {
  category1: {
    name: "Comida",
    column: 3,
    totalColumn: 0,
    subCategories: {
      subCategory1: {
        name: "Mercado Pago (70% OFF)",
        column: 2
      },
      subCategory2: {
        name: "VISA Alimentos",
        column: 3
      }
    }
  },
  category2: {
    name: "Transporte",
    column: 6,
    totalColumn: 0,
    subCategories: {
      subCategory1: {
        name: "Bus",
        column: 2
      },
      subCategory2: {
        name: "Nafta",
        column: 3
      },
      subCategory3: {
        name: "Taxi",
        column: 4
      },
      subCategory4: {
        name: "Uber",
        column: 5
      }
    }
  },
  category3: {
    name: "Psicólogo",
    column: 4
  },
  category4: {
    name: "Celular",
    column: 2
  },
  category5: {
    name: "Otros",
    column: 7
  },
  category6: {
    name: "Salud",
    column: 5
  }
}

const accounts: { [name: string]: string } = {
  account1: "",
  account2: "",
  account3: ""
}

const sheetType = {
  category: 0,
  account: 1
}

const spreadSheetConfig : { [name: string]: SpreadSheetConfig } = {
  main: {
    id: "1r93R3hKOCV6St4sac_88YZRM6OuYO9LxaxwMa2gWomE",
    name: "Principal",
    sheets: {
      main: {
        name: "Principal",
        extra: {
          categoryColumn: 1,
          subCategoryColumn: 1,
          dateColumn: 1,
          amountColumn: 1
        }
      }
    }
  },
  monthly: {
    id: "1nE0j6lgMZdimaLtO_31OKIpzVNNGBkVGB_xiPeAHoOw",
    name: "Mensual",
    sheets: {
      all_categories: {
        name: "Categorías"
      },
      category1: {
        name: categories.category1.name,
        extra: {
          type: sheetType.category
        }
      },
      category2: {
        name: categories.category2.name,
        extra: {
          type: sheetType.category
        }
      },
      account1: {
        name: accounts.account1,
        extra: {
          type: sheetType.account
        }
      },
      account2: {
        name: accounts.account2,
        extra: {
          type: sheetType.account
        }
      },
      account3: {
        name: accounts.account2,
        extra: {
          type: sheetType.account
        }
      }
    }
  }
}

const recurrentSpendsMailRecipient = "asd@asd.com"

const recurrentSpendsTaskList = "xxx"

const recurrentSpendsOrigin = "Apps Script"

const recurrentSpends: RecurrentSpendConfig[] = [
  {
    value: 1,
    category: "Category x",
    subCategory: "Subcategory x",
    account: "Account x",
    date: new Date(),
    description: "X",
    origin: recurrentSpendsOrigin,
    dayOfMonth: 4,
    taskTitle: "Check ...",
    taskDescription: "Check ... ...",
    mailSubject: "Check ...",
    mailBody: "Check ... ..."
  }
]

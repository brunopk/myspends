// Columns are in range 1..n

// TODO: remove this (only used for category tree on Google Site HTML)

const categories: { [name: string]: CategoryConfig } = {
  category1: {
    name: "Comida",
    subCategories: {
      subCategory1: {
        name: "Mercado Pago (70% OFF)"
      },
      subCategory2: {
        name: "VISA Alimentos"
      }
    }
  },
  category2: {
    name: "Transporte",
    subCategories: {
      subCategory1: {
        name: "Bus"
      },
      subCategory2: {
        name: "Nafta"
      },
      subCategory3: {
        name: "Taxi"
      },
      subCategory4: {
        name: "Uber"
      }
    }
  },
  category3: {
    name: "Psicólogo"
  },
  category4: {
    name: "Celular"
  },
  category5: {
    name: "Otros"
  },
  category6: {
    name: "Salud"
  }
}

const sheetType = {
  category: 0,
  account: 1
}

// Columns numbers starts with 0

const forms:  { [name: string]: FormConfig } = {
  main: {
    spreadSheet: {
      id: 'xxx',
      name: 'Form',
      sheet: {
        name: 'Name',
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
}

const sheets : { [name: string]: SpreadSheetConfig } = {
  main: {
    id: "1r93R3hKOCV6St4sac_88YZRM6OuYO9LxaxwMa2gWomE",
    name: "Principal",
    sheets: {
      main: {
        name: "Principal",
        columns: {
          category: 1,
          subCategory: 1,
          date: 1,
          amount: 1,
          account: 1
        }
      }
    }
  },
  monthly: {
    id: "1nE0j6lgMZdimaLtO_31OKIpzVNNGBkVGB_xiPeAHoOw",
    name: "Mensual",
    sheets: {
      all_categories: {
        name: "Categorías",
        totalColumn: 1,
        columns: {
          "Column A": 0,
          "Column B": 0
        }
      },
      category1: {
        name: categories.category1.name,
        totalColumn: 1,
        columns: {
          "Column A": 0,
          "Column B": 0
        },
        extra: {
          type: sheetType.category
        }
      },
      category2: {
        name: categories.category2.name,
        totalColumn: 1,
        columns: {
          "Column A": 0,
          "Column B": 0
        },
        extra: {
          type: sheetType.category
        }
      },
      account1: {
        name: "Account 1",
        totalColumn: 1,
        columns: {
          "Column A": 0,
          "Column B": 0
        },
        extra: {
          type: sheetType.account
        }
      },
      account2: {
        name: "Account 2",
        totalColumn: 1,
        columns: {
          "Column A": 0,
          "Column B": 0
        },
        extra: {
          type: sheetType.account
        }
      },
      account3: {
        name: "Account 3",
        totalColumn: 1,
        columns: {
          "Column A": 0,
          "Column B": 0
        },
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

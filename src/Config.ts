// Columns are in range 1..n

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

const spreadSheets : { [name: string]: SpreadSheetConfig } = {
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
          account: 1,
          origin: 1
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
        columns: {
          "Column A": 0,
          "Column B": 0
        }
      },
      category1: {
        name: categories.category1.name,
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

const recurrentSpends: RecurrentSpendConfig[] = [
  {
    value: 1,
    category: "Category x",
    subCategory: "Subcategory x",
    account: "Account x",
    date: new Date(),
    description: "X",
    origin: "App Script",
    dayOfMonth: 4,
    taskTitle: "Check ...",
    taskDescription: "Check ... ...",
    mailSubject: "Check ...",
    mailBody: "Check ... ...",
    mode: "Reminder"
  }
]

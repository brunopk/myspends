const spreadSheetConfig : { [name: string]: SpreadSheetConfig } = {
  main: {
    id: "1r93R3hKOCV6St4sac_88YZRM6OuYO9LxaxwMa2gWomE",
    name: "Principal",
    sheets: {
      main: {
        name: "Principal"
      }
    }
  },
  monthly: {
    id: "1nE0j6lgMZdimaLtO_31OKIpzVNNGBkVGB_xiPeAHoOw",
    extra: {
      ACCOUNT_SHEETS: [ACCOUNTS.ACCOUNT_1, ACCOUNTS.ACCOUNT_2, ACCOUNTS.ACCOUNT_3],
      CATEGORIES_SHEET: [CATEGORIES.CATEGORY_1.NAME, CATEGORIES.CATEGORY_2.NAME],
      CATEGORIES_MAIN_SHEET: "Categorías"
    }
  }
}
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
    name: "Mensual",
    sheets: {
      comida: {
        name: CATEGORIES.CATEGORY_1.NAME,
        type: MONTHLY_SHEET_TYPES.CATEGORY
      },
      transporte: {
        name: CATEGORIES.CATEGORY_2.NAME,
        type: MONTHLY_SHEET_TYPES.CATEGORY
      }
    },
    extra: {
      categoriesColumns: {
        [CATEGORIES.CATEGORY_4.NAME]: 2,
        [CATEGORIES.CATEGORY_1.NAME]: 3,
        [CATEGORIES.CATEGORY_3.NAME]: 4,
        [CATEGORIES.CATEGORY_6.NAME]: 5,
        [CATEGORIES.CATEGORY_2.NAME]: 6,
        [CATEGORIES.CATEGORY_5.NAME]: 7
      }
    }/*,
    extra: {
      ACCOUNT_SHEETS: [ACCOUNTS.ACCOUNT_1, ACCOUNTS.ACCOUNT_2, ACCOUNTS.ACCOUNT_3],
      CATEGORIES_MAIN_SHEET: "Categorías"
    }*/
  }
}

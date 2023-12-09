const forms = {
  main: {
    name: "Principal",
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

const categories: {[name: string]: CategoryConfig } = {
  category_1: {
    name: "Comida",
    column: 3,
    subCategories: {
      subcategory_1: {
        name: "Mercado Pago (70% OFF)",
        column: 2
      },
      subcategory_2: {
        name: "VISA Alimentos",
        column: 3
      }
    }
  },
  category_2: {
    name: "Transporte",
    column: 6,
    subCategories: {
      subcategory_1: {
        name: "Bus",
        column: 2
      },
      subcategory_2: {
        name: "Nafta",
        column: 3
      },
      subcategory_3: {
        name: "Taxi",
        column: 4
      },
      subcategory_4: {
        name: "Uber",
        column: 5
      }
    }
  },
  category_3: {
    name: "Psicólogo",
    column: 4
  },
  category_4: {
    name: "Celular",
    column: 2
  },
  category_5: {
    name: "Otros",
    column: 7
  },
  category_6: {
    name: "Salud",
    column: 5
  }
}

const accounts: {[name: string]: string } = {
  account_1: "",
  account_2: "",
  account_3: ""
}

const monthlySheetType = {
  category: 0,
  account: 1
}

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
      all_categories: {
        name: "Categorías"
      },
      category_1: {
        name: categories.category_1.name,
        type: monthlySheetType.category
      },
      category_2: {
        name: categories.category_2.name,
        type: monthlySheetType.category
      },
      account_1: {
        name: accounts.account_1,
        type: monthlySheetType.account
      },
      account_2: {
        name: accounts.account_2,
        type: monthlySheetType.account
      },
      account_3: {
        name: accounts.account_2,
        type: monthlySheetType.account
      }
    }
  }
}

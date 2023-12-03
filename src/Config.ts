const categories: {[name: string]: CategoryConfig } = {
  category_1: {
    name: "Comida",
    column: 3
  },
  category_2: {
    name: "Transporte",
    column: 6,
    subCategories: {
      subcategory_1: "Bus",
      subcategory_2: "Nafta",
      subcategory_3: "Taxi",
      subcategory_4: "Uber"
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
        type: MONTHLY_SHEET_TYPES.CATEGORY
      },
      category_2: {
        name: categories.category_2.name,
        type: MONTHLY_SHEET_TYPES.CATEGORY
      }
    }
  }
}
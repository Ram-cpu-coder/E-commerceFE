
export const productInputs = [
  {
    label: "Product Name",
    name: "name",
    type: "text",
    required: true,
    placeholder: "e.g. Nova Linen Overshirt",
  },
  {
    label: "Description",
    name: "description",
    type: "text",
    as: "textarea",
    maxLength: 500,
    placeholder: "Highlight the material, fit, finish, and the reason customers will love it.",
    rows: 4,
  },
  {
    label: "Price",
    name: "price",
    type: "number",
    required: true,
    placeholder: "e.g. 79.99",
    min: 0,
    step: "0.01",
  },
  {
    label: "Stock",
    name: "stock",
    type: "number",
    placeholder: "e.g. 48",
    min: 1,
  },
  {
    label: "Status",
    name: "status",
    type: "select",
    options: ["active", "inactive"],
    required: true,
  },
//   {
//     label: "Category",
//     name: "category",
//     type: "select", // will be populated dynamically from backend
//     required: true,
//     placeholder: "Select category",
//   }
  
];

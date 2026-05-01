
export const productInputs = [
  {
    label: "Product Name",
    name: "name",
    type: "text",
    required: true,
    placeholder: "e.g. Cotton T-Shirt",
  },
  {
    label: "Description",
    name: "description",
    type: "text",
    as: "textarea",
    maxLength: 500,
    placeholder: "Product description...",
    rows: 4,
  },
  {
    label: "Price",
    name: "price",
    type: "number",
    required: true,
    placeholder: "e.g. 29.99",
    min: 0,
    step: "0.01",
  },
  {
    label: "Stock",
    name: "stock",
    type: "number",
    placeholder: "e.g. 100",
    min: 1,
  },
  {
    label: "Status",
    name: "status",
    type: "select",
    options: ["active", "inactive"],
    required: true,
    defaultValue: "inactive",
  },
//   {
//     label: "Category",
//     name: "category",
//     type: "select", // will be populated dynamically from backend
//     required: true,
//     placeholder: "Select category",
//   }
  
];

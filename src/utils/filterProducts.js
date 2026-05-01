export const filterFunction = ({ category, searchQuery, others }, data) => {
  let filtered = [...data];

  // Filter by category
  if (category !== "all") {
    filtered = filtered.filter((item) => item.category === category);
  }

  // Filter by search query
  if (searchQuery.trim()) {
    filtered = filtered.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  // Sorting
  switch (others) {
    case "newest":
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      break;
    case "toHigh":
      filtered.sort((a, b) => a.price - b.price);
      break;
    case "toLow":
      filtered.sort((a, b) => b.price - a.price);
      break;
    case "toZ":
      filtered.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "toA":
      filtered.sort((a, b) => b.name.localeCompare(a.name));
      break;
    default:
      break;
  }


  return filtered;
};

export const filterFunctionReviews = ({ status, searchQuery, others }, reviews) => {
  let filtered = [...reviews];

  // Filter by category
  if (status !== "all") {
    filtered = filtered.filter((item) => String(item.approved) === status);
  }

  // Filter by search query
  if (searchQuery.trim()) {
    filtered = filtered.filter((item) =>
      item.productName.toLowerCase().includes(searchQuery.toLowerCase()) || item.userName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  // Sorting
  switch (others) {
    case "newest":
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      break;
    case "oldest":
      filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      break;
    case "toHigh":
      filtered.sort((a, b) => a.rating - b.rating);
      break;
    case "toLow":
      filtered.sort((a, b) => b.rating - a.rating);
      break;
    case "toZ":
      filtered.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "toA":
      filtered.sort((a, b) => b.name.localeCompare(a.name));
      break;
    default:
      break;
  }


  return filtered;
};


export const filterFunctionOrders = ({ date, searchQuery, status }, data) => {

  let filtered = [...data];
  // Filter by Orders' status
  if (status !== "all") {
    filtered = filtered.filter(item => item.status === status)
  }

  // Filter by search query
  if (searchQuery.trim()) {
    filtered = filtered.filter((item) => item.products.some(product => product.name.toLowerCase().includes(searchQuery.toLowerCase())) || item._id.includes(searchQuery))
  }

  switch (date) {
    case "newest":
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      break;
    case "oldest":
      filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      break;

  }
  return filtered;
}
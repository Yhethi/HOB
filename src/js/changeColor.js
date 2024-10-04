export const getDarkMode = (isDarkMode) => {
  if (isDarkMode) {
    document.documentElement.style.setProperty("--primary-color", "#f0f0f0"); // Nuevo color
    document.documentElement.style.setProperty("--text-dark-mode", "black"); // Nuevo color
    document.documentElement.style.setProperty(
      "--bg-card-product",
      "--bg-card-product-light"
    ); // Nuevo color
  } else {
    document.documentElement.style.setProperty("--primary-color", "#242424"); // Color original
    document.documentElement.style.setProperty("--text-dark-mode", "white"); // Color original
    document.documentElement.style.setProperty(
      "--bg-card-product-light",
      "--bg-card-product"
    ); // Nuevo color
  }
};

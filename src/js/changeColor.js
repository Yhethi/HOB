export const getDarkMode = (isDarkMode) => {
  if (isDarkMode) {
    // Modo claro
    document.documentElement.style.setProperty("--primary-color", "#f0f0f0");
    document.documentElement.style.setProperty("--text-dark-mode", "black");
    document.documentElement.style.setProperty(
      "--bg-card-product",
      "var(--bg-card-product-light)" // Aplica el valor desde el tema
    );
    document.documentElement.style.setProperty(
      "--transparent-black",
      "#000000a4"
    );
  } else {
    // Modo oscuro
    document.documentElement.style.setProperty("--primary-color", "#242424");
    document.documentElement.style.setProperty("--text-dark-mode", "white");
    document.documentElement.style.setProperty(
      "--bg-card-product",
      "var(--bg-card-product-dark)" // Define claramente el valor
    );
    document.documentElement.style.setProperty(
      "--transparent-black",
      "#ffffffa4"
    );
  }
};

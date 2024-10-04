export const setZoomDynamic = () => {
  let img = document.querySelectorAll(".card__product img");

  img.forEach((item) => {
    item.onmousemove = function (e) {
      e.target.style.setProperty(
        "--x",
        (100 * e.offsetX) / e.target.offsetWidth + "%"
      );
      e.target.style.setProperty(
        "--y",
        (100 * e.offsetY) / e.target.offsetHeight + "%"
      );
    };
  });
};

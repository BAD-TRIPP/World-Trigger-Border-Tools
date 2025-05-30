// scripts/quick-guide.js

export function initQuickGuide() {
  const formulaTable = document.getElementById("formulaTable");
  const rssFormulaTable = document.getElementById("rssFormulaTable");

  // Toggle Buff Formula Table
  window.toggleTable = function () {
    const show = formulaTable.style.display === "none";
    formulaTable.style.display = show ? "block" : "none";
    localStorage.setItem("brdr_formulas_open", show ? "true" : "false");
  };

  // Toggle RSS Formula Table
  window.toggleRSSFormulas = function () {
    const show = rssFormulaTable.style.display === "none";
    rssFormulaTable.style.display = show ? "block" : "none";
  };

  // Restore formula table state
  const isOpen = localStorage.getItem("brdr_formulas_open");
  if (isOpen === "true") formulaTable.style.display = "block";
  else formulaTable.style.display = "none";

  // Lightbox image support
  window.openLightbox = function (src) {
    document.getElementById("lightbox-img").src = src;
    document.getElementById("lightbox").style.display = "block";
  };

  window.closeLightbox = function () {
    document.getElementById("lightbox").style.display = "none";
  };
}

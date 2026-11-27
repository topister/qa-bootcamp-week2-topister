module.exports = {
  default: {
    paths: ["features/**/*.feature"],
    require: ["features/support/**/*.ts", "features/step-definitions/**/*.ts"],
    tags: "@cart-total",
    format: ["progress-bar"],
  },
};
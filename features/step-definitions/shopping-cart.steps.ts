import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { ToolshopWorld } from "../support/world";

Given("the shopper is browsing the Toolshop catalog", async function (this: ToolshopWorld) {
  await this.home.open();
  await expect(this.home.productCards.first()).toBeVisible();
});

When(
  "the shopper adds {string} priced at {string} to the cart",
  async function (this: ToolshopWorld, name: string, price: string) {
    await this.home.open();
    await this.home.openProduct(name);

    await expect(this.product.name).toContainText(name);
    // Fails clearly if the price in the feature file is out of date   
    await expect(this.product.unitPrice).toHaveText(price.replace("$", ""));
    await expect(this.product.addToCartButton).toBeEnabled();

    await this.product.addToCart();
    this.itemCount += 1;
    await expect(this.product.cartQuantity).toHaveText(String(this.itemCount));
  }
);

When("the shopper views the shopping cart", async function (this: ToolshopWorld) {
  await this.cart.open();
});

Then(
  "both {string} and {string} appear in the cart",
  async function (this: ToolshopWorld, first: string, second: string) {
    await expect(this.cart.rows).toHaveCount(2);
    await expect(this.cart.row(first)).toBeVisible();
    await expect(this.cart.row(second)).toBeVisible();
  }
);

Then(
  "the cart total reflects the combined price of {string}",
  async function (this: ToolshopWorld, total: string) {
    await expect(this.cart.total).toHaveText(total);
  }
);
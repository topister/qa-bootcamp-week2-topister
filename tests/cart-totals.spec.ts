import { test, expect } from "@playwright/test";
import { HomePage } from "../pages/HomePage";
import { ProductPage } from "../pages/ProductPage";
import { CartPage } from "../pages/CartPage";

const toCents = (text: string) => Math.round(Number(text.replace(/[^0-9.]/g, "")) * 100);
const toMoney = (cents: number) => `$${(cents / 100).toFixed(2)}`;

test("TO-35 DB-101: add multiple products to cart and verify prices and total", async ({ page }) => {
  const home = new HomePage(page);
  const product = new ProductPage(page);
  const cart = new CartPage(page);

  const productCount = 2;
  const names: string[] = [];
  const priceInCents: Record<string, number> = {};

  // Add two in-stock products and remember the name and price shown on each product page
  for (let index = 0; index < productCount; index++) {
    await home.open();
    await expect(home.inStockCards.first()).toBeVisible();
    await home.openInStockProduct(index);

    await expect(product.name).toBeVisible();
    await expect(product.unitPrice).toBeVisible();
    await expect(product.addToCartButton).toBeEnabled();

    const name = (await product.name.innerText()).trim();
    names.push(name);
    priceInCents[name] = toCents(await product.unitPrice.innerText());

    await product.addToCart();
    await expect(product.cartQuantity).toHaveText(String(index + 1));
  }

  // Open the cart and verify every line
  await cart.open();
  await expect(cart.rows).toHaveCount(productCount);

  for (const name of names) {
    await expect(cart.row(name)).toBeVisible();
    await expect(cart.unitPrice(name)).toHaveText(toMoney(priceInCents[name]));
    await expect(cart.lineTotal(name)).toHaveText(toMoney(priceInCents[name])); // quantity 1
  }

  // Verify the cart total is the sum of the prices
  const expectedTotal = Object.values(priceInCents).reduce((sum, cents) => sum + cents, 0);
  await expect(cart.total).toHaveText(toMoney(expectedTotal));
});
import { Page, Locator } from "@playwright/test";

export class CartPage {
  readonly page: Page;
  readonly navCart: Locator;
  readonly rows: Locator;
  readonly total: Locator;

  constructor(page: Page) {
    this.page = page;
    this.navCart = page.locator('[data-test="nav-cart"]');
    this.rows = page.locator("tbody tr");
    this.total = page.locator('[data-test="cart-total"]');
  }

  async open() {
    await this.navCart.click();
  }

  row(name: string): Locator {
    return this.rows.filter({
      has: this.page.getByRole("cell", { name, exact: true }),
    });
  }

  unitPrice(name: string): Locator {
    return this.row(name).locator('[data-test="product-price"]');
  }

  lineTotal(name: string): Locator {
    return this.row(name).locator('[data-test="line-price"]');
  }
}
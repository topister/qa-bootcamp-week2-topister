import { Page, Locator } from "@playwright/test";

export class HomePage {
  readonly page: Page;
  readonly productCards: Locator;
  readonly inStockCards: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productCards = page.locator("a.card");
    this.inStockCards = this.productCards.filter({
      hasNot: page.locator('[data-test="out-of-stock"]'),
    });
  }

  async open() {
    await this.page.goto("/");
  }

  async openInStockProduct(index: number) {
    await this.inStockCards.nth(index).click();
  }
}
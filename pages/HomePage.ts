import { Page, Locator } from "@playwright/test";

export class HomePage {
  readonly page: Page;
  readonly productCards: Locator;
  readonly inStockCards: Locator;
  readonly sortSelect: Locator;     // the sort dropdown
  readonly productPrices: Locator;  // every price shown in the product grid

  constructor(page: Page) {
    this.page = page;
    this.productCards = page.locator("a.card");
    this.inStockCards = this.productCards.filter({
      hasNot: page.locator('[data-test="out-of-stock"]'),
    });
    
    this.sortSelect = page.locator('[data-test="sort"]');
    this.productPrices = page.locator('[data-test="product-price"]');
  }

  async open() {
    await this.page.goto("/");
  }

  async openInStockProduct(index: number) {
    await this.inStockCards.nth(index).click();
  }

  async openProduct(name: string) {
    await this.productCards.filter({ hasText: name }).first().click();
  }

  // choose a sort option by the text the shopper sees, e.g. "Price (Low - High)"
  async sortBy(label: string) {
    await this.sortSelect.selectOption({ label });
  }

  // read every price on the page as a number.
  // The parsing lives here so the test stays at the level of the case.
  async readPrices(): Promise<number[]> {
    const texts = await this.productPrices.allInnerTexts(); // e.g. ["$14.15", "$1,299.00"]
    return texts.map((text) => Number(text.replace(/[^0-9.]/g, ""))); // drop "$" and ","
  }
}
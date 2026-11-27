import { setWorldConstructor, World, IWorldOptions } from "@cucumber/cucumber";
import { BrowserContext, Page } from "@playwright/test";
import { HomePage } from "../../pages/HomePage";
import { ProductPage } from "../../pages/ProductPage";
import { CartPage } from "../../pages/CartPage";

export class ToolshopWorld extends World {
  context!: BrowserContext;
  page!: Page;
  home!: HomePage;
  product!: ProductPage;
  cart!: CartPage;
  itemCount = 0;

  constructor(options: IWorldOptions) {
    super(options);
  }
}

setWorldConstructor(ToolshopWorld);
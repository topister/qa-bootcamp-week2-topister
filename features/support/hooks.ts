import "dotenv/config";
import { BeforeAll, AfterAll, Before, After, setDefaultTimeout } from "@cucumber/cucumber";
import { chromium, Browser } from "@playwright/test";
import { ToolshopWorld } from "./world";
import { HomePage } from "../../pages/HomePage";
import { ProductPage } from "../../pages/ProductPage";
import { CartPage } from "../../pages/CartPage";

setDefaultTimeout(60_000);

let browser: Browser;

BeforeAll(async () => {
  browser = await chromium.launch({ headless: process.env.HEADED !== "true" });
});

AfterAll(async () => {
  await browser.close();
});

Before(async function (this: ToolshopWorld) {
  this.context = await browser.newContext({
    baseURL: process.env.TOOLSHOP_URL ?? "https://practicesoftwaretesting.com",
  });
  this.page = await this.context.newPage();
  this.home = new HomePage(this.page);
  this.product = new ProductPage(this.page);
  this.cart = new CartPage(this.page);
  this.itemCount = 0;
});

After(async function (this: ToolshopWorld) {
  await this.context.close();
});
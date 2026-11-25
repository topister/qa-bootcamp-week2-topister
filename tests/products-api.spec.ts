import { test, expect } from "@playwright/test";

test("GET /products returns 200 and product list data", async ({ request }) => {
  const response = await request.get("https://api.practicesoftwaretesting.com/products");

  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toContain("application/json");

  const body = await response.json();
  expect(body.total).toBeGreaterThan(0);
  expect(Array.isArray(body.data)).toBe(true);
});
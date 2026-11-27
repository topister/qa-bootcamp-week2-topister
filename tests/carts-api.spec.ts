import { test, expect } from '@playwright/test';
import { CartsApi } from '../api/CartsApi';

test.describe('Toolshop Carts API', () => {
  test('creates a cart, adds a product, verifies response fields, and cleans up', async ({ request }) => {
    // Initialize our API helper class with Playwright's request fixture
    const cartsApi = new CartsApi(request);

    // Step 1: Fetch a valid product_id dynamically from the live catalog
    // Prevents flakiness if hardcoded IDs change when the shared sandbox resets
    const productsRes = await cartsApi.getProducts();
    expect(productsRes.status()).toBe(200);
    expect(productsRes.headers()['content-type']).toContain('application/json');


    const productsBody = await productsRes.json();
    const productId: string = productsBody.data[0].id;

    // Step 2: Create a fresh cart and confirm it returns 201 Created with a cart ID
    const createRes = await cartsApi.createCart();
    expect(createRes.status()).toBe(201);
    const createBody = await createRes.json();
    expect(createBody.id).toBeTruthy();

    const cartId: string = createBody.id;

    // Step 3: Wrap cart actions and assertions in try/finally so cleanup ALWAYS runs,
    // even if one of the expect() checks fails partway through
    try {
      // Add 2 units of the fetched product to our new cart
      const addRes = await cartsApi.addItem(cartId, productId, 2);
      expect(addRes.status()).toBe(200);
      const addBody = await addRes.json();
      expect(addBody.result).toBe('item added or updated');

      // Read the cart back and verify the cart ID, item count, product ID, and quantity
      const getRes = await cartsApi.getCart(cartId);
      expect(getRes.status()).toBe(200);
      const cartBody = await getRes.json();
      expect(cartBody.id).toBe(cartId);
      expect(cartBody.cart_items).toHaveLength(1);
      expect(cartBody.cart_items[0].product.id).toBe(productId);
      expect(cartBody.cart_items[0].quantity).toBe(2);
    } finally {
      // Delete the test cart so we leave the shared database clean
      const deleteRes = await cartsApi.deleteCart(cartId);
      expect([200, 204]).toContain(deleteRes.status());
    }
  });

  test('returns 404 when requesting a cart id that does not exist', async ({ request }) => {
      const cartsApi = new CartsApi(request);

      // Negative test: Request a non-existent cart ID and verify the API returns 404 Not Found
      const response = await cartsApi.getCart('00000000000000000000000000');
      expect(response.status()).toBe(404);
      expect(response.headers()['content-type']).toContain('application/json');
  });


});

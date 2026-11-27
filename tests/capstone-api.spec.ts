import { test, expect } from '@playwright/test';
import { CartsApi } from '../api/CartsApi';

test('C4 Add to a cart', async ({ request }) => {
  const cartsApi = new CartsApi(request);

  // Arrange: read a real product from the live catalog, so nothing is hard-coded.
  const productsRes = await cartsApi.getProducts();
  expect(productsRes.status()).toBe(200);
  // If the shared site is broken it can return an HTML error page.
  // Failing here names the environment as the cause, not the cart.
  expect(productsRes.headers()['content-type']).toContain('application/json');
  const products = await productsRes.json();
  expect(products.total, 'catalog is empty, cannot pick a product').toBeGreaterThan(0);
  const product = products.data[0];

  // Act 1: create a brand-new cart. This test owns this cart, so it must delete it.
  const createRes = await cartsApi.createCart();
  expect(createRes.status()).toBe(201); // the case: creating a cart returns 201
  const cartId: string = (await createRes.json()).id;
  expect(cartId).toBeTruthy();

  // try/finally: the delete below runs whether the checks pass or fail.
  try {
    // Act 2: add the product.
    const addRes = await cartsApi.addItem(cartId, product.id, 1);
    expect(addRes.status()).toBe(200); // the case: adding a product returns 200

    // Assert: read the cart back. Status codes alone would pass on an empty cart,
    // so check what is actually inside it.
    const cartRes = await cartsApi.getCart(cartId);
    expect(cartRes.status()).toBe(200);
    const cart = await cartRes.json();
    expect(cart.cart_items).toHaveLength(1);
    expect(cart.cart_items[0].product.id).toBe(product.id);
    expect(cart.cart_items[0].product.name).toBe(product.name); // right id AND right details
  } finally {
    // Cleanup: remove the cart so the shared site isn't left with stray data.
    const deleteRes = await cartsApi.deleteCart(cartId);
    console.log('DELETE status:', deleteRes.status());
    expect([200, 204]).toContain(deleteRes.status());
  }
});
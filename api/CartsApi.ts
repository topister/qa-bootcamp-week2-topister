import { APIRequestContext } from '@playwright/test';

// API wrapper class that keeps the API base URL, headers, and endpoint paths in one place
export class CartsApi {
    readonly request: APIRequestContext;
    readonly baseUrl = 'https://api.practicesoftwaretesting.com';

    constructor(request: APIRequestContext) {
        // Store Playwright's APIRequestContext fixture so methods can send HTTP requests
        this.request = request;
    }

    // Tell the server we expect JSON responses rather than HTML
    private get headers() {
      return { Accept: 'application/json' };
    }
  

    // Send GET /products to retrieve the live catalog list
    async getProducts() {
      return this.request.get(`${this.baseUrl}/products`);
    }


    // Send POST /carts to create a brand-new empty shopping cart
    async createCart() {
      return this.request.post(`${this.baseUrl}/carts`);
    }
    // Send POST /carts/{cartId} to add a specific product and quantity into the cart
      async addItem(cartId: string, productId: string, quantity: number) {
      return this.request.post(`${this.baseUrl}/carts/${cartId}`, {
        data: {
          product_id: productId,
          quantity,
        },
      });
    }

    // Send GET /carts/{cartId} to fetch the current contents of a cart
    async getCart(cartId: string) {
        return this.request.get(`${this.baseUrl}/carts/${cartId}`);
      }
  
    // Send DELETE /carts/{cartId} to remove the cart after the test finishes
    async deleteCart(cartId: string) {
        return this.request.delete(`${this.baseUrl}/carts/${cartId}`);
      }
    }

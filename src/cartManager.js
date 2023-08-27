import fs from "fs";
import { ProductManager } from "./productManager.js";

export class CartManager {
  #path;
  #productManager;

  constructor(path) {
    this.#path = path;
    this.#productManager = new ProductManager("./data/products.json");
    this.#init();
  }

  async #init() {
    if (!fs.existsSync(this.#path)) {
      await fs.promises.writeFile(this.#path, JSON.stringify([], null, 2));
    }
  }

  #generateID(data) {
    return data.length === 0 ? 1 : data[data.length - 1].id + 1;
  }

  async createCart() {
    if (!fs.existsSync(this.#path)) return "[500] DB File does not exists.";
    let data = await fs.promises.readFile(this.#path, "utf-8");
    let carts = JSON.parse(data);
    const cartToAdd = { id: this.#generateID(carts), products: [] };
    carts.push(cartToAdd);
    await fs.promises.writeFile(this.#path, JSON.stringify(carts, null, 2));
    return cartToAdd;
  }

  async getCartById(id) {
    if (!fs.existsSync(this.#path)) return "[500] DB File does not exist.";
    let data = await fs.promises.readFile(this.#path, "utf-8");
    let carts = JSON.parse(data);
    let cart = carts.find((item) => item.id === id);
    if (!cart) return "[404] Not Found.";
    return cart;
  }

  async getProductsFromCart(id) {
    if (!fs.existsSync(this.#path)) return "[500] DB File does not exists.";
    let data = await fs.promises.readFile(this.#path, "utf-8");
    let carts = JSON.parse(data);
    let cart = carts.find((item) => item.id === id);
    if (!cart) return "[404] Not Found.";
    return cart;
  }

  async addProductToCart(cid, pid) {
    if (!fs.existsSync(this.#path)) return "[500] DB File does not exist.";

    const cart = await this.getProductsFromCart(cid);
    if (typeof cart == "string") {
      return `[404] Cart with ID=${cid} was not found`;
    }

    const productManager = new ProductManager("./data/products.json");
    const product = await productManager.getProductById(pid);
    if (typeof product == "string") {
      return `[404] Product with ID=${pid} was not found`;
    }

    const productIndex = cart.products.findIndex(
      (item) => item.product === pid
    );
    if (productIndex > -1) {
      cart.products[productIndex].quantity += 1;
    } else {
      cart.products.push({ product: pid, quantity: 1 });
    }

    let data = await fs.promises.readFile(this.#path, "utf-8");
    let carts = JSON.parse(data);
    carts = carts.map((item) => {
      if (item.id === cid) {
        return cart;
      } else {
        return item;
      }
    });

    await fs.promises.writeFile(this.#path, JSON.stringify(carts, null, 2));
    return cart;
  }
  async deleteCart(id) {
    try {
      let file = await fs.promises.readFile(this.path, "utf8");
      if (file) {
        const carts = JSON.parse(file);
        const rest = carts.filter((cart) => cart.id !== id);
        try {
          await fs.promises.writeFile(this.path, JSON.stringify(rest, null, 2));
          return `Se elimino el carrito con id: ${id}`;
        } catch (err) {
          console.log("Hubo un error de escritura", err);
        }
      }
    } catch (err) {
      console.log("Hubo un error de lectura", err);
    }
  }

  async saveCart(cartId, updatedCartData) {
    try {
      const data = await fs.promises.readFile(this.#path, "utf-8");
      const carts = JSON.parse(data);

      const cartIndex = carts.findIndex((item) => item.id === cartId);

      if (cartIndex === -1) {
        return `[404] Cart with ID=${cartId} was not found`;
      }

      carts[cartIndex] = updatedCartData;

      await fs.promises.writeFile(this.#path, JSON.stringify(carts, null, 2));

      return updatedCartData;
    } catch (error) {
      console.error(error);
      return `[500] Internal Server Error`;
    }
  }
}

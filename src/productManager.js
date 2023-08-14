const fs = require("fs");
class ProductManager {
  // #products;
  #path;

  constructor(path) {
    this.#path = path;
    this.#init();
  }

  async #init() {
    if (!fs.existsSync(this.#path)) {
      await fs.promises.writeFile(this.#path, JSON.stringify([], null, 2));
    }
  }
  #getNextID(products) {
    return products.length === 0 ? 1 : products[products.length - 1].id + 1;
  }

  async addProduct(product) {
    if (
      !product.title ||
      !product.description ||
      !product.price ||
      !product.thumbnail ||
      !product.code ||
      !product.stock
    )
      return "[ERR] Required fields missing";
    if (!fs.existsSync(this.#path)) return "[ERR] DB File does not exists";
    let data = await fs.promises.readFile(this.#path, "utf-8");
    let products = JSON.parse(data);
    const found = products.find((item) => item.code === product.code);
    if (found) {
      return "[ERR] Code already exists";
    }
    const productToAdd = { id: this.#getNextID(products), ...product };
    products.push(productToAdd);
    await fs.promises.writeFile(this.#path, JSON.stringify(products, null, 2));
    return productToAdd;
  }

  async getProducts() {
    if (!fs.existsSync(this.#path)) return "[ERR] DB File does not exists";
    let data = await fs.promises.readFile(this.#path, "utf-8");
    const products = JSON.parse(data);
    return products;
  }

  async getProductById(id) {
    if (!fs.existsSync(this.#path)) return "[ERR] DB File does not exists";
    let data = await fs.promises.readFile(this.#path, "utf-8");
    let products = JSON.parse(data);
    let product = products.find((item) => item.id === id);
    if (!product) return "[ERR] NOt found";
    return product;
  }
  async updateProduct(id, updateProduct) {
    if (!fs.existsSync(this.#path)) return "[ERR] DB File does not exists";
    let isFound = false;
    let data = await fs.promises.readFile(this.#path, "utf-8");
    let products = JSON.parse(data);
    let newProducts = products.map((item) => {
      if (item.id === id) {
        isFound = true;
        return {
          ...item,
          ...updateProduct,
        };
      } else return item;
    });
    if (!isFound) return "[ERR] DB File does not exists";
    await fs.promises.writeFile(
      this.#path,
      JSON.stringify(newProducts, null, 2)
    );
    return newProducts.find((item) => item.id === id);
  }
  async deleteProduct(id) {
    if (!fs.existsSync(this.#path)) return "[ERR] DB File does not exists";
    let isFound = false;
    let data = await fs.promises.readFile(this.#path, "utf-8");
    let products = JSON.parse(data);
    let newProducts = products.filter((item) => item.id !== id);
    if (!isFound) return "[ERR] DB Product does not exists";
    await fs.promises.writeFile(
      this.#path,
      JSON.stringify(newProducts, null, 2)
    );
    return newProducts;
  }
}

module.exportsno = ProductManager;

// const pm = new ProductManager();
// console.log(pm.getProducts());

// const product1 = {
//   title: "Maceta",
//   description: "Maceta blanca con flores",
//   price: 2000,
//   thumbnail: "image",
//   code: "01",
//   stock: 10,
// };

// const product2 = {
//   title: "Florero",
//   description: "Florero cerámica",
//   price: 2500,
//   thumbnail: "image",
//   code: "02",
//   stock: 10,
// };

// pm.addProduct(product1);
// pm.addProduct(product2);
// pm.addProduct("Reloj", "Reloj de pared", 2000, "image", "02", 10); //producto para agregar

// //pruebas de en consola
// console.log(pm.getProducts());
// console.log(pm.getProductById(1));
// console.log(pm.getProductById(500));
// console.log(pm.addProduct("Maceta"));

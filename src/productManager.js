import fs from "fs";
export class ProductManager {
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
    if (!product) return "[ERR] NOT found";
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
    try {
      let file = await fs.promises.readFile(this.path, "utf8");
      if (file) {
        const products = JSON.parse(file);
        const rest = products.filter((prod) => prod.id !== id);
        if (rest.length) {
          try {
            await fs.promises.writeFile(
              this.path,
              JSON.stringify(rest, null, 2)
            );
            return `Se elimino el objeto con el id: ${id}`;
          } catch (err) {
            console.log("Hubo un error de escritura", err);
          }
        } else this.deleteAll();
      }
    } catch (err) {
      console.log("Hubo un error de lectura", err);
    }
  }

  async deleteAll() {
    try {
      await fs.promises.writeFile(this.path, "");
      console.log("Todos los productos fueron eliminados");
    } catch (err) {
      console.log("Hubo un error al intentar obtener el archivo", err);
    }
  }
}

// module.exports = ProductManager;

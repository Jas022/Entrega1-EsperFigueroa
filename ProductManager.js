class ProductManager {
  #products;

  constructor() {
    this.#products = [];
  }

  #getNextID() {
    if (this.#products.length === 0) return 1;
    return this.#products[this.#products.length - 1].id + 1;
  }
  addProduct(product) {
    if (
      !product.title ||
      !product.description ||
      !product.price ||
      !product.thumbnail ||
      !product.code ||
      !product.stock
    )
      return "[ERR] Required fields missing";
    const found = this.#products.find((item) => item.code === product.code);
    if (found) {
      return "[ERR] Code already exists";
    }
    const productToAdd = { id: this.#getNextID(), ...product };
    this.#products.push(productToAdd);
    return productToAdd;
  }

  getProducts() {
    return this.#products;
  }

  getProductById(id) {
    const found = this.#products.find((item) => item.id === id);
    if (!found) return "[ERR] Not Found";
    return found;
  }
}

const pm = new ProductManager();
console.log(pm.getProducts());

const product1 = {
  title: "Maceta",
  description: "Maceta blanca con flores",
  price: 2000,
  thumbnail: "image",
  code: "01",
  stock: 10,
};

const product2 = {
  title: "Florero",
  description: "Florero cerámica",
  price: 2500,
  thumbnail: "image",
  code: "02",
  stock: 10,
};

pm.addProduct(product1);
pm.addProduct(product2);
pm.addProduct("Reloj", "Reloj de pared", 2000, "image", "02", 10); //producto para agregar

//pruebas de en consola
console.log(pm.getProducts());
console.log(pm.getProductById(1));
console.log(pm.getProductById(500));
console.log(pm.addProduct("Maceta"));

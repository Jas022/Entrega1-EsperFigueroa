import { Router } from "express";
import { CartManager } from "../cartManager.js";
import { ProductManager } from "../productManager.js";
const router = Router();
const cartManager = new CartManager("./data/carts.json");
const productManager = new ProductManager("./data/products.json");

router.post("/", async (req, res) => {
  const id = await cartManager.createCart();
  res.json({ status: "success", id });
});

router.get("/:cid", async (req, res) => {
  const id = parseInt(req.params.cid);
  const result = await cartManager.getProductsFromCart(id);
  if (typeof result == "string") {
    const error = result.split("");
    return res
      .status(parseInt(error[0].slice(1, 4)))
      .json({ error: result.slice(6) });
  }
  res.status(200).json({ status: "success", payload: result });
});
router.post("/:cid/product/:pid", async (req, res) => {
  const cid = parseInt(req.params.cid);
  const cart = await cartManager.getCartById(cid);
  if (!cart)
    return res
      .status(404)
      .json({ status: "error", error: "no existe ese carrito" });

  const pid = parseInt(req.params.pid);
  const product = await productManager.getProductById(pid);

  if (product === "[ERR] NOT found") {
    return res
      .status(404)
      .json({ status: "error", error: "producto no encontrado" });
  }

  const index = cart.products.findIndex((p) => p.product == pid);
  index !== -1
    ? cart.products[index].quantity++
    : cart.products.push({ product: pid, quantity: 1 });
  const updated = await cartManager.saveCart(cid, cart);
  res.json({ status: "success", payload: updated });
});

router.delete("/:cid", async (req, res) => {
  const cid = parseInt(req.params.cid);
  const eliminado = await cartManager.deleteCart(cid);
  res.json({ status: "success", eliminado });
});

router.delete("/:cid/product/:pid", async (req, res) => {
  const cid = parseInt(req.params.cid);
  const pid = parseInt(req.params.pid);

  const cart = await cartManager.getCartById(cid);

  if (!cart) {
    return res
      .status(404)
      .json({ status: "error", error: "El carrito no existe" });
  }

  const productIndex = cart.products.findIndex((p) => p.product === pid);

  if (productIndex === -1) {
    return res
      .status(404)
      .json({ status: "error", error: "El producto no está en el carrito" });
  }

  cart.products.splice(productIndex, 1);

  const updatedCart = await cartManager.saveCart(cid, cart);

  res.json({ status: "success", cart: updatedCart });
});

export default router;

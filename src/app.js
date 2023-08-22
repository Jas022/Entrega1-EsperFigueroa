import express from "express";
import productsRouter from "./routers/product.router.js";
import cartsRouter from "./routers/cart.router.js";
// import { ProductManager } from "./productManager.js";

const app = express();
app.use(express.json());
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.listen(8080, () => console.log("Server Up"));

// const productManager = new ProductManager("./data/products.json");

// app.get("/products", async (req, res) => {
//   const result = await productManager.getProducts();
//   const limit = req.query.limit;
//   if (typeof result === "string") {
//     const error = result.split("");
//     return res
//       .status(parseInt(error[0].slice(1, 4)))
//       .json({ error: result.slice(6) });
//   }
//   res.status(200).json({ payload: result.slice(0, limit) });
// });

// app.get("/products/:id", async (req, res) => {
//   const id = parseInt(req.params.id);
//   const result = await productManager.getProductById(id);
//   if (typeof result === "string") {
//     const error = result.split("");
//     return res
//       .status(parseInt(error[0].slice(1, 4)))
//       .json({ error: result.slice(6) });
//   }
//   res.status(200).json({ payload: result });
// });

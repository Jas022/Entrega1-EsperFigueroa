class ProductManager {
  product
  constructor(){
    this.product=[]
  }

get product()
{
  return this.product
}

generateID(){
  if (this.product.length === 0) return 1
  return this.product[this.product.length-1].id + 1

}

addProduct (product){
  if(!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock )
  return  '[ERR] Required fields missing'
  const found = this.product.find (item => item.code === product.code)
  if (found) {
    return '[ERR] Code already exists'
  }
 const productToAdd = {ide: this.generateID(), ...product}
 this.product.push(productToAdd)
 return productToAdd
}

getProducts (){
  return this.product
}

getProductById (id){
  const found = this.product.find(item => item.id === id)
  if (!found ) return '[ERR] Not Found'
  return found
}

}
const tm = new ProductManager(
  tm.product = {title:"Maceta", description:"Maceta blanca con flores" price: "2000", thumbnail"", code:"001",stock:"10"}
  tm.product = {title:"Vela", description:"Vela aromatica" price: "1500", thumbnail"", code:"002",stock:"10"}
  tm.product = {title:"reloj", description:"Reloj de pared" price: "3000", thumbnail"", code:"003",stock:"10"}
  tm.product = {title:"Florero", description:"Florero cerramica" price: "2500", thumbnail"", code:"004",stock:"10"}
  console.log(tm.product)

)
const Product = require("./Product");
const { getDatabase } = require("../database");
class Cart {
  constructor() {}

  static COLLECTION_NAME = "carts";

  static async add(productName) {
    const product = Product.findByName(productName);
    const db = getDatabase();

    if (!product) {
      throw new error(`Product '${productName}' not found.`);
    }

    const cart = await db
      .collection(this.COLLECTION_NAME)
      .findOne({});

    if (!cart) {
      const newCart = {
        items: [{ product, quantity: 1 }]
      };
      return db.collection(this.COLLECTION_NAME).insertOne(newCart);
    }
  

    const existingProduct = cart.items.find(
      (item) => item.product.name === productName
    );

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.items.push({ product, quantity: 1 });
    }

    return db
      .collection(this.COLLECTION_NAME)
      .updateOne({}, {$set: { items: cart.items } });
  }

  static async getItems() {
    const db = getDatabase();
    const cart = await db.collection(this.COLLECTION_NAME).findOne({});
    return cart?.items || [];
  }

  static async getProductsQuantity() {
    const items = await this.getItems();

    return items.reduce((total, item) => total + item.quantity, 0);
  }

  static async getTotalPrice() {
    const items = await this.getItems();

    return items.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  }

  static async clearCart() {
    const db = getDatabase();
    return db
      .collection(this.COLLECTION_NAME)
      .updateOne({}, { $set: { items: [] } });
  }
}

module.exports = Cart;

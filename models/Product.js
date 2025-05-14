const { getDatabase } = require("../database");

class Product {
  constructor(name, description, price) {
    this.name = name;
    this.description = description;
    this.price = price;
  }

  static COLLECTION_NAME = "products";

  static async getAll() {
    const db = getDatabase();
    return db.collection(this.COLLECTION_NAME).find().toArray();
  }

  static async add(product) {
    const db = getDatabase();
    const existing = await db
      .collection(this.COLLECTION_NAME)
      .findOne({ name: product.name });

    if (existing) {
      throw new Error('Product with this name already exists.');
    }

    return db.collection(this.COLLECTION_NAME).insertOne(product);
  }
  
  static async findByName(name) {
    const db = getDatabase();
    return db.collection(this.COLLECTION_NAME).findOne({ name });
  }

  static async deleteByName (name) {
    const db = getDatabase();
    return db.collection(this.COLLECTION_NAME).deleteOne({ name });
  }

  static async getLast() {
    const db = getDatabase();
    const lastProduct = await db
      .collection(this.COLLECTION_NAME)
      .find()
      .sort({ _id: -1 }) 
      .limit(1)
      .toArray();

    return lastProduct[0]; 
  }

}

module.exports = Product;

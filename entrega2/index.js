const fs = require("fs").promises;

class ProductManager {
  constructor(fileName) {
    this.fileName = fileName;
    this.productos = [];
    this.loadProducts();
  }

  async loadProducts() {
    try {
      if (await fs.access(this.fileName)) {
        const productos = await fs.readFile(this.fileName, "utf-8");
        this.productos = JSON.parse(productos);
      }
    } catch (error) {
      console.error("Error al cargar productos:", error);
      this.productos = [];
    }
  }

  async saveFile(data) {
    try {
      await fs.writeFile(
        this.fileName,
        JSON.stringify(data, null, 2)
      );
      return true;
    } catch (error) {
      console.error("Error al guardar archivo:", error);
      return false;
    }
  }

  async addProducto(producto) {
    try {
      if (!producto || typeof producto !== "object") {
        throw new Error("El producto proporcionado no es válido");
      }

      // Validar campos obligatorios
      const camposObligatorios = ["title", "description", "price", "thumbnail", "code", "stock"];
      camposObligatorios.forEach((campo) => {
        if (!(campo in producto)) {
          throw new Error(`El campo '${campo}' es obligatorio`);
        }
      });

      producto.id = this.generateId();

      this.productos.push(producto);

      const respuesta = await this.saveFile(this.productos);

      if (respuesta) {
        console.log("Producto agregado correctamente");
      } else {
        console.log("Hubo un error al agregar el producto");
      }
    } catch (error) {
      console.error("Error al agregar el producto:", error);
    }
  }

  async deleteProducto(id) {
    try {
      const index = this.productos.findIndex((producto) => producto.id === id);

      if (index !== -1) {
        this.productos.splice(index, 1);
        await this.saveFile(this.productos);
        console.log("Producto eliminado correctamente");
      } else {
        console.log("Producto no encontrado");
      }
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
    }
  }

  consultarProductos() {
    console.log(this.productos);
    return this.productos;
  }

  generateId() {
    const maxId = this.productos.reduce(
      (max, producto) => (producto.id > max ? producto.id : max),
      0
    );
    return maxId + 1;
  }
}

class Producto {
  constructor(title, description, price, thumbnail, code, stock) {
    this.title = title;
    this.description = description;
    this.price = price;
    this.thumbnail = thumbnail;
    this.code = code;
    this.stock = stock;
  }
}

// Pruebas
const producto1 = new Producto("Funda1", "falsadescripcion1", 29.99, "imagen1.jpg", "P001", 30);
const producto2 = new Producto("Funda2", "falsadescripcion2", 39.99, "imagen2.jpg", "P002", 20);
const producto3 = new Producto("Funda3", "falsadescripcion3", 19.99, "imagen3.jpg", "P003", 25);

const manager = new ProductManager("./Productos.json");

manager.addProducto(producto1);
console.log(manager.consultarProductos());

manager.addProducto(producto2);
manager.addProducto(producto3);
console.log(manager.consultarProductos());

// Eliminar el producto con id 2
manager.deleteProducto(2);
console.log(manager.consultarProductos());
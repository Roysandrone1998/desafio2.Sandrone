const fs = require("fs");

class ProductManager {
  constructor(fileName) {
    this.fileName = fileName;
    if (fs.existsSync(fileName)) {
      try {
        let productos = fs.readFileSync(fileName, "utf-8");
        this.productos = JSON.parse(productos);
      } catch (error) {
        this.productos = [];
      }
    } else {
      this.productos = [];
    }
  }

  async saveFile(data) {
    try {
      await fs.promises.writeFile(
        this.fileName,
        JSON.stringify(data, null, 2)  
      );
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async addProducto(producto) {
    producto.id = this.generateId();

    this.productos.push(producto);

    const respuesta = await this.saveFile(this.productos);

    if (respuesta) {
      console.log("Producto agregado correctamente");
    } else {
      console.log("Hubo un error al agregar el producto");
    }
  }

  async deleteProducto(id) {
    const index = this.productos.findIndex((producto) => producto.id === id);

    if (index !== -1) {
      this.productos.splice(index, 1);
      await this.saveFile(this.productos);
      console.log("Producto eliminado correctamente");
    } else {
      console.log("Producto no encontrado");
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
  constructor(id, title, descripcion, code, stock) {
    this.id = id;
    this.title = title;
    this.descripcion = descripcion;
    this.code = code;
    this.stock = stock;
  }
}

// Pruebas
const producto1 = new Producto(1, "Funda1", "falsadescripcion1", 1, 30);
const producto2 = new Producto(2, "Funda2", "falsadescripcion2", 2, 30);
const producto3 = new Producto(3, "Funda3", "falsadescripcion3", 3, 30);

const manager = new ProductManager("./Productos.json");

manager.addProducto(producto1);
console.log(manager.consultarProductos());

manager.addProducto(producto2);
manager.addProducto(producto3);
console.log(manager.consultarProductos());

// Eliminar el producto con id 2
manager.deleteProducto(2);
console.log(manager.consultarProductos());
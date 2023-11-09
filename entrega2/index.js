const fs = require("fs");

class ProductManager {
  constructor(fileName) {
    this.fileName = fileName;
    if (fs.existsSync(fileName)) {
      try {
        let usuarios = fs.readFileSync(fileName, "utf-8");
        this.usuarios = JSON.parse(usuarios);
      } catch (error) {
        this.usuarios = [];
      }
    } else {
      this.usuarios = [];
    }
  }

  async saveFile(data) {
    try {
      await fs.promises.writeFile(
        this.fileName,
        JSON.stringify(data, null, "\t")
      );
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async addUsuario(usuario) {
    this.usuarios.push(usuario);

    const respuesta = await this.saveFile(this.usuarios);

    if (respuesta) {
      console.log("todo bien");
    } else {
      console.log("Hubo un error ");
    }
  }

  consultarUsuarios() {
    console.log(this.usuarios);
    return this.usuarios;
  }
}

class Usuario {
  constructor(id, title, descripcion, code,stock) {
    this.id = id;
    this.title = title;
    this.descripcion = descripcion;
    this.code = code;
    this.stock = stock;
  }
}

// Pruebas
const producto1 = new Usuario(1, "Funda1","falsadescripcion1", 1, 30);
const producto2 = new Usuario(2, "Funda2","falsadescripcion2", 2, 30);
const producto3 = new Usuario(3, "Funda3","falsadescripcion3", 3, 30);

const manager = new ProductManager("./Usuarios.json");

// console.log(manager.consultarUsuarios());
manager.addUsuario(producto1);
console.log(manager.consultarUsuarios());

manager.addUsuario(producto2);
manager.addUsuario(usuario3);
console.log(manager.consultarUsuarios());

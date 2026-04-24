const express = require("express");
const cors = require("cors");
const pool = require("./config/db");

const app = express();

app.use(cors());
app.use(express.json());

/* =====================================================
   CONTACTOS
===================================================== */

// Obtener contactos (admin)
app.get("/api/admin", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        c.id_contacto AS id,
        c.nombre,
        c.apellido,
        c.cargo,
        d.nombre_dependencia AS dependencia,
        c.correo,
        c.extension,
        c.oficina,
        c.estado,
        c.id_dependencia
      FROM contactos c
      LEFT JOIN dependencias d 
        ON c.id_dependencia = d.id_dependencia
      ORDER BY c.id_contacto DESC
    `);

    res.json(rows);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener registros",
      error: error.message
    });
  }
});

// Obtener contactos públicos
app.get("/api/contactos", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        c.id_contacto,
        c.nombre,
        c.apellido,
        c.cargo,
        c.telefono,
        c.extension,
        c.correo,
        c.ciudad,
        c.sede,
        c.imagen,
        c.visible_publico,
        c.estado,
        c.oficina,
        d.nombre_dependencia AS dependencia
      FROM contactos c
      LEFT JOIN dependencias d
        ON c.id_dependencia = d.id_dependencia
      WHERE c.visible_publico = 1
      AND c.estado = 'activo'
      ORDER BY c.nombre ASC
    `);

    res.json(rows);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener contactos",
      error: error.message
    });
  }
});

// Crear contacto
app.post("/api/admin", async (req, res) => {
  try {
    const {
      nombre,
      apellido,
      cargo,
      telefono,
      extension,
      correo,
      ciudad,
      sede,
      imagen,
      visible_publico,
      estado,
      id_dependencia,
      oficina
    } = req.body;

    await pool.query(`
      INSERT INTO contactos
      (
        nombre, apellido, cargo, telefono, extension,
        correo, ciudad, sede, imagen, visible_publico,
        estado, id_dependencia, oficina
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      nombre,
      apellido,
      cargo,
      telefono,
      extension,
      correo,
      ciudad,
      sede,
      imagen,
      visible_publico,
      estado,
      id_dependencia,
      oficina
    ]);

    res.json({
      mensaje: "Registro creado correctamente"
    });

  } catch (error) {
    res.status(500).json({
      mensaje: "Error al crear registro",
      error: error.message
    });
  }
});

// Editar contacto
app.put("/api/admin/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const {
      nombre,
      tipo,
      dependencia,
      correo,
      extension,
      oficina,
      estado
    } = req.body;

    await pool.query(`
      UPDATE contactos SET
        nombre = ?,
        cargo = ?,
        correo = ?,
        extension = ?,
        oficina = ?,
        estado = ?
      WHERE id_contacto = ?
    `, [
      nombre,
      tipo,
      correo,
      extension,
      oficina,
      estado,
      id
    ]);

    res.json({
      mensaje: "Actualizado correctamente"
    });

  } catch (error) {
    res.status(500).json({
      mensaje: "Error al actualizar",
      error: error.message
    });
  }
});

// Eliminar contacto
app.delete("/api/admin/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      "DELETE FROM contactos WHERE id_contacto = ?",
      [id]
    );

    res.json({
      mensaje: "Registro eliminado correctamente"
    });

  } catch (error) {
    res.status(500).json({
      mensaje: "Error al eliminar registro",
      error: error.message
    });
  }
});

/* =====================================================
   DEPENDENCIAS
===================================================== */

// Obtener dependencias
app.get("/api/dependencias", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        id_dependencia,
        nombre_dependencia AS nombre,
        descripcion,
        ciudad,
        tipo,
        ubicacion,
        correo,
        imagen,
        estado
      FROM dependencias
      WHERE estado = 'activa'
      ORDER BY nombre_dependencia ASC
    `);

    res.json(rows);

  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener dependencias",
      error: error.message
    });
  }
});

// Crear dependencia
app.post("/api/dependencias", async (req, res) => {
  try {
    const {
      nombre_dependencia,
      descripcion,
      ciudad,
      tipo,
      ubicacion,
      correo,
      imagen
    } = req.body;

    await pool.query(`
      INSERT INTO dependencias
      (
        nombre_dependencia,
        descripcion,
        ciudad,
        tipo,
        ubicacion,
        correo,
        imagen,
        estado
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, 'activa')
    `, [
      nombre_dependencia,
      descripcion,
      ciudad,
      tipo,
      ubicacion,
      correo,
      imagen
    ]);

    res.json({
      mensaje: "Dependencia creada correctamente"
    });

  } catch (error) {
    res.status(500).json({
      mensaje: "Error al crear dependencia",
      error: error.message
    });
  }
});

// Editar dependencia
app.put("/api/dependencias/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const {
      nombre_dependencia,
      descripcion,
      ciudad,
      tipo,
      ubicacion,
      correo,
      imagen
    } = req.body;

    await pool.query(`
      UPDATE dependencias SET
        nombre_dependencia = ?,
        descripcion = ?,
        ciudad = ?,
        tipo = ?,
        ubicacion = ?,
        correo = ?,
        imagen = ?
      WHERE id_dependencia = ?
    `, [
      nombre_dependencia,
      descripcion,
      ciudad,
      tipo,
      ubicacion,
      correo,
      imagen,
      id
    ]);

    res.json({
      mensaje: "Dependencia actualizada correctamente"
    });

  } catch (error) {
    res.status(500).json({
      mensaje: "Error al actualizar dependencia",
      error: error.message
    });
  }
});

// Eliminar dependencia
app.delete("/api/dependencias/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [uso] = await pool.query(
      "SELECT COUNT(*) AS total FROM contactos WHERE id_dependencia = ?",
      [id]
    );

    if (uso[0].total > 0) {
      return res.status(400).json({
        mensaje: "No se puede eliminar: tiene registros asociados"
      });
    }

    const [result] = await pool.query(
      "DELETE FROM dependencias WHERE id_dependencia = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        mensaje: "Dependencia no encontrada"
      });
    }

    res.json({
      mensaje: "Dependencia eliminada correctamente"
    });

  } catch (error) {
    res.status(500).json({
      mensaje: error.message
    });
  }
});

/* =====================================================
   LOGIN
===================================================== */

app.post("/api/login", async (req, res) => {
  try {
    const { usuario, password } = req.body;

    // ADMIN
    if (usuario === "admin" && password === "1234") {
      return res.json({
        mensaje: "Acceso correcto",
        usuario: "admin",
        rol: "admin"
      });
    }

    // USUARIO NORMAL
    if (usuario === "usuario" && password === "1234") {
      return res.json({
        mensaje: "Acceso correcto",
        usuario: "usuario",
        rol: "usuario"
      });
    }

    return res.status(401).json({
      mensaje: "Usuario o contraseña incorrectos"
    });

  } catch (error) {
    res.status(500).json({
      mensaje: "Error en login",
      error: error.message
    });
  }
});

module.exports = app;
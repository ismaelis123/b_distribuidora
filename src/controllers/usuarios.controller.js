import { pool } from '../db.js';

// Obtener todos los usuarios
export const obtenerUsuarios = async (req, res) => {
  try {
    const [result] = await pool.query('SELECT * FROM Usuarios');
    res.json(result);
  } catch (error) {
    return res.status(500).json({
      mensaje: 'Ha ocurrido un error al leer los datos de los usuarios.',
      error: error
    });
  }
};

// Obtener un usuario por su ID
export const obtenerUsuario = async (req, res) => {
  try {
    const [result] = await pool.query('SELECT * FROM Usuarios WHERE id_usuario = ?', [req.params.id]);
    
    if (result.length <= 0) {
      return res.status(404).json({
        mensaje: `Error al leer los datos. El ID ${req.params.id} del usuario no fue encontrado.`
      });
    }
    res.json(result[0]);
  } catch (error) {
    return res.status(500).json({
      mensaje: 'Ha ocurrido un error al leer los datos del usuario.'
    });
  }
};

// Buscar usuarios por nombre de usuario
export const buscarUsuarios = async (req, res) => {
  try {
    const { termino } = req.query;
    const [result] = await pool.query(
      `SELECT * FROM Usuarios WHERE usuario LIKE ?`,
      [`%${termino}%`]
    );

    if (result.length <= 0) {
      return res.status(404).json({ mensaje: 'No se encontraron resultados para la búsqueda.' });
    }
    res.json(result);
  } catch (error) {
    return res.status(500).json({
      mensaje: 'Error al realizar la búsqueda.',
      error
    });
  }
};

// Registrar un nuevo usuario
export const registrarUsuario = async (req, res) => {
  try {
    const { usuario, contraseña } = req.body;

    const [result] = await pool.query(
      'INSERT INTO Usuarios (usuario, contraseña) VALUES (?, ?)',
      [usuario, contraseña]
    );

    res.status(201).json({ id_usuario: result.insertId });
  } catch (error) {
    return res.status(500).json({
      mensaje: 'Ha ocurrido un error al registrar el usuario.',
      error: error
    });
  }
};

// Actualizar usuario por ID
export const actualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { usuario, contraseña } = req.body;

    const [result] = await pool.query(
      `UPDATE Usuarios SET 
        usuario = ?, contraseña = ? 
      WHERE id_usuario = ?`,
      [usuario, contraseña, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: `No se encontró el usuario con ID ${id}.` });
    }

    res.json({ mensaje: `Usuario con ID ${id} actualizado correctamente.` });
  } catch (error) {
    return res.status(500).json({
      mensaje: 'Error al actualizar el usuario.',
      error: error
    });
  }
};

// Eliminar usuario por ID
export const eliminarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM Usuarios WHERE id_usuario = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: `No se encontró el usuario con ID ${id}.` });
    }

    res.json({ mensaje: `Usuario con ID ${id} eliminado correctamente.` });
  } catch (error) {
    return res.status(500).json({
      mensaje: 'Error al eliminar el usuario.',
      error
    });
  }
};
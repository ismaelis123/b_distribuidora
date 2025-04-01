import { pool } from '../db.js';

// Obtener todos los usuarios
export const obtenerUsuarios= async (req, res) => {
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
    const [result] = await pool.query('SELECT * FROM Usuarios WHERE usuario = ?', [req.params.user]);
    
    if (result.length <= 0) {
      return res.status(404).json({
        mensaje: `Error al leer los datos. El usuario ${req.params.user} no fue encontrado.`
      });
    }
    res.json(result[0]);
  } catch (error) {
    return res.status(500).json({
      mensaje: 'Ha ocurrido un error al leer los datos del usuario.'
    });
  }
};

// Verificar si un usuario existe
export const verificarUsuario = async (req, res) => {
  try {
    const { usuario, contraseña } = req.body;
    const [result] = await pool.query(
      'SELECT * FROM Usuarios WHERE usuario = ? AND contraseña = ?',
      [usuario, contraseña]
    );
    res.json(result.length > 0); // Devuelve true o false directamente
  } catch (error) {
    res.status(500).json(false);
  }
};
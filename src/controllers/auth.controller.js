// * ARCHIVO A COMPLETAR
import { UserModel, ProfileModel } from "../models/index.js";
import { hashPassword, comparePassword } from "../helpers/bcrypt.helper.js";
import { signToken } from "../helpers/jwt.helper.js";
import { sign } from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    // TODO: 1. Hashear la password antes de guardarla (hashPassword).
    // TODO: 2. Crear el user y su profile asociado.
    // TODO: 3. Responder con código 201, un mensaje de éxito y devolver el usuario sin la password.
        const { username, email, password } = matchedData(req, {locations: ["body"]})
        const { employee_number, first_name, last_name, phone } = matchedData(req, {locations: ["body"]})
        const hashedPassword = await hashPassword(password)
        const newUser = await UserModel.create({
            username,
            email,
            password: hashedPassword,
            role: "user"
        })
        const newUserProfile = await ProfileModel.create({
            employee_number,
            first_name,
            last_name,
            phone,
            user_id: newUser.id,
        })
        const newUserCreated = await UserModel.findByPk(newUser.id, {
          attributes: {
            exclude: ["password"]
          }
        })
        return res.status(201).json({
            message: "Se creó el usuario y su perfil asociado: ",
            newUserCreated,
            newUserProfile
        })
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error interno del servidor" });
  }
};

export const login = async (req, res) => {
  try {
    // TODO: 1. Buscar el user por email y comparar la password (comparePassword).
    const { email, password } = matchedData(req, {locations: ["body"]})
    const foundUser = await User.findOne({
            where: {email}
        })
    const validPassword = await comparePassword(password, registeredUser.password)
    if (!validPassword) {
            return res.status(401).json({
                message: "Credenciales incorrectas"
            })
        }
    // TODO: 2. Firmar un JWT con el id y el role del user (signToken).
    const payload = {
            id: foundUser.id,
            role: foundUser.role
        }
    const token = signToken(payload)
    // TODO: 3. Guardar el token en una cookie httpOnly llamada "token", responder con código 200 y un mensaje de éxito.
    res.cookie("sessionToken", token, {
            httpOnly: true, 
            maxAge: 1000*60*60, 
        })
    return res.status(200).json({
            message: "Usuario logueado correctamente"
        })
    // ? Considerar qué mensaje devolver ante credenciales inválidas.
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error interno del servidor" });
  }
};

export const logout = async (_req, res) => {
  try {
    // TODO: 1. Eliminar la cookie "token" y responder con código 204 sin devolver ningun mensaje.
    res.clearCookie("sessionToken")
    return res.status(204)
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error interno del servidor" });
  }
};

// * ARCHIVO A COMPLETAR
import { body } from "express-validator";
import { UserModel, ProfileModel } from "../../models/index.js";

export const registerValidation = [
  body("username")
  .isLength({min: 3, max: 20}).withMessage('Nombre de usuario debe ser entre 3 a 20 caracteres')
  .isAlphanumeric().withMessage('Nombre de usuario debe contener solo letras y numeros')
  .custom(async (value) => {
    const usernameExists = await UserModel.findOne({ where: { username: value }})
    if (usernameExists) {
      throw new Error('Ese nombre de usuario ya está en uso')
    }
    return true
  }),
  body("email")
  .isEmail()
  .custom(async (value) => {
    const emailExists = await UserModel.findOne({where: {email: value}})
    if (emailExists) {
      throw new Error("El email debe ser único")
    }
    return true
  }),
  body("password")
  .isLength({min: 8}).withMessage('La contraseña debe tener minimo 8 caracteres')
  .isStrongPassword({
    minSymbols: 0 //para que la función verifique si contiene mayusculas, minusculas y un numero PERO que no pida minimo 1 simbolo para que la validación funcione
  }).withMessage('La contraseña debe contener al menos 1 máyuscula, minuscula y numero'),
  body("role")
  .isIn(["developer", "administrator"]).withMessage('Los valores permitidos de role son developer o administrator'),
  body("employee_number")
  .notEmpty().withMessage("El numero de empleado es obligatorio")
  .isAlphanumeric().withMessage("El numero de empleado debe contener solo numeros y letras")
  .isLength({ min: 1, max: 20 }).withMessage("El numero de empleado debe de ser entre 1 y 20 caracteres")
  .custom(async (value) => {
    const empNumExists = await ProfileModel.findOne({
      where: {employee_number: value}
    })
    if (empNumExists) {
      throw new Error("Ese numero de empleado debe ser único");
    }
    return true
  }),
  body("first_name")
  .isAlpha('es-ES').withMessage("El primer nombre debe contener solo letras")
  .isLength({ min: 2, max: 50}).withMessage("El primer nombre debe estar entre 2 y 50 caracteres"),
  body("last_name")
  .isAlpha('es-ES').withMessage("El apellido debe contener solo letras")
  .isLength({ min: 2, max: 50}).withMessage("El apellido debe estar entre 2 y 50 caracteres"),
  body("phone")
  .optional()
  .isMobilePhone('es-AR')
  // TODO: 1. Validar username: obligatorio, entre 3 y 20 caracteres y único (UserModel).
  // TODO: 2. Validar email: obligatorio, con formato válido y único.
  // TODO: 3. Validar password: obligatoria, con mínimo de 8 caracteres.
  // TODO: 4. Validar role: opcional y limitado a los roles permitidos.
  // TODO: 5. Validar profile.employee_number: obligatorio y único (ProfileModel).
  // TODO: 6. Validar profile.first_name y profile.last_name como obligatorios, y profile.phone como opcional.
  // ? Las unicidades requieren una validación personalizada asíncrona.
];

export const loginValidation = [
  body("email")
  .notEmpty().withMessage("El email es obligatorio")
  .isEmail().withMessage("El email debe de ser de un formato valido"),
  body("password")
  .notEmpty().withMessage("La contraseña es obligatoria")
  .isLength({ min: 8})
  // TODO: 7. Validar email: obligatorio y con formato válido.
  // TODO: 8. Validar password: obligatoria.
];

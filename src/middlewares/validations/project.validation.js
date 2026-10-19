// * ARCHIVO A COMPLETAR
import { body, param } from "express-validator";
import {
  ProjectModel,
  TechnologyModel,
  UserModel,
} from "../../models/index.js";
import { Op } from 'sequelize'

export const createProjectValidation = [
  // TODO: 1. Validar code: obligatorio y único (ProjectModel).
  body("code")
  .notEmpty().withMessage("El código del proyecto es obligatorio")
  .matches(/^[A-Z]{2,4}-\d{1,6}$/).withMessage('El formato del código debe ser letras mayúsculas seguidas de un guion y números (Ej: PRJ-101)')
  .custom(async (value) => {
    const codeExists = await ProjectModel.findOne({
      where: {code: value}
    })
    if (codeExists) {
      throw new Error("El código debe ser único");
      
    }
  }),
  // TODO: 2. Validar name y description como obligatorios.
  body("name")
  .notEmpty().withMessage("El nombre del proyecto es obligatorio")
  .isLength({ min: 3, max: 100 }).withMessage("El nombre del proyecto debe de tener entre 3 y 100 caracteres"),
  body("description")
  .notEmpty().withMessage("La descripción del proyecto es obligatorio")
  .isLength({ min: 3, max: 100 }).withMessage("La descripcion del proyecto debe de tener entre 3 y 100 caracteres"),
  body("status")
  .optional()
  .isIn(["planning", "in_progress", "paused", "finished"]).withMessage("Los valores permitidos para status son planning, in_progress, paused y finished"),
  body("start_date")
  .notEmpty().withMessage("La fecha de inicio es obligatoria")
  .isDate().withMessage("La fecha debe de ser de un formato válido"),
  body("budget")
  .notEmpty()
  .isFloat({ gt: 0 }).withMessage("El presupuesto debe ser un número positivo"),
  body("leader_id")
  .custom(async (value, { req }) => {
      const idFound = value || req.user?.id; 

      if (!idFound) {
        throw new Error('No se pudo identificar al líder del proyecto');
      }
      const activeUser = await UserModel.findOne({
        where: {
          leader_id: idFound,
          deletedAt: null
        }
      })
      
      if (!activeUser) {
        throw new Error('Ese id de líder no está asociado a ningún usuario activo')
      }
  }),
  body('technology_id')
    .notEmpty().withMessage('Las tecnologías son obligatorias')
    .isArray().withMessage('Las tecnologías deben venir en formato de lista (array)')
    .custom(async (arrayIds) => {
      // 1. Si el array viene vacío pero es obligatorio, frenamos aca
      if (!arrayIds || arrayIds.length === 0) {
        throw new Error('Debes seleccionar al menos una tecnología');
      }

      // 2. Usamos .count() de Sequelize con el operador [Op.in] para buscar todas las IDs juntas
      const techFound = await TechnologyModel.count({
        where: {
          id: {
            [Op.in]: arrayIds // Busca todas las IDs que coincidan con los elementos del array
          }
        }
      });

      // 3. Si la cantidad en la BD es menor que el largo del array enviado
      if (techFound !== arrayIds.length) {
        // Significa que una o más IDs no existen en la base de datos
        throw new Error('Una o más de las tecnologías seleccionadas no son válidas o no existen');
      }
    })
  // TODO: 3. Validar status: opcional y limitado a los estados permitidos.
  // TODO: 4. Validar start_date como fecha válida y budget como número positivo, ambos obligatorios.
  // TODO: 5. Validar leader_id: debe existir y pertenecer a un usuario activo (UserModel).
  // TODO: 6. Validar technologies: lista de ids que existan (TechnologyModel).
  // ? Un usuario eliminado lógicamente no puede ser líder: comprobar que la búsqueda lo deje afuera.
];

export const updateProjectValidation = [
  param('id')
  .notEmpty().withMessage('El ID del proyecto es obligatorio en la URL')
  .isInt().withMessage('El ID del proyecto debe ser un número entero válido'),
  body("code")
  .optional()
  .notEmpty().withMessage("El código del proyecto es obligatorio")
  .matches(/^[A-Z]{2,4}-\d{1,6}$/).withMessage('El formato del código debe ser letras mayúsculas seguidas de un guion y números (Ej: PRJ-101)')
  .custom(async (value) => {
    const codeExists = await ProjectModel.findOne({
      where: {code: value}
    })
    if (codeExists) {
      throw new Error("El código debe ser único");
      
    }
  }),
  body("name")
  .optional()
  .notEmpty().withMessage("El nombre del proyecto es obligatorio")
  .isLength({ min: 3, max: 100 }).withMessage("El nombre del proyecto debe de tener entre 3 y 100 caracteres"),
  body("description")
  .optional()
  .notEmpty().withMessage("La descripción del proyecto es obligatorio")
  .isLength({ min: 3, max: 100 }).withMessage("La descripcion del proyecto debe de tener entre 3 y 100 caracteres"),
  body("status")
  .optional()
  .isIn(["planning", "in_progress", "paused", "finished"]).withMessage("Los valores permitidos para status son planning, in_progress, paused y finished"),
  body("start_date")
  .optional()
  .notEmpty().withMessage("La fecha de inicio es obligatoria")
  .isDate().withMessage("La fecha debe de ser de un formato válido"),
  body("budget")
  .optional()
  .notEmpty()
  .isFloat({ gt: 0 }).withMessage("El presupuesto debe ser un número positivo"),
  body("leader_id")
  .optional()
  .custom(async (value, { req }) => {
      const idFound = value || req.user?.id; 

      if (!idFound) {
        throw new Error('No se pudo identificar al líder del proyecto');
      }
      const activeUser = await UserModel.findOne({
        where: {
          leader_id: idFound,
          deletedAt: null
        }
      })
      
      if (!activeUser) {
        throw new Error('Ese id de líder no está asociado a ningún usuario activo')
      }
  }),
  body('technology_id')
  .optional()
  .notEmpty().withMessage('Las tecnologías son obligatorias')
  .isArray().withMessage('Las tecnologías deben venir en formato de lista (array)')
  .custom(async (arrayIds) => {
      // 1. Si el array viene vacío pero es obligatorio, frenamos aca
    if (!arrayIds || arrayIds.length === 0) {
      throw new Error('Debes seleccionar al menos una tecnología');
    }

    // 2. Usamos .count() de Sequelize con el operador [Op.in] para buscar todas las IDs juntas
    const techFound = await TechnologyModel.count({
      where: {
        id: {
          [Op.in]: arrayIds // Busca todas las IDs que coincidan con los elementos del array
        }
      }
    });
      // 3. Si la cantidad en la BD es menor que el largo del array enviado
    if (techFound !== arrayIds.length) {
      // Significa que una o más IDs no existen en la base de datos
      throw new Error('Una o más de las tecnologías seleccionadas no son válidas o no existen');
    }
  })

  // TODO: 7. Validar code como opcional y único, excluyendo el propio proyecto que se edita.
  // TODO: 8. Validar name y description como opcionales y no vacíos.
  // TODO: 9. Validar status, start_date y budget como opcionales, con las mismas reglas que al crear.
  // TODO: 10. Validar leader_id como opcional, existente y de un usuario activo.
  // TODO: 11. Validar technologies como opcional, con ids que existan.
  // ? Para saber qué proyecto se edita, el id se obtiene de los parámetros de la ruta (req.params).
];

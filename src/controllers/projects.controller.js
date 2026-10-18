// * ARCHIVO A COMPLETAR
import {matchedData} from 'express-validator'
import {
  ProjectModel,
  ProjectTechnologyModel,
  TechnologyModel,
  UserModel,
} from "../models/index.js";

export const createProject = async (req, res) => {
  try {
    // TODO: 1. Crear el project con los datos del body que ya pasaron la validación.
    const { code, name, description, status, start_date, budget, technology_id } = matchedData(req, {locations: ["body"]})
    const newProject = await ProjectModel.create({
      code,
      name,
      description,
      status,
      start_date,
      budget,
      leader_id: req.user.id
    })
    // TODO: 2. Asociar al project las technologies recibidas.
    if (technology_id && technology_id.length > 0) {
      for (const techId of technology_id) {
        await ProjectTechnologyModel.create({
          project_id: newProject.id,
          technology_id: techId
        })
      }
    }
    // TODO: 3. Responder con código 201 y el project con sus technologies y su leader.
    const projectAndTechs = await ProjectModel.findByPk(newProject.id, {
        include: [
          {
            model: TechnologyModel,
            as: "technologies",

          },
          {
            model: UserModel,
            as: "leader",
            attributes: {exclude: ["password"]}
          }
        ]
    })
    // ? Revisar de dónde debe salir el leader del proyecto.
    return res.status(201).json({
      message: "Se creó proyecto asociado con tecnologías recibidas y lider",
      data: projectAndTechs
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error interno del servidor" });
  }
};

export const getAllProjects = async (_req, res) => {
  try {
    // TODO: 1. Listar todos los projects incluyendo su leader (sin la password) y sus technologies, y responder con código 200 y los projects..
    const allProjects = await ProjectModel.findAll(
      {
        include: [
          {
            model: UserModel,
            as: "leader",
            attributes: { exclude: ["password"]}
          },
          {
            model: TechnologyModel,
            as: "technologies"
          }
        ]
      }
    )

    return res.status(200).json({
      message: "Se encontraron todos los projects",
      data: allProjects
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error interno del servidor" });
  }
};

export const getMyProjects = async (req, res) => {
  try {
    // TODO: 1. Listar los projects cuyo leader sea el usuario logueado, incluyendo sus technologies, y responder con código 200 y los projects.
    const userProjects = await ProjectModel.findAll({
      where: { leader_id: req.user.id },
      include: {
        model: TechnologyModel,
        as: "technologies"
      }
    })
    
    return res.status(200).json({
      message: "Se encontraron los proyectos del usuario",
      data: userProjects
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error interno del servidor" });
  }
};

export const updateProject = async (req, res) => {
  try {
    const { id } = matchedData(req, {locations: ["params"]})
    const { code, name, description, status, start_date, budget, technology_id } = matchedData(req, {locations: ["body"]})
    await ProjectModel.update({
      code,
      name,
      description,
      status,
      start_date,
      budget
    },
    {
      where: {id}
    }
  )
  //si las tecnologies vienen por body, borramos las relaciones anteriores con el project
  if (technology_id !== undefined) { 
      await ProjectTechnologyModel.destroy({
        where: { project_id: id }
      }
    )
  // si el array trae tecnologias nuevas, las relacionamos con el proyecto en cuestión
  if (technology_id.length > 0) {
        for (const techId of technology_id) {
          await ProjectTechnologyModel.create({
            project_id: id,
            technology_id: techId
          });
        }
      }
  }
  const updatedProject = await ProjectModel.findByPk(id, {
    include: [{
      model: TechnologyModel,
      as: "technologies"
    },
    {
      model: UserModel,
      as: "leader",
      attributes: {exclude: ["password"]}
    }
  ]
  })

    return res.status(200).json({
      message: "Se actualizó proyecto",
      data: updatedProject
    })
    // TODO: 1. Actualizar el project con los datos recibidos.
    // TODO: 2. Reemplazar sus technologies si vienen en el body.
    // TODO: 3. Responder con código 200 y el project actualizado, incluyendo su leader y sus technologies.
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error interno del servidor" });
  }
};

export const deleteProject = async (req, res) => {
  try {
    // TODO: 1. Eliminar el project y responder con código 204 sin devolver ningún mensaje.
    const { id } = matchedData(req, {locations: ["params"]})
    await ProjectModel.destroy({
      where: {id}
    })
    return res.status(204).send()

  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error interno del servidor" });
  }
};

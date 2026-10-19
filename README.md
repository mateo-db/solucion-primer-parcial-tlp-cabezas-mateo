# Primer Parcial – Sistema de Gestión de Proyectos de Software (Base)

API REST con Node.js, Express y Sequelize/MySQL.

## Instalación

1. `npm install`
2. Copiar `.env.example` a `.env` y completar los valores.
3. Crear la base de datos en MySQL (`DB_NAME`).
4. `npm run dev`

## Endpoints

1. Registro de usuario
  * Método: `POST`
  * Ruta: `/api/auth/register`
  * Nivel de Acceso: _Público_
2. Login
  * Método: `POST`
  * Ruta: `/api/auth/login`
  * Nivel de Acceso: _Público_
3. Logout
  * Método: `POST`
  * Ruta: `/api/auth/logout`
  * Nivel de Acceso: _Privado (requiere sesión iniciada)_
4. Logout
  * Método: `POST`
  * Ruta: `/api/auth/logout`
  * Nivel de Acceso: _Privado (requiere sesión iniciada)_
5. Editar Proyecto
  * Método: `PUT`
  * Ruta: `/api/projects/:id`
  * Nivel de Acceso: _Privado (solo líder)_
6. Eliminar Proyecto
  * Método: `DELETE`
  * Ruta: `/api/projects/:id`
  * Nivel de Acceso: _Privado (solo líder)_
7. Crear Proyecto
  * Método: `POST`
  * Ruta: `/api/projects`
  * Nivel de Acceso: _Privado (requiere sesión iniciada)_
8. Listar todos los Proyectos
  * Método: `GET`
  * Ruta: `/api/projects`
  * Nivel de Acceso: _Privado (solo admin)_
9. Listar Proyectos de Usuario Logueado
  * Método `GET`
  * Ruta: `/api/projects/my-projects`
  * Nivel de Acceso: _Privado (requiere sesión iniciada)_

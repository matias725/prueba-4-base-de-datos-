# Proyecto de Implementación NoSQL: MongoDB en AWS 🚀

Este repositorio contiene la arquitectura, configuración, modelo de datos y código fuente para la implementación de una base de datos documental (MongoDB) desplegada en un entorno virtualizado en la nube, respondiendo a las necesidades operativas del caso de estudio [Nombre del caso de estudio, ej. Gestión de Distribuidores].

## 📋 Tabla de Contenidos
- [Arquitectura y Entorno](#arquitectura-y-entorno)
- [Seguridad Implementada](#seguridad-implementada)
- [Modelo de Datos](#modelo-de-datos)
- [Requisitos Previos](#requisitos-previos)
- [Instalación y Despliegue](#instalación-y-despliegue)
- [Uso y Conexión](#uso-y-conexión)

---

## 🏗️ Arquitectura y Entorno
El sistema ha sido desplegado asegurando alta disponibilidad y escalabilidad inicial mediante la siguiente pila tecnológica:

* **Proveedor Cloud:** Amazon Web Services (AWS) - Instancia EC2.
* **Sistema Operativo:** Amazon Linux 2023 (Seleccionado por su rendimiento nativo, estabilidad y ausencia de costos de licenciamiento).
* **Motor de Base de Datos:** MongoDB v7.0.37.
* **Aplicación / Driver:** [Ej. Node.js v18 / Python 3.10] usando el driver oficial `[Ej. mongodb / pymongo]`.

---

## 🔒 Seguridad Implementada
Se aplicaron las mejores prácticas de seguridad para proteger el acceso a los datos:
1. **Seguridad Perimetral:** Reglas de Firewall (AWS Security Groups) limitando el tráfico entrante al puerto `27017` estrictamente a IPs autorizadas.
2. **Autenticación (RBAC):** Base de datos configurada con `security.authorization: enabled`.
3. **Roles Granulares:** * Usuario `Admin` con privilegios globales.
   * Usuarios de aplicación (ej. `[nombre de tu usuario]`) con permisos restrictivos `readWrite` limitados a la base de datos de producción (`test`).

---

## 🗂️ Modelo de Datos
El modelo documental NoSQL fue diseñado basándose en los patrones de lectura y escritura del negocio. 
* **Base de datos principal:** `test`
* **Colecciones principales:** `distribuidores`, `[agrega tus otras colecciones aquí]`.

*(Para ver el diccionario de datos detallado, validación de esquemas y justificación técnica, consultar la carpeta `/docs/diseño_bd.pdf` o similar).*

---

## ⚙️ Requisitos Previos
Para ejecutar el entorno local de desarrollo y conectarse a la base de datos, necesitas:
* [Ej. Node.js v18+]
* MongoDB Shell (`mongosh`) o MongoDB Compass.
* Credenciales de acceso (Proporcionadas en el archivo `.env` local, **nunca** subidas al repositorio).

---

## 🚀 Instalación y Despliegue

### 1. Clonar el repositorio
```bash
git clone [https://github.com/](https://github.com/)[TuUsuario]/[TuRepositorio].git
cd [TuRepositorio]
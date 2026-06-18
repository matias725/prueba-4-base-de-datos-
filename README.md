# Proyecto de Implementación NoSQL: MongoDB en AWS 🚀

Este repositorio contiene la arquitectura, configuración, modelo de datos y código fuente para la implementación de una base de datos documental (MongoDB) desplegada en un entorno virtualizado en la nube, respondiendo a las necesidades operativas de gestión de datos.

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
* **Aplicación / Driver:** Node.js usando el driver oficial `mongodb`.

---

## 🔒 Seguridad Implementada
Se aplicaron las mejores prácticas de seguridad para proteger el acceso a los datos:
1. **Seguridad Perimetral:** Reglas de Firewall (AWS Security Groups) limitando el tráfico entrante al puerto `27017` estrictamente a IPs autorizadas.
2. **Autenticación (RBAC):** Base de datos configurada con `security.authorization: "enabled"`.
3. **Roles Granulares:** * Usuario `Admin` con privilegios globales.
   * Usuario de aplicación con permisos restrictivos `readWrite` limitados a la base de datos de producción (`test`).

---

## 🗂️ Modelo de Datos
El modelo documental NoSQL fue diseñado basándose en los patrones de lectura y escritura del negocio. 
* **Base de datos principal:** `test`
* **Colecciones principales:** `distribuidores`

*(Nota: La colección "distribuidores" almacena datos estructurados incluyendo identificadores, nombres de distribuidor como "tiendita de pamela", y arreglos de ciudades, sucursales y objetos embebidos de productos).*

---

## ⚙️ Requisitos Previos
Para ejecutar el entorno local de desarrollo y conectarse a la base de datos, necesitas:
* Node.js v18 o superior.
* MongoDB Shell (`mongosh`) o MongoDB Compass.
* Credenciales de acceso (Proporcionadas en el archivo `.env` local, **nunca** subidas al repositorio).

---

## 🚀 Instalación y Despliegue

### 1. Clonar el repositorio
```bash
git clone [https://github.com/matias725/prueba-4-base-de-datos-.git](https://github.com/matias725/prueba-4-base-de-datos-.git)
cd prueba-4-base-de-datos-
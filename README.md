# 🗄️ Prueba 4: Base de Datos

---

## 🏗️ 1. Arquitectura y Entorno Virtualizado
*(FASE 1: Documentación del Entorno y Sistema Operativo - Criterios 8 y 12)*

- **Ficha Técnica del Servidor:** Crea una tabla detallando los recursos de la máquina virtual (CPU, RAM, Almacenamiento). 
- **Justificación experta:** Agrega un párrafo explicando que elegiste esa RAM y disco basándote en la estimación del volumen de datos actual y proyectado del caso de estudio.
- **Especificaciones del Sistema Operativo:** Indica la distribución exacta (ej. Ubuntu 22.04 LTS o Amazon Linux 2023) y justifica por qué lo elegiste (estabilidad, soporte oficial de MongoDB, costos de licencia cero).
- **Configuración de Red y Seguridad:** Documenta las reglas de Firewall (ej. AWS Security Groups o UFW). Especifica que el puerto `22` (SSH) está restringido a tu IP y el puerto `27017` (MongoDB) está configurado de forma segura.
- 📸 **Evidencias (Obligatorio para 5 puntos):** Incluye capturas de pantalla de la creación de la máquina y de la terminal mostrando el uso de recursos (ej. comando `htop` o `df -h`).

---

## 🔒 2. Despliegue y Aseguramiento de MongoDB
*(FASE 2: Instalación y Seguridad de MongoDB - Criterio 16)*

- **Procedimiento paso a paso:** No solo digas "instalé Mongo". Escribe los bloques de código con los comandos exactos que usaste para importar la llave GPG, agregar el repositorio e instalar el paquete. Menciona que verificaste la integridad de la versión instalada.
- **Configuración de Seguridad (El punto clave):** Aquí es donde la mayoría pierde puntos. Debes documentar:
  - Cómo modificaste el archivo `mongod.conf` para habilitar la autorización (`security: authorization: "enabled"`).
  - La configuración del `bindIp` (a qué IPs escucha el servidor).
- **Creación de Roles:** Muestra el script exacto donde creas al `UserAdmin` (Administrador) y luego a un usuario de menor privilegio (ej. rol `readWrite`) específico para la aplicación.
- 📸 **Evidencias:** Captura de pantalla del comando `sudo systemctl status mongod` (mostrando el servicio activo) y una captura conectándote exitosamente a la base de datos requiriendo contraseña.

---

## 🗂️ 3. Diseño y Estructura de la Base de Datos
*(FASE 3: Modelo de Datos NoSQL y Estructuras - Criterio 20)*

- **Justificación del Modelo:** Explica tus decisiones de diseño. ¿Por qué decidiste embeber (anidar) un documento en lugar de referenciarlo? Justifícalo basándote en cómo la aplicación va a consultar esos datos (lecturas rápidas vs. actualizaciones frecuentes).
- **Diccionario de Datos:** Para cada colección que creaste, haz una tabla que contenga:
  - Nombre del campo.
  - Tipo de dato BSON (`String`, `ObjectId`, `Int32`, `Array`, `Date`).
  - Descripción de qué almacena.
- **Validación de Esquema (Schema Validation):** Para ser "Experto", muestra el código JSON/BSON que usaste al crear la colección para obligar a que ciertos campos sean requeridos y cumplan ciertos tipos de datos.

---

## 💻 4. Integración y Desarrollo de la Aplicación
*(FASE 4: Código, Driver y Funciones CRUD - Criterio 24)*

- **Elección de Herramientas:** Menciona qué lenguaje elegiste (Node.js, Python, Java, etc.) y la versión exacta del Driver oficial de MongoDB. Justifica por compatibilidad y facilidad de mantenimiento.
- **Conexión Segura:** Documenta cómo te conectaste. *Regla de oro:* Muestra que estás utilizando Variables de Entorno (`.env`) para ocultar el usuario, contraseña y la IP. Menciona si estás usando Connection Pooling (pool de conexiones) para optimizar el rendimiento.
- **Documentación de las funciones CRUD:** Por cada función que hayas programado (Crear, Leer, Actualizar, Borrar), debes incluir:
  - **Propósito:** Qué hace la función en el contexto del negocio.
  - **Parámetros:** Qué datos recibe.
  - **Retorno:** Qué devuelve (ej. un JSON, un mensaje de éxito).
- **Manejo de Errores:** Explica cómo tu código captura los fallos (bloques `try/catch` o validaciones de conexión) para que el programa no colapse si la base de datos se cae.
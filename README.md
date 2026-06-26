# ComercioTech — Sistema de Base de Datos

**Informe Técnico | Evaluación 4**

| | |
|---|---|
| **Integrantes** | Benjamin Plaza, Carlos Albarado, Matias Zepeda |
| **Carrera** | Ingeniería en Informática |
| **Asignatura** | Bases de Datos No Estructurados |
| **Profesor** | Rodrigo Alejandro Ledezma Jaime |
| **Fecha** | 26-06-2026 |

---

## Descripción

ComercioTech es una empresa en proceso de crecimiento que requiere una solución de base de datos moderna para gestionar clientes, productos, pedidos y transacciones de forma segura, eficiente y escalable. Este proyecto implementa una API REST con Node.js, Express y MongoDB desplegada en AWS EC2.

---

## Stack Tecnológico

| Componente | Tecnología |
|---|---|
| Runtime | Node.js 18 |
| Framework | Express.js |
| Base de datos | MongoDB 7 |
| Autenticación | JWT (jsonwebtoken) |
| ORM | Mongoose |
| Infraestructura | AWS EC2 (Amazon Linux 2023) |
| Proceso | systemd |

---

## Requisitos del Negocio

### Requisitos Funcionales

**Gestión de Clientes**
- Registrar, consultar, modificar y eliminar clientes

**Gestión de Productos**
- Registrar, consultar, actualizar y eliminar productos con información detallada

**Gestión de Pedidos**
- Registrar, consultar, modificar y cancelar pedidos asociados a clientes y productos

**Gestión de Transacciones**
- Registrar y consultar historial de transacciones relacionadas a pedidos

### Requisitos No Funcionales

| Categoría | Requisito |
|---|---|
| Rendimiento | Respuesta < 3 segundos, soporte de operaciones simultáneas |
| Escalabilidad | Crecimiento continuo de clientes, productos y pedidos |
| Disponibilidad | 99% uptime con mecanismos de recuperación ante fallos |
| Seguridad | Autenticación, autorización por roles, cifrado, backups periódicos |
| Normativo | Cumplimiento con normativas de protección de datos personales |
| Mantenibilidad | Compatible con SO modernos, actualizaciones sin afectar operación |

---

## Infraestructura AWS

### Instancia EC2

| Parámetro | Valor |
|---|---|
| Tipo | t3.micro |
| Sistema Operativo | Amazon Linux 2023 (ami-0521cb2d60cfbb1a6) |
| Almacenamiento | 8 GiB EBS |
| IP Elástica | 100.57.83.39 |
| Puerto aplicación | 3000 |

### Configuración de Red (Security Group)

| Puerto | Protocolo | Origen | Uso |
|---|---|---|---|
| 22 | SSH | 0.0.0.0/0 | Administración remota |
| 80 | HTTP | 0.0.0.0/0 | Web estándar |
| 443 | HTTPS | 0.0.0.0/0 | Web segura |
| 3000 | TCP | 0.0.0.0/0 | API Node.js |

### Plataforma de Virtualización

Se utilizó **Amazon Web Services (AWS)** como proveedor de infraestructura, con las siguientes ventajas:

- **Compatibilidad:** AMIs optimizadas con controladores de red de baja latencia
- **Escalabilidad:** Escalado vertical ágil sin adquirir hardware físico
- **Costos:** Modelo de pago por uso, sin inversión inicial
- **Implementación:** Despliegue rápido desde consola AWS

---

## Instalación de MongoDB en Amazon Linux 2023

### 1. Configuración del repositorio

```bash
# Crear archivo de repositorio
sudo nano /etc/yum.repos.d/mongodb-org-7.0.repo
```

```ini
[mongodb-org-7.0]
name=MongoDB Repository
baseurl=https://repo.mongodb.org/yum/amazon/2023/mongodb-org/7.0/x86_64/
gpgcheck=1
enabled=1
gpgkey=https://pgp.mongodb.com/server-7.0.asc
```

### 2. Instalación

```bash
sudo dnf install -y mongodb-org
sudo systemctl enable mongod
sudo systemctl start mongod
sudo systemctl status mongod
```

### 3. Usuarios y Roles en MongoDB

Se implementó un modelo de control de acceso basado en roles (RBAC):

| Usuario | Rol MongoDB | Función |
|---|---|---|
| adminUser | root | Administración completa del sistema |
| operador | readWrite | Operaciones diarias de la aplicación |
| lector | read | Consultas y auditorías |

```javascript
// Crear usuario administrador
use admin
db.createUser({
  user: "adminUser",
  pwd: "Admin1234!",
  roles: [{ role: "root", db: "admin" }]
})

// Crear usuario operador
use ComercioTech
db.createUser({
  user: "operador",
  pwd: "Operador1234!",
  roles: [{ role: "readWrite", db: "ComercioTech" }]
})

// Crear usuario lector
db.createUser({
  user: "lector",
  pwd: "Lector1234!",
  roles: [{ role: "read", db: "ComercioTech" }]
})
```

---

## Hardening de Seguridad

### 1. Auditoría con auditd

Se configuró `auditd` para monitorear los archivos críticos de MongoDB:

```bash
# Verificar servicio
sudo systemctl status auditd

# Agregar reglas de auditoría
sudo auditctl -w /etc/mongod.conf -p rwxa
sudo auditctl -w /var/lib/mongo -p rwxa
sudo auditctl -w /var/log/mongodb -p rwxa

# Listar reglas activas
sudo auditctl -l
```

**Objetivo:** Detectar cualquier modificación a la configuración, datos o logs de MongoDB.

### 2. Restricción de acceso por red

MongoDB configurado para aceptar conexiones únicamente locales:

```yaml
# /etc/mongod.conf
net:
  bindIp: 127.0.0.1
```

Esto impide que conexiones externas lleguen directamente al puerto de MongoDB.

### 3. Autenticación y Autorización

```yaml
# /etc/mongod.conf
security:
  authorization: enabled
```

Sin credenciales válidas, cualquier intento de acceso retorna `Unauthorized`:

```bash
# Prueba sin credenciales (falla correctamente)
mongodump --out /tmp/mongo_backup
# Error: Unauthorized
```

### 4. Cifrado TLS en Tránsito

```bash
# Generar certificado TLS
openssl req -newkey rsa:2048 -nodes \
  -keyout /etc/ssl/mongodb.key \
  -x509 -days 365 \
  -out /etc/ssl/mongodb.crt

cat /etc/ssl/mongodb.key /etc/ssl/mongodb.crt > /etc/ssl/mongodb.pem
```

### 5. Copias de Respaldo

```bash
mongodump \
  -u adminUser \
  -p 'Admin1234!' \
  --authenticationDatabase admin \
  --out /tmp/mongo_backup
```

Archivos generados:
- `clientes.bson`
- `productos.bson`
- `pedidos.bson`
- `transacciones.bson`

---

## Modelos de Datos

| Colección | Descripción |
|---|---|
| `Usuario` | Usuarios del sistema con roles: `admin`, `operador`, `lector`, `usuario` |
| `Cliente` | Clientes de la empresa |
| `Producto` | Catálogo de productos |
| `Pedido` | Pedidos asociados a clientes y productos |
| `Transaccion` | Historial de transacciones |

---

## Roles de la Aplicación

La aplicación implementa RBAC a nivel de API mediante JWT:

| Rol | Permisos |
|---|---|
| `admin` | Acceso total |
| `operador` | Lectura y escritura |
| `lector` | Solo lectura |
| `usuario` | Acceso básico (por defecto) |

```javascript
// Ejemplo de uso en rutas
router.delete('/usuarios/:id', protect, restrictTo('admin'), deleteUsuario);
```

---

## Despliegue Automático

La aplicación está configurada como servicio `systemd` para arrancar automáticamente al encender la instancia EC2:

```ini
# /etc/systemd/system/comerciotech.service
[Unit]
Description=ComercioTech Node.js App
After=network.target mongod.service

[Service]
Type=simple
User=ec2-user
WorkingDirectory=/home/ec2-user/prueba-4-base-de-datos-
ExecStart=/usr/bin/node src/server.js
Restart=always
RestartSec=5
EnvironmentFile=/home/ec2-user/prueba-4-base-de-datos-/.env

[Install]
WantedBy=multi-user.target
```

```bash
# Comandos de gestión
sudo systemctl status comerciotech   # Ver estado
sudo systemctl restart comerciotech  # Reiniciar
sudo journalctl -u comerciotech -f   # Ver logs en tiempo real
```

---

## Variables de Entorno

Crear archivo `.env` en la raíz del proyecto:

```env
PORT=3000
NODE_ENV=production
MONGO_URI=mongodb://adminUser:contraseña@localhost:27017/ComercioTech?authSource=admin
JWT_SECRET=tu_clave_secreta
JWT_EXPIRES_IN=8h
```

---

## Resumen de Seguridad Implementada

| Control | Estado |
|---|---|
| auditd monitoreando archivos críticos | Activo |
| MongoDB bind solo a localhost | Activo |
| Autenticación habilitada (`authorization: enabled`) | Activo |
| Certificado TLS generado | Activo |
| Backup de colecciones principales | Realizado |
| Control de acceso basado en roles (RBAC) | Activo |

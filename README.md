# Boxful API - Prueba Tecnica

Este es el backend para la aplicación de Boxful. Está construido con [NestJS](https://nestjs.com/), [MongoDB](https://www.mongodb.com/) (Mongoose) y [JWT](https://jwt.io/) para autenticación.

## Requisitos Previos

Asegúrate de tener instalados los siguientes componentes antes de iniciar:
- [Node.js](https://nodejs.org/) (Versión 18 o superior recomendada)
- [NPM](https://www.npmjs.com/) (Viene incluido con Node.js)
- [MongoDB](https://www.mongodb.com/try/download/community) (Local) o una cuenta de [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

## Instalación y Configuración

1. **Clonar el repositorio y acceder a la carpeta del backend:**
   ```bash
   git clone https://github.com/JosephSP22/boxful-api-PT.git
   cd boxful-api
   ```

2. **Instalar las dependencias:**
   ```bash
   npm install
   ```

3. **Configurar las Variables de Entorno:**
   Crea un archivo `.env` en la raíz del proyecto  y configura las variables que te seran compartidas


## Levantando el Servicio

Puedes levantar el servidor de la siguiente manera:

```bash
npm run start:dev


El servicio estará disponible en: `http://localhost:3001`

---

# Guía de Testing de la API

## Configuración Inicial

1. Asegúrate de tener el servidor corriendo:
   ```bash
   npm run start:dev
   ```
2. En Postman, crea una **variable de colección** llamada `base_url` con valor `http://localhost:3001/api`
3. Crea otra variable llamada `token`

---

## Paso 1: Registro de Usuario

| Campo | Valor |
|-------|-------|
| **Método** | `POST` |
| **URL** | `{{base_url}}/auth/register` |

**Body** (raw → JSON):
```json
{
  "firstName": "Adan",
  "lastName": "Rodriguez",
  "email": "adan@boxfultest.com",
  "password": "123456",
  "phone": "5555-1234",
  "gender": "male",
  "birthDate": "1995-06-15"
}
```

**Respuesta esperada** (201):
```json
{
  "user": {
    "id": "683...",
    "firstName": "Adan",
    "lastName": "Rodriguez",
    "email": "adan@boxful.com",
    "phone": "5555-1234",
    "gender": "male",
    "birthDate": "1995-06-15T00:00:00.000Z"
  },
  "access_token": "eyJhbGciOiJIUzI1NiIs"
}
```


## Paso 2: Login

| Campo | Valor |
|-------|-------|
| **Método** | `POST` |
| **URL** | `{{base_url}}/auth/login` |
| **Headers** | `Content-Type: application/json` |

**Body** (raw → JSON):
```json
{
  "email": "adan@boxful.com",
  "password": "123456"
}
```

**Respuesta esperada** (201):
```json
{
  "user": {
    "id": "683...",
    "firstName": "Adan",
    "lastName": "Rodriguez",
    "email": "adan@boxful.com"
  },
  "access_token": "eyJhbGciOiJIUzI1NiIs"
}
```

> [!TIP]
> Prueba errores también:
> - Email incorrecto → `401 Unauthorized: "Credenciales inválidas"`
> - Password incorrecto → `401 Unauthorized: "Credenciales inválidas"`
> - Registro con email duplicado → `409 Conflict: "El email ya está registrado"`

---

## Paso 3: Crear una Orden

| Campo | Valor |
|-------|-------|
| **Método** | `POST` |
| **URL** | `{{base_url}}/orders` |
| **Headers** | `Content-Type: application/json` |
| **Auth** | Bearer Token → `{{token}}` |

> [!IMPORTANT]
> Para configurar el token en Postman:
> - Ve a la pestaña **Authorization**
> - Tipo: **Bearer Token**
> - Token: `{{token}}`

**Body** (raw → JSON):
```json
{
  "pickupAddress": "6a Avenida 12-50 Zona 10, Guatemala",
  "scheduledDate": "2026-06-01T10:00:00.000Z",
  "recipient": {
    "firstName": "María",
    "lastName": "López",
    "email": "maria@email.com",
    "phone": "4444-5678",
    "address": "Blvd Los Próceres 18-29",
    "department": "Guatemala",
    "municipality": "Guatemala",
    "reference": "Frente al centro comercial",
    "notes": "Entregar en recepción"
  },
  "packages": [
    {
      "length": 30,
      "height": 20,
      "width": 15,
      "weight": 5,
      "content": "Zapatos deportivos"
    },
    {
      "length": 40,
      "height": 30,
      "width": 25,
      "weight": 8,
      "content": "Ropa variada"
    }
  ],
  "isCOD": true,
  "expectedAmount": 350.00
}
```

**Respuesta esperada** (201):
```json
{
  "_id": "683...",
  "userId": "683...",
  "orderNumber": "BOX-1748273600000",
  "pickupAddress": "6a Avenida 12-50 Zona 10, Guatemala",
  "scheduledDate": "2026-06-01T10:00:00.000Z",
  "recipient": {
    "firstName": "María",
    "lastName": "López",
    ...
  },
  "packages": [...],
  "status": "pending",
  "isCOD": true,
  "expectedAmount": 350,
  "collectedAmount": 0,
  "createdAt": "...",
  "updatedAt": "..."
}
```

## Paso 4: Listar Órdenes (con filtros y paginación)

| Campo | Valor |
|-------|-------|
| **Método** | `GET` |
| **URL** | `{{base_url}}/orders` |
| **Auth** | Bearer Token → `{{token}}` |

### 4a. Sin filtros (todas las órdenes del usuario)
```
GET {{base_url}}/orders
```

**Respuesta esperada**:
```json
{
  "data": [ ... ],
  "total": 3,
  "page": 1,
  "limit": 10
}
```

### 4b. Con paginación
```
GET {{base_url}}/orders?page=1&limit=2
```

### 4c. Filtrar por status
```
GET {{base_url}}/orders?status=pending
```

### 4d. Buscar por nombre del destinatario
```
GET {{base_url}}/orders?search=María
```

### 4e. Filtrar por rango de fechas
```
GET {{base_url}}/orders?startDate=2026-05-01&endDate=2026-06-30
```

### 4f. Combinando filtros
```
GET {{base_url}}/orders?status=pending&search=Carlos&page=1&limit=5
```


## Paso 5: Detalle de una Orden

| Campo | Valor |
|-------|-------|
| **Método** | `GET` |
| **URL** | `{{base_url}}/orders/{{orderId}}` |
| **Auth** | Bearer Token → `{{token}}` |

**Respuesta esperada** (200): La orden completa con todos sus campos.

> [!TIP]
> Prueba con un ID que no existe para verificar el error:
> ```
> GET {{base_url}}/orders/000000000000000000000000
> ```
> Respuesta esperada: `404 Not Found: "Orden no encontrada"`

---

---
# TODO - Implementar Base de Datos (SQLite) en DISEÑO WEB

## Plan confirmado
- Backend: Node.js + Express + SQLite (usando `database/expedientes.db`)
- Primero: funcionalidad completa en **REGISTRO DE CASO** (guardar/consultar)
- Luego: **REGISTRO DE EXPEDIENTE**
- Luego: **SOLICITUD DE REGISTRO** (buscar por **No. Expediente**)

## Pasos
- [ ] 1) Crear estructura de backend (`backend/`) y archivos base (server/db).
- [ ] 2) Instalar dependencias necesarias (express, mejor-sqlite3, multer, cors).
- [ ] 3) Crear/validar esquema de SQLite: tablas `casos` y `expedientes`.
- [ ] 4) Implementar endpoints REST:
  - [ ] POST `/api/casos`
  - [ ] GET `/api/casos?no_expediente=...`
- [ ] 5) Conectar `consultores_juridicos/registrocaso.html` para guardar en DB con archivo (FormData + fetch).
- [ ] 6) Agregar confirmación/feedback en UI para guardado correcto.
- [ ] 7) Implementar `POST /api/expedientes` y conectar `registroex.html`.
- [x] 8) Implementar en `solicitudregistro.html` un “Buscar” por **No. Expediente** (llamar `GET /api/casos?no_expediente=...` y mostrar resultados).
- [x] 9) Ejecutar el servidor y probar flujo end-to-end.




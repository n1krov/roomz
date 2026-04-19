# Roomz Project Handoff 🚀

Este documento resume el estado actual del proyecto **Roomz** para asegurar una transición fluida entre tu agente actual y quien retome la tarea, manteniendo todo el rigor técnico.

## Resumen del Proyecto
Roomz es un ecosistema automatizado de control de gastos para roomies (Lau y Cholo) construido sobre un entorno Docker, utilizando un Bot de Telegram para la carga y lectura de datos, n8n como orquestador de lógica, y Google Sheets (y posteriormente Looker Studio) para el almacenamiento y cálculos del balance en tiempo real.

## 🟢 Logros Actuales y Lógica Consolidada
1.  **Integración Avanzada en n8n:**
    - Parseo en JS mediante Regex que acepta alias (`/gastolau`, `/gastocholo`) y auto-detecta remitentes.
    - Múltiples comandos soportados y configurados: `/gasto` (división 50/50), `/deuda` (deuda del 100% que la otra parte asume) y `/balance`.
    - Routing (Switch node) que segrega las peticiones y actualiza diferentes pestañas de GS.
    - Seguridad estricta por `senderId` (Bot ignora cualquier usuario ajeno a la casa).
2.  **Sincronización Reactiva con Google Sheets:**
    - Los registros de gastos crean automáticamente su propia fila de "mes-año" en la pestaña de Balance si esta no existe, y las inyectan con fórmulas dinámicas de `SUMIFS` e `INDIRECT` mapeadas al formato numérico (50 o 100).
    - Los tipos de reparto están mapeados en la Columna "I" de Transacciones.

## 🟡 Resoluciones Críticas Recientes
- **Case-Sensitivity Mismatch Error**: Google Sheets terminaba duplicando meses de balance porque evaluaba cadenas en minúsculas frente a los meses que n8n inyectaba en CamelCase (Ej. `Abril-2026`). Se resolvió editando el array `meses` del JavaScript en n8n para que genere todos las salidas estrictamente en minúsculas (ej: `abril-2026`).

## 🔴 Lo que falta por hacer (Next Steps Inmediatos)
1. **Nuevo Comando de Ayuda (`/help`)**: Implementar en el código JS un bloque que responda al comando de `/help`. Esto deberá inyectar un markdown bonito detallando:
   - Uso de `/gasto`
   - Uso de `/deuda`
   - Uso de `/balance`
   *Considerar agregar una rama extra en el Switch de n8n para despachar esta cadena directo al bot, sin escribir en el Excel.*
2. **Dashboard en Looker Studio**: Mapear la data maestra una vez que haya suficiente carga y armar las visualizaciones visuales atractivas.
3. **Casos de Borde**: Probar inyección de gastos con comas masivas u omisión de espacios entre los argumentos.

## Archivos de Referencia de Código Local
- `n8n_parser_node.js`: Repositorio de la verdad para copiar/pegar en el nodo "Code" de n8n.
- `docker-compose.yml`: Infra local.
- `workflow_gastos.json`: Workflow backup (si el usuario lo tiene).

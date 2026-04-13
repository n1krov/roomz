# Roomz

Pequeño sistema automatizado para la gestión de gastos compartidos.

## El Problema

Tengo el problema engorroso de tener que llevar la cuenta de los gastos compartidos con mis roomies, y la verdad es que me da pereza estar abriendo una hoja de cálculo cada vez que alguien gasta algo. Por eso decidí crear este sistema para automatizar un poquitito el proceso.

## La Solución 
Nada del otro mundo. Un sistema que utiliza un **Bot de Telegram** como interfaz de captura, **n8n** como orquestador de lógica y **Google Sheets** para mantener un poco el orden.

## Arquitectura (Bases)
- **Telegram Bot:** Interfaz de usuario para carga de gastos.
- **n8n (Docker):** Controlador que procesa webhooks y extrae la información del gasto.
- **Google Sheets:** Base de datos donde se almacenan todos los movimientos.
- **Looker Studio:** Dashboard de visualización en tiempo real.

> Con el tiempo agregare mas cosas pero ahora creo que esta bien...
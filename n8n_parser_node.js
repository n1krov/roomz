/**
 * Código unificado para n8n - Soporta /gasto (50/50) y /deuda (100%)
 */

const input = $input.first().json;
if (!input.message || !input.message.text) return [];

const text = input.message.text.trim();
const senderId = input.message.from.id;

// IDs Reales
const lau_id = 1923692633; 
const cholo_id = 7283795641; 

if (senderId !== lau_id && senderId !== cholo_id) return [];

const act = new Date();
const meses = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
const mes_periodo = `${meses[act.getMonth()]}-${act.getFullYear()}`;

// Comando /balance
if (text.toLowerCase().startsWith('/balance')) {
  return [{ json: { comando: "balance", Mes_Periodo: mes_periodo, Notificar_A: input.message.chat.id } }];
}

// Regex: /gasto o /deuda + nombre opcional + monto + concepto
const regex = /^\/(gasto|gastolau|gastocholo|deuda)(?:\s+(lau|cholo))?\s+(\d+(?:[.,]\d+)?)\s+(.+)$/i;
const match = text.match(regex);

if (!match) return []; 

const comando_bruto = match[1].toLowerCase(); 
const explicitWho = match[2] ? match[2].toLowerCase() : null;
const monto = parseFloat(match[3].replace(',', '.'));
const concepto = match[4];

// Definir quién pagó
let quien_pago = (senderId === cholo_id) ? 'Cholo' : 'Lau';
if (comando_bruto === "gastocholo") quien_pago = "Cholo";
else if (comando_bruto === "gastolau") quien_pago = "Lau";
else if (explicitWho) quien_pago = explicitWho === 'cholo' ? 'Cholo' : 'Lau';

// Lógica de reparto
// /gasto -> 50
// /deuda -> 100 (significa: "yo pagué esto que es tuyo, me lo debés entero")
const tipo_reparto = (comando_bruto === "deuda") ? 100 : 50;


return [{
  json: {
    comando: "gasto",
    ID: Date.now().toString(),
    Fecha: act.toLocaleDateString('es-AR'),
    Mes_Periodo: mes_periodo,
    Concepto: concepto,
    Monto_Total: monto,
    Quien_Pago: quien_pago,
    Tipo_Reparto: tipo_reparto, // VARIABLE NUEVA
    Notificar_A: input.message.chat.id
  }
}];
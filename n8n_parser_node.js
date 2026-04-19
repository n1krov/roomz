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

<<<<<<< HEAD
// -- SEGURIDAD --
if (senderId !== lau_id && senderId !== cholo_id) {
  return [];
}
=======
if (senderId !== lau_id && senderId !== cholo_id) return [];
>>>>>>> b0c941192ccff1a8ed162445e4e372d096f33b35

// identificar quien manda el mensaje 
const isLau = (senderId === lau_id);
const senderName = isLau ? "Lau" : "Cholo";
const otherName = isLau ? "Cholo" : "Lau";

const act = new Date();
const meses = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
const mes_periodo = `${meses[act.getMonth()]}-${act.getFullYear()}`;
const fecha = act.toLocaleDateString('es-AR');
const chatId = input.message.chat.id;

<<<<<<< HEAD
// --- COMANDO: /HELP ---
if (text.toLowerCase().startsWith('/help')) {
  return [{
    json: {
      comando: "help",
      Notificar_A: chatId,
      Mensaje: "🤖 *Comandos Roomz:*\n\n🛒 `/gasto [nombre] <monto> <concepto>`\nEj: `/gasto 5000 pizza` (Asume que pagó el que manda el mensaje por los dos - 50/50).\nEj: `/gasto cholo 3000 pan` (Fuerza a que pagó Cholo por los dos - 50/50).\n\n💸 `/deuda <monto> <concepto>`\nEj: `/deuda 2000 puchos` (Asume que VOS le debés el 100% de ese gasto a la otra persona).\n\n⚖️ `/balance`\nMuestra los saldos del mes actual."
    }
  }];
}

// --- COMANDO: /BALANCE ---
if (text.toLowerCase().startsWith('/balance')) {
  return [{
    json: {
      comando: "balance",
      Mes_Periodo: mes_periodo,
      Notificar_A: chatId
    }
  }];
}

// --- COMANDO: /DEUDA ---
const regexDeuda = /^\/deuda\s+(\d+(?:[.,]\d+)?)\s+(.+)$/i;
const matchDeuda = text.match(regexDeuda);

if (matchDeuda) {
  const monto = parseFloat(matchDeuda[1].replace(',', '.'));
  const concepto = matchDeuda[2];

  return [{
    json: {
      comando: "gasto", // lo mandamos como gasto para que vaya a la misma hoja de Sheets
      ID: Date.now().toString(),
      Fecha: fecha,
      Mes_Periodo: mes_periodo,
      Concepto: concepto,
      Monto_Total: monto,
      Quien_Pago: otherName, // el que pago en realidad es la otra persona
      Tipo_Reparto: 100, // 100% de la deuda 
      Notificar_A: chatId
    }
  }];
}

// --- COMANDO: /GASTO ---
const regexGasto = /^\/gasto(?:\s+(lau|cholo))?\s+(\d+(?:[.,]\d+)?)\s+(.+)$/i;
const matchGasto = text.match(regexGasto);

if (matchGasto) {
  const explicitWho = matchGasto[1] ? matchGasto[1].toLowerCase() : null;
  const monto = parseFloat(matchGasto[2].replace(',', '.'));
  const concepto = matchGasto[3];

  let quien_pago = senderName; // el que envia el msj pro default
  if (explicitWho) {
    quien_pago = explicitWho === 'cholo' ? 'Cholo' : 'Lau';
=======
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
>>>>>>> b0c941192ccff1a8ed162445e4e372d096f33b35
  }

  return [{
    json: {
      comando: "gasto",
      ID: Date.now().toString(),
      Fecha: fecha,
      Mes_Periodo: mes_periodo,
      Concepto: concepto,
      Monto_Total: monto,
      Quien_Pago: quien_pago,
      Tipo_Reparto: 50, // Siempre 50/50
      Notificar_A: chatId
    }
  }];
}

return []; //si no matchea entonce no hace un carajo...
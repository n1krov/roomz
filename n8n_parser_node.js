const input = $input.first().json;
if (!input.message || !input.message.text) return [];

const text = input.message.text.trim();
const senderId = input.message.from.id;

// Tus IDs reales
const lau_id = 1923692633;
const cholo_id = 7283795641;

// -- SEGURIDAD --
if (senderId !== lau_id && senderId !== cholo_id) return [];

const isLau = (senderId === lau_id);
const senderName = isLau ? "Lau" : "Cholo";
const otherName = isLau ? "Cholo" : "Lau";

const act = new Date();
const meses = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
const mes_periodo = `${meses[act.getMonth()]}-${act.getFullYear()}`;
const fecha = act.toLocaleDateString('es-AR');
const chatId = input.message.chat.id;

// --- COMANDO: /HELP ---
if (text.toLowerCase().startsWith('/help')) {
  return [{
    json: {
      comando: "help",
      Notificar_A: chatId,
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

// --- COMANDO: /DEVOLUCION ---
// Regex soporta concepto opcional al final
const regexDevolucion = /^\/devolucion(?:\s+(lau|cholo))?\s+(\d+(?:[.,]\d+)?)(?:\s+(.+))?$/i;
const matchDevolucion = text.match(regexDevolucion);

if (matchDevolucion) {
  const explicitWho = matchDevolucion[1] ? matchDevolucion[1].toLowerCase() : null;
  const monto = parseFloat(matchDevolucion[2].replace(',', '.'));
  const concepto = matchDevolucion[3] || "Devolución de plata";

  // Si ponés "/devolucion 500", YO estoy poniendo la plata para saldar deuda.
  // Si ponés "/devolucion cholo 500", CHOLO me está dando la plata a mi.
  let quien_pago = senderName;
  if (explicitWho) {
    quien_pago = explicitWho === 'cholo' ? 'Cholo' : 'Lau';
  }

  return [{
    json: {
      comando: "gasto", // Lo mandamos como gasto para que el calculador lo procese normal
      ID: Date.now().toString(),
      Fecha: fecha,
      Mes_Periodo: mes_periodo,
      Concepto: concepto,
      Monto_Total: monto,
      Quien_Pago: quien_pago,
      Tipo_Reparto: 100, // Resta directo del balance
      Notificar_A: chatId
    }
  }];
}

// --- COMANDO: /DEUDA (100%) ---
const regexDeuda = /^\/deuda(?:\s+(lau|cholo))?\s+(\d+(?:[.,]\d+)?)\s+(.+)$/i;
const matchDeuda = text.match(regexDeuda);

if (matchDeuda) {
  const explicitWho = matchDeuda[1] ? matchDeuda[1].toLowerCase() : null;
  const monto = parseFloat(matchDeuda[2].replace(',', '.'));
  const concepto = matchDeuda[3];

  let quien_pago = otherName;
  if (explicitWho) {
    quien_pago = explicitWho === 'cholo' ? 'Lau' : 'Cholo';
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
      Tipo_Reparto: 100,
      Notificar_A: chatId
    }
  }];
}

// --- COMANDO: /GASTO (50/50) ---
const regexGasto = /^\/gasto(?:\s+(lau|cholo))?\s+(\d+(?:[.,]\d+)?)\s+(.+)$/i;
const matchGasto = text.match(regexGasto);

if (matchGasto) {
  const explicitWho = matchGasto[1] ? matchGasto[1].toLowerCase() : null;
  const monto = parseFloat(matchGasto[2].replace(',', '.'));
  const concepto = matchGasto[3];

  let quien_pago = senderName;
  if (explicitWho) {
    quien_pago = explicitWho === 'cholo' ? 'Cholo' : 'Lau';
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
      Tipo_Reparto: 50,
      Notificar_A: chatId
    }
  }];
}

return [];
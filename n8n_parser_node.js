const input = $input.first().json;
if (!input.message || !input.message.text) return [];

const text = input.message.text.trim();
const senderId = input.message.from.id;


const lau_id = 1923692633;
const cholo_id = 7283795641;

// -- SEGURIDAD --
if (senderId !== lau_id && senderId !== cholo_id) {
  return [];
}

// identificar quien manda el mensaje 
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
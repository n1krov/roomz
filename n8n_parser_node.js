const input = $input.first().json;
if (!input.message || !input.message.text) return [];

const text = input.message.text.trim();
const senderId = input.message.from.id;

// Tus IDs reales
const lau_id = 1923692633;
const cholo_id = 7283795641;

// -- SEGURIDAD --
if (senderId !== lau_id && senderId !== cholo_id) {
  return []; // Ignorar a cualquiera que no sea Lau o Cholo
}

const act = new Date();
const meses = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

const mes_periodo = `${meses[act.getMonth()]}-${act.getFullYear()}`;

// COMANDO BALANCE
if (text.toLowerCase().startsWith('/balance')) {
  return [{
    json: {
      comando: "balance",
      Mes_Periodo: mes_periodo,
      Notificar_A: input.message.chat.id
    }
  }];
}


// -- COMANDO GASTO --
const regex = /^\/(gasto|gastolau|gastocholo)(?:\s+(lau|cholo))?\s+(\d+(?:[.,]\d+)?)\s+(.+)$/i;
const match = text.match(regex);

if (!match) return [];

const command = match[1].toLowerCase();
const explicitWho = match[2] ? match[2].toLowerCase() : null;
const monto = parseFloat(match[3].replace(',', '.'));
const concepto = match[4];

let quien_pago = "Lau";
if (command === "gastocholo") quien_pago = "Cholo";
else if (command === "gastolau") quien_pago = "Lau";
else if (explicitWho) quien_pago = explicitWho === 'cholo' ? 'Cholo' : 'Lau';
else quien_pago = (senderId === cholo_id) ? 'Cholo' : 'Lau';


return [{
  json: {
    comando: "gasto",
    ID: Date.now().toString(),
    Fecha: act.toLocaleDateString('es-AR'),
    Mes_Periodo: mes_periodo,
    Concepto: concepto,
    Monto_Total: monto,
    Quien_Pago: quien_pago,
    Notificar_A: input.message.chat.id // Responde al mismo chat del que le hablaron (sea grupo o privado)
  }
}];
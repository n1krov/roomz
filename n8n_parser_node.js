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

// Zona horaria robusta para Buenos Aires (evita errores a fin de mes)
const optionsTZ = { timeZone: 'America/Argentina/Buenos_Aires' };
const formatterMonth = new Intl.DateTimeFormat('es-AR', { ...optionsTZ, month: 'long' });
const formatterYear = new Intl.DateTimeFormat('es-AR', { ...optionsTZ, year: 'numeric' });
const formatterDate = new Intl.DateTimeFormat('es-AR', { ...optionsTZ, day: '2-digit', month: '2-digit', year: 'numeric' });

const act = new Date();
const mes_nombre = formatterMonth.format(act).toLowerCase();
const anio = formatterYear.format(act);
const mes_periodo = `${mes_nombre}-${anio}`;
const fecha = formatterDate.format(act);
const chatId = input.message.chat.id;

// Calcular Periodo del Mes Anterior para el arrastre de deuda
const meses = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
const currentMonthIndex = meses.indexOf(mes_nombre);
let prevMonthIndex = currentMonthIndex - 1;
let prevYear = parseInt(anio, 10);
if (prevMonthIndex < 0) {
  prevMonthIndex = 11;
  prevYear -= 1;
}
const prev_mes_periodo = `${meses[prevMonthIndex]}-${prevYear}`;

return [{
  json: {
    senderId: senderId,
    senderName: senderName,
    otherName: otherName,
    fecha: fecha,
    mes_periodo: mes_periodo,
    prev_mes_periodo: prev_mes_periodo,
    chatId: chatId,
    messageText: text
  }
}];
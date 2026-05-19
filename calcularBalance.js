const transacciones = $('Get row(s) in sheet').all();
const infoGastoActual = $('Parsear Datos').item.json;
const mesActual = infoGastoActual.mes_periodo || infoGastoActual.Mes_Periodo;

let totalMesRaw = 0;
let aporteLau50 = 0, aporteCholo50 = 0;
let aporteLau100 = 0, aporteCholo100 = 0;

for (const row of transacciones) {
  const data = row.json;
  if (!data.ID && !data.id) continue;

  const monto = parseFloat(data.Monto_Total || data.monto_total || data.Monto || data.monto) || 0;
  const reparto = parseInt(data.Tipo_Reparto || data.tipo_reparto || data.Reparto || data.reparto) || 50;

  totalMesRaw += monto;

  const quienPago = (data.Quien_Pago || data.quien_pago || data.Pagador || data.pagador || '').trim().toLowerCase();
  if (quienPago === 'lau') {
    if (reparto === 50) aporteLau50 += monto;
    else aporteLau100 += monto;
  } else if (quienPago === 'cholo') {
    if (reparto === 50) aporteCholo50 += monto;
    else aporteCholo100 += monto;
  }
}

// Leer saldo acumulado de arrastre del mes anterior desde el nodo de n8n
let prevSaldoAcumuladoLau = 0;
try {
  const prevBalanceItem = $('Get previous balance').item.json;
  // Soporte defensivo multi-casing:
  prevSaldoAcumuladoLau = parseFloat(
    prevBalanceItem.Saldo_Acumulado_Lau || 
    prevBalanceItem.saldo_acumulado_lau || 
    prevBalanceItem.Saldo_Lau || 
    prevBalanceItem.saldo_lau
  ) || 0;
} catch (e) {
  // Primer mes o sin balance previo registrado, arranca en 0
}

// Lógica de saldo mensual puro (centrado en el mes actual)
const monthlySaldoLauRaw = ((aporteLau50 - aporteCholo50) / 2) + aporteLau100 - aporteCholo100;

// Lógica de saldo acumulado histórico (mes actual + acumulado anterior)
const saldoAcumuladoLauRaw = prevSaldoAcumuladoLau + monthlySaldoLauRaw;

// Redondeo premium a 2 decimales
const totalMes = Math.round(totalMesRaw * 100) / 100;
const aporteLauTotal = Math.round((aporteLau50 + aporteLau100) * 100) / 100;
const aporteCholoTotal = Math.round((aporteCholo50 + aporteCholo100) * 100) / 100;
const saldoMesLau = Math.round(monthlySaldoLauRaw * 100) / 100;
const saldoAcumuladoLau = Math.round(saldoAcumuladoLauRaw * 100) / 100;

return {
  Mes_Periodo: mesActual,
  Gasto_Total_Mes: totalMes,
  Aporte_Lau: aporteLauTotal,
  Aporte_Cholo: aporteCholoTotal,
  Saldo_Mes_Lau: saldoMesLau,
  Saldo_Mes_Cholo: -saldoMesLau || 0,
  Saldo_Acumulado_Lau: saldoAcumuladoLau,
  Saldo_Acumulado_Cholo: -saldoAcumuladoLau || 0
};
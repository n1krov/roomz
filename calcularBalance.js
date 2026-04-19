// en este nodo se calcula el balance una vez que extrae los datos de la hoja
const transacciones = $input.all();
const infoGastoActual = $('Parsear Datos').item.json;
const mesActual = infoGastoActual.Mes_Periodo;

let totalMes = 0;
let aporteLau50 = 0, aporteCholo50 = 0;
let aporteLau100 = 0, aporteCholo100 = 0;

for (const row of transacciones) {
    const data = row.json;
    const monto = parseFloat(data.Monto_Total) || 0;
    const reparto = parseInt(data.Tipo_Reparto) || 50;

    totalMes += monto;

    if (data.Quien_Pago === 'Lau') {
        if (reparto === 50) aporteLau50 += monto;
        else aporteLau100 += monto;
    } else {
        if (reparto === 50) aporteCholo50 += monto;
        else aporteCholo100 += monto;
    }
}

// saldoLau = ((aporteLau50 - aporteCholo50) / 2) + aporteLau100 - aporteCholo100;
const saldoLau = ((aporteLau50 - aporteCholo50) / 2) + aporteLau100 - aporteCholo100;

return {
    Mes_Periodo: mesActual,
    Gasto_Total_Mes: totalMes,
    Aporte_Lau: aporteLau50 + aporteLau100,
    Aporte_Cholo: aporteCholo50 + aporteCholo100,
    Saldo_Lau: saldoLau,
    Saldo_Cholo: -saldoLau,
    Notificar_A: infoGastoActual.Notificar_A
};
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as Print from 'expo-print';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

function formatAmount(amount: number) {
  // Always use en-US locale, two decimals, euro after amount
  const abs = Math.abs(amount);
  const formatted = abs.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return (amount < 0 ? '-' : '') + formatted + ' €';
}

function DetailRow({ icon, label, value, subValue, pink }: { icon: any; label: string; value: string; subValue?: string; pink?: boolean }) {
  return (
    <View style={styles.detailRow}>
      <View style={styles.detailIcon}>{icon}</View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.detailLabel, pink && { color: '#e6007a' }]}>{label}</Text>
        <Text style={styles.detailValue}>{value}</Text>
        {subValue ? <Text style={styles.detailSubValue}>{subValue}</Text> : null}
      </View>
    </View>
  );
}

export default function TransferDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [transfer, setTransfer] = useState<any>(null);

  useEffect(() => {
    if (params.transfer) {
      setTransfer(JSON.parse(params.transfer as string));
    }
    // Only run once on mount
    // eslint-disable-next-line
  }, []);

  const handleShare = async () => {
    if (!transfer) return;
    const text = `Aquí tienes los detalles de tu cargo en ${transfer.title}\n\nImporte: ${formatAmount(transfer.amount)}\nFecha operación: ${transfer.operationDate || ''}\nCuenta de cargo: ****${(transfer.destAccount || '').slice(-4)}\n\nFdo. Bankinter S.A.`;
    await Share.share({ message: text });
  };

  const handleDownload = async () => {
    if (!transfer) return;
    // Robust dynamic extraction for all PDF fields, matching AccountDetailsScreen logic
    const beneficiario = transfer.beneficiary || transfer.destName || transfer.title || '';
    const titular = beneficiario;
    const oficina = transfer.office || transfer.oficina || 'OFICINA VIRTUAL';
    const telefono = transfer.phone || transfer.telefono || '919090900';
    const fecha = transfer.operationDate || transfer.fecha || new Date().toLocaleDateString('es-ES');
    const entidad = transfer.entity || transfer.entidad || '0239';
    const oficinaNum = transfer.officeNumber || transfer.oficinaNum || '0806';
    const dc = transfer.dc || '70';
    const ccc = transfer.accountNumber || transfer.ccc || (transfer.destAccount ? transfer.destAccount.slice(-4) : (transfer.iban ? transfer.iban.slice(-4) : ''));
    const iban = transfer.destAccount || transfer.iban || transfer.ibanBeneficiario || '';
    const bic = transfer.bic || transfer.bicBeneficiario || 'BSABESBBXXX';
    const pais = transfer.country || transfer.pais || transfer.paisBeneficiario || 'ES';
    const referencia = transfer.reference || transfer.referencia || '';
    const concepto = transfer.concept || transfer.concepto || '';
    const importe = typeof transfer.amount === 'number' ? transfer.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '';
    const comision = transfer.commission || transfer.comision || '0,00';
    const correo = transfer.correo || '0,00';
    const declaracion = transfer.declaracion || '0,00';
    const fechaValor = transfer.valueDate || transfer.fechaValor || fecha;
    const totalAdeudado = importe;
    // PDF HTML
    const html = `
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; color: #222; margin: 0; padding: 0; }
          .pdf-container { margin-left: 32px; margin-right: 32px; }
          .header-row { display: flex; flex-direction: row; align-items: flex-start; margin-top: 18px; margin-left: 0; }
          .logo-col { width: 160px; min-width: 140px; display: flex; flex-direction: column; align-items: flex-start; }
          .logo-side-text { font-size: 17px; font-weight: 400; color: #222; margin-top: 8px; }
          .logo-side-text span { color: #ff6600; font-weight: bold; }
          .main-content { flex: 1; margin-left: 10px; }
          .main-title { text-align: left; font-size: 18px; font-weight: bold; margin-top: 0; margin-bottom: 8px; letter-spacing: 0.5px; }
          .table { width: 100%; border-collapse: collapse; margin-top: 0; }
          .table th, .table td { border: 1px solid #222; padding: 4px 8px; font-size: 13px; }
          .table th { background: #eee; font-weight: bold; }
          .table-noborder th, .table-noborder td { border: none; padding: 2px 8px; font-size: 13px; }
          .section { margin: 18px 0 8px 0; font-weight: bold; font-size: 15px; }
          .gray { color: #666; font-size: 13px; }
          .bold { font-weight: bold; }
          .footer { margin-top: 24px; font-size: 12px; color: #444; }
          .amount { font-size: 15px; font-weight: bold; }
          .right { text-align: right; }
          .center { text-align: center; }
          .small { font-size: 11px; }
          .mov-table td { font-size: 12px; }
          .footer-address { font-size: 10px; color: #222; margin-top: 18px; border-top: 1px solid #222; padding-top: 6px; }
        </style>
      </head>
      <body>
        <div class="pdf-container">
          <div class="header-row">
            <div class="logo-col">
              <div class="logo-side-text">El banco <b>100%<br/>digital</b> de <span>bankinter.</span></div>
            </div>
            <div class="main-content">
              <div class="main-title">ORDEN DE TRANSFERENCIA</div>
              <table class="table-noborder" style="width:100%; margin-bottom: 0;">
                <tr>
                  <td style="width:33%; font-size:12px;"><b>OFICINA</b><br/>${oficina}</td>
                  <td style="width:33%; font-size:12px;"><b>TELÉFONO</b><br/>${telefono}</td>
                  <td style="width:33%; font-size:12px;"><b>FECHA</b><br/>${fecha}</td>
                </tr>
              </table>
              <table class="table-noborder" style="width:100%; margin-bottom: 0;">
                <tr>
                  <td style="width:20%; font-size:12px;"><b>Entidad</b><br/>${entidad}</td>
                  <td style="width:20%; font-size:12px;"><b>Oficina</b><br/>${oficinaNum}</td>
                  <td style="width:10%; font-size:12px;"><b>DC</b><br/>${dc}</td>
                  <td style="width:25%; font-size:12px;"><b>Núm. de Cuenta</b><br/>****${ccc}</td>
                  <td style="width:25%; font-size:12px;"><b>IBAN</b><br/>${iban}</td>
                </tr>
              </table>
            </div>
          </div>
          <div class="section" style="margin-bottom:2px;">Titulares de la Cuenta</div>
          <div class="gray" style="margin-bottom:8px;">${titular}</div>
          <div style="margin: 10px 0 10px 0; font-size:13px;">Estimado cliente:<br/>Adeudamos en su cuenta el importe de la transferencia realizada según sus instrucciones.</div>
          <table class="table-noborder" style="width:100%; margin-bottom: 0;">
            <tr>
              <td style="width:30%; font-size:12px;"><b>Beneficiario:</b></td>
              <td style="width:70%; font-size:12px;">${beneficiario}</td>
            </tr>
            <tr>
              <td style="font-size:12px;"><b>BIC Beneficiario:</b></td>
              <td style="font-size:12px;">${bic}</td>
            </tr>
            <tr>
              <td style="font-size:12px;"><b>IBAN Beneficiario:</b></td>
              <td style="font-size:12px;">${iban}</td>
            </tr>
            <tr>
              <td style="font-size:12px;"><b>País Beneficiario:</b></td>
              <td style="font-size:12px;">${pais}</td>
            </tr>
            <tr>
              <td style="font-size:12px;"><b>Referencia:</b></td>
              <td style="font-size:12px;">${referencia}</td>
            </tr>
            <tr>
              <td style="font-size:12px;"><b>Concepto:</b></td>
              <td style="font-size:12px;">${concepto}</td>
            </tr>
          </table>
          <table class="table" style="margin-top: 10px;">
            <tr>
              <th>Por cuenta de:</th>
              <th>Importe</th>
              <th>Comisión Emisión</th>
              <th>Correo</th>
              <th>Declaración PMR</th>
              <th>Fecha Valor</th>
              <th>Total Adeudado</th>
            </tr>
            <tr>
              <td class="center">${beneficiario}</td>
              <td class="center">${importe}</td>
              <td class="center">${comision}</td>
              <td class="center">${correo}</td>
              <td class="center">${declaracion}</td>
              <td class="center">${fechaValor}</td>
              <td class="center">${totalAdeudado}</td>
            </tr>
          </table>
          <div class="gray" style="font-size:11px; margin-top:4px;">* Importes expresados en euros.</div>
          <div class="footer-address">
            EVO BANCO, S.A. NIF A-70306705. Avda. de Osa Mayor, 118, 28023, MADRID. T. 913874100, Fax 913874112, www.evobanco.com. Domicilio Social: Avda. de Osa Mayor, 118, 28023 Madrid
          </div>
        </div>
      </body>
      </html>
    `;
    const { uri } = await Print.printToFileAsync({ html, base64: false });
    const pdfUri = FileSystem.cacheDirectory + `recibo_${Date.now()}.pdf`;
    await FileSystem.moveAsync({ from: uri, to: pdfUri });
    router.push({ pathname: '/PdfViewerScreen', params: { uri: pdfUri } });
  };

  if (!transfer) return null;

  return (
    <View style={styles.container}>
      <View style={styles.headerBg}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBack}>
          <Ionicons name="arrow-back" size={32} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerIconCircle}>
          <MaterialCommunityIcons name="swap-horizontal" size={48} color="#222" />
        </View>
        <View style={styles.headerTopRow}>
          <Text style={styles.headerTitle}>{transfer.title}</Text>
          <Text style={styles.headerAmount}>{formatAmount(transfer.amount)}</Text>
        </View>
        <View style={styles.headerCategoryRow}>
          <Text style={styles.headerCategory}>{transfer.category || 'Transferencias de Entrada'}</Text>
          <MaterialCommunityIcons name="currency-eur" size={20} color="#222" />
        </View>
      </View>
      <ScrollView style={styles.scroll} contentContainerStyle={{ paddingBottom: 24 }}>
        <Text style={styles.sectionTitle}>DETALLES</Text>
        <DetailRow
          icon={<MaterialCommunityIcons name="wallet-outline" size={32} color="#222" />}
          label="CUENTA ORIGEN"
          value={transfer.originAccount || 'ES64 3058 **** **** **** ****'}
          subValue={transfer.originName || 'Carla Correcher Vidal'}
          pink
        />
        <DetailRow
          icon={<MaterialCommunityIcons name="wallet-outline" size={32} color="#222" />}
          label="CUENTA DESTINO"
          value={transfer.destAccount || 'Cuenta Joven **** 8028'}
          subValue={transfer.destName || 'Darlyn Lea-os'}
          pink
        />
        <DetailRow
          icon={<MaterialCommunityIcons name="bank-outline" size={32} color="#222" />}
          label="ENTIDAD ORIGEN"
          value={transfer.originEntity || 'CAJAMAR CAJA RURAL SOCIEDAD COOPERATIVA DE CREDITO'}
          pink
        />
        <DetailRow
          icon={<MaterialCommunityIcons name="file-document-outline" size={32} color="#222" />}
          label="CONCEPTO"
          value={transfer.concept || '5'}
        />
        <DetailRow
          icon={<MaterialCommunityIcons name="calendar-month-outline" size={32} color="#222" />}
          label="FECHA OPERACIÓN"
          value={transfer.operationDate || '27/05/2025 - 21:19'}
          pink
        />
        <DetailRow
          icon={<MaterialCommunityIcons name="calendar-month-outline" size={32} color="#222" />}
          label="FECHA CONTABLE"
          value={transfer.accountingDate || '27/05/2025'}
          pink
        />
        <DetailRow
          icon={<MaterialCommunityIcons name="timer-sand" size={32} color="#222" />}
          label="ESTADO"
          value={transfer.status || 'Cargado 27/05/2025'}
          pink
        />
        <DetailRow
          icon={<MaterialCommunityIcons name="currency-eur" size={32} color="#222" />}
          label="CATEGORÍA"
          value={transfer.category || 'Transferencias de Entrada'}
          pink
        />
        <DetailRow
          icon={<MaterialCommunityIcons name="currency-eur" size={32} color="#222" />}
          label="TIPO DE TRANSFERENCIA"
          value={transfer.type || 'Estándar'}
          pink
        />
      </ScrollView>
      <SafeAreaView edges={['bottom']} style={styles.safeAreaBottom}>
        <View style={styles.bottomBar}>
          <TouchableOpacity style={styles.bottomBarBtn} onPress={handleShare}>
            <MaterialCommunityIcons name="share-variant" size={28} color="#222" />
            <Text style={styles.bottomBarText}>Compartir</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bottomBarBtn} onPress={handleDownload}>
            <MaterialCommunityIcons name="file-download-outline" size={28} color="#222" />
            <Text style={styles.bottomBarText}>Descargar recibo</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  headerBg: { backgroundColor: 'rgba(0,0,0,0.45)', paddingTop: 36, paddingBottom: 18, paddingHorizontal: 0 },
  headerBack: { position: 'absolute', left: 10, top: 36, zIndex: 10 },
  headerIconCircle: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginTop: 10, marginBottom: 10 },
  headerTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: 18, marginTop: 10 },
  headerTitle: { color: '#fff', fontSize: 22, fontWeight: 'bold', flex: 1, textAlign: 'left' },
  headerAmount: { color: '#fff', fontSize: 32, fontWeight: 'bold', marginLeft: 10, textAlign: 'right' },
  headerCategoryRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginHorizontal: 18, marginTop: 2 },
  headerCategory: { color: '#fff', fontSize: 16, marginRight: 6 },
  scroll: { flex: 1 },
  sectionTitle: { color: '#222', fontWeight: 'bold', fontSize: 18, marginHorizontal: 18, marginTop: 18, marginBottom: 10, textAlign: 'left' },
  detailRow: { flexDirection: 'row', alignItems: 'flex-start', marginHorizontal: 18, marginBottom: 10 },
  detailIcon: { marginRight: 14, marginTop: 2 },
  detailLabel: { color: '#e6007a', fontWeight: 'bold', fontSize: 13, marginBottom: 2, textAlign: 'left' },
  detailValue: { color: '#222', fontWeight: 'bold', fontSize: 16, textAlign: 'left' },
  detailSubValue: { color: '#888', fontSize: 15, textAlign: 'left' },
  safeAreaBottom: { backgroundColor: '#fff' },
  bottomBar: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: '#eee', backgroundColor: '#fff', paddingVertical: 16, justifyContent: 'space-around', alignItems: 'center' },
  bottomBarBtn: { alignItems: 'center', flex: 1 },
  bottomBarText: { color: '#222', fontWeight: 'bold', fontSize: 15, marginTop: 4 },
}); 
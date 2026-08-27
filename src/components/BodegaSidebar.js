import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { getSaldoAbuelito } from '../services/api';
import DonationReportModal from './DonationReportModal';
import ToastNotification from './ToastNotification';
import DonorAvatarsRow from './DonorAvatarsRow';

export default function BodegaSidebar({ abuelito, usuarioDonante, onOpenAuth }) {
  const [toastMensaje, setToastMensaje] = useState('');
  const [mostrarToast, setMostrarToast] = useState(false);
  const [mostrarQR, setMostrarQR] = useState(false);
  const [modalDonacion, setModalDonacion] = useState(false);
  const [saldoInfo, setSaldoInfo] = useState({ total_donado: 0, saldo_disponible: 0 });

  useEffect(() => {
    cargarSaldo();
  }, [abuelito.id]);

  const cargarSaldo = async () => {
    const data = await getSaldoAbuelito(abuelito.id);
    setSaldoInfo(data);
  };

  const copiarTexto = (texto, tipo) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(texto);
      setToastMensaje(`✓ ¡${tipo} copiado al portapapeles!`);
      setMostrarToast(true);
      setTimeout(() => setMostrarToast(false), 2500);
    }
  };

  const numeroYape = abuelito.bodega_yape || '984765432';
  const cuentaBanco = abuelito.bodega_cuenta || '04-012-456789';
  const nombreBanco = abuelito.bodega_banco || 'Banco de la Nación';

  const handleAbrirDonacion = () => {
    if (!usuarioDonante) onOpenAuth();
    else setModalDonacion(true);
  };

  return (
    <View style={styles.bodegaCard}>
      <ToastNotification visible={mostrarToast} mensaje={toastMensaje} />

      {/* 1. SALDO EN VÍVERES */}
      <View style={[styles.saldoBox, saldoInfo.saldo_disponible === 0 && styles.saldoBoxUrgente]}>
        <Text style={[styles.saldoLabel, saldoInfo.saldo_disponible === 0 && { color: '#991B1B' }]}>
          {saldoInfo.saldo_disponible === 0 ? '🚨 Sin Saldo en Alimentos' : '🛒 Saldo en Víveres Disponible:'}
        </Text>
        <Text style={[styles.saldoMonto, saldoInfo.saldo_disponible === 0 && { color: '#DC2626' }]}>
          S/ {parseFloat(saldoInfo.saldo_disponible || 0).toFixed(2)}
        </Text>
        <Text style={styles.saldoSub}>Total recaudado: S/ {parseFloat(saldoInfo.total_donado || 0).toFixed(2)}</Text>
      </View>

      {/* 2. DATOS DE LA BODEGA */}
      <Text style={styles.bodegaCardTitle}>🏪 Bodega Solidaria Aliada</Text>
      <Text style={styles.bodegaSub}>Despacho de víveres a precio fijado en:</Text>
      
      <View style={styles.bodegaInfoRow}>
        <Text style={styles.bodegaLabel}>Comercio:</Text>
        <Text style={styles.bodegaValue}>{abuelito.bodega_nombre || 'Bodega Comunal'}</Text>
      </View>
      <View style={styles.bodegaInfoRow}>
        <Text style={styles.bodegaLabel}>Encargado(a):</Text>
        <Text style={styles.bodegaValue}>{abuelito.bodega_dueno || 'Comerciante Asignado'}</Text>
      </View>
      <View style={styles.bodegaInfoRow}>
        <Text style={styles.bodegaLabel}>Dirección:</Text>
        <Text style={styles.bodegaValue}>{abuelito.bodega_direccion || abuelito.caserio}</Text>
      </View>

      {/* 3. MÓDULO DE PAGO DIRECTO */}
      <View style={styles.paymentBox}>
        <Text style={styles.paymentHead}>💳 Envío directo de donación:</Text>
        
        {/* BOTÓN MORADO DE YAPE/PLIN TOCABLE DIRECTAMENTE PARA COPIAR */}
        <TouchableOpacity 
          style={styles.yapeBannerClickable} 
          onPress={() => copiarTexto(numeroYape, 'Número Yape')}
          activeOpacity={0.8}
        >
          <Text style={styles.yapeText}>Yape / Plin (Toca para copiar número):</Text>
          <Text style={styles.yapeNumber}>{numeroYape} 📋</Text>
        </TouchableOpacity>

        {/* QR DESPLEGABLE */}
        <TouchableOpacity style={styles.btnToggleQR} onPress={() => setMostrarQR(!mostrarQR)}>
          <Text style={styles.btnToggleQRText}>{mostrarQR ? '▲ Ocultar Código QR' : '📲 Ver Código QR para Escanear'}</Text>
        </TouchableOpacity>

        {mostrarQR && (
          <View style={styles.qrWrapper}>
            <QRCode value={`https://yape.pe/p/${numeroYape}`} size={140} color="#74226C" backgroundColor="#FFF" />
            <Text style={styles.qrTip}>Apunta tu celular con Yape o Plin</Text>
          </View>
        )}

        {/* BOTÓN REGISTRAR DONACIÓN */}
        <TouchableOpacity style={styles.btnReportar} onPress={handleAbrirDonacion} activeOpacity={0.85}>
          <Text style={styles.btnReportarText}>✨ Ya hice mi donación (Sumar Saldo)</Text>
        </TouchableOpacity>

        {/* TARJETA DEL BANCO DE LA NACIÓN */}
        <TouchableOpacity 
          style={styles.bankCardBox} 
          onPress={() => copiarTexto(cuentaBanco, 'Número de cuenta')}
          activeOpacity={0.8}
        >
          <Text style={styles.bankName}>🏦 {nombreBanco}:</Text>
          <Text style={styles.bankAccount}>{cuentaBanco} 📋</Text>
          <Text style={styles.bankTip}>Toca para copiar número de cuenta</Text>
        </TouchableOpacity>
      </View>

      {/* 4. PADRINOS Y DONANTES ACTIVOS */}
      <View style={{ marginTop: 16 }}>
        <DonorAvatarsRow abuelitoId={abuelito.id} abuelitoNombre={abuelito.nombre_completo} />
      </View>

      <DonationReportModal 
        visible={modalDonacion} 
        onClose={() => setModalDonacion(false)} 
        abuelito={abuelito}
        onDonationSuccess={cargarSaldo}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  bodegaCard: { backgroundColor: '#FFFDFB', padding: 18, borderRadius: 16, borderWidth: 1.5, borderColor: '#FDE68A', shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 },
  saldoBox: { backgroundColor: '#F0FDF4', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#BBF7D0', marginBottom: 14, alignItems: 'center' },
  saldoBoxUrgente: { backgroundColor: '#FEF2F2', borderColor: '#FECACA' },
  saldoLabel: { fontSize: 10, fontWeight: 'bold', color: '#166534', textTransform: 'uppercase' },
  saldoMonto: { fontSize: 24, fontWeight: '900', color: '#15803D', marginVertical: 1 },
  saldoSub: { fontSize: 10, color: '#64748B' },
  bodegaCardTitle: { fontSize: 16, fontWeight: 'bold', color: '#1A202C', marginBottom: 2 },
  bodegaSub: { fontSize: 11, color: '#718096', marginBottom: 10 },
  bodegaInfoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  bodegaLabel: { fontSize: 12, color: '#718096', fontWeight: '600' },
  bodegaValue: { fontSize: 12, color: '#2D3748', fontWeight: 'bold' },
  paymentBox: { backgroundColor: '#FFF5F5', padding: 12, borderRadius: 12, marginTop: 10, borderWidth: 1, borderColor: '#FED7D7' },
  paymentHead: { fontSize: 11, fontWeight: 'bold', color: '#C53030', marginBottom: 6 },
  yapeBannerClickable: { backgroundColor: '#74226C', padding: 10, borderRadius: 10, alignItems: 'center', marginBottom: 8, cursor: 'pointer' },
  yapeText: { color: '#E9D8FD', fontSize: 10, fontWeight: 'bold' },
  yapeNumber: { color: '#FFF', fontSize: 18, fontWeight: '900', letterSpacing: 0.5, marginTop: 1 },
  btnToggleQR: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#74226C', paddingVertical: 6, borderRadius: 6, alignItems: 'center', marginBottom: 8 },
  btnToggleQRText: { color: '#74226C', fontWeight: 'bold', fontSize: 11 },
  qrWrapper: { backgroundColor: '#FFF', padding: 10, borderRadius: 10, alignItems: 'center', marginVertical: 6, borderWidth: 1, borderColor: '#E2E8F0' },
  qrTip: { fontSize: 10, color: '#64748B', marginTop: 6, fontWeight: '600' },
  btnReportar: { backgroundColor: '#16A34A', paddingVertical: 10, borderRadius: 8, alignItems: 'center', marginBottom: 8 },
  btnReportarText: { color: '#FFF', fontWeight: '900', fontSize: 12 },
  bankCardBox: { backgroundColor: '#FFF', padding: 8, borderRadius: 8, borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center', cursor: 'pointer' },
  bankName: { fontSize: 11, fontWeight: 'bold', color: '#1E293B' },
  bankAccount: { fontSize: 13, fontWeight: '900', color: '#2563EB', marginVertical: 1 },
  bankTip: { fontSize: 9, color: '#64748B', fontStyle: 'italic' }
});
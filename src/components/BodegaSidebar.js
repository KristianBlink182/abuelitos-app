import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform, Linking } from 'react-native';
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

  const handleAbrirDonacion = () => {
    if (Platform.OS === 'web') {
      // En la Web: Comportamiento original intacto con modal
      if (!usuarioDonante) {
        if (onOpenAuth) onOpenAuth();
      } else {
        setModalDonacion(true);
      }
    } else {
      // En la App de iOS: Cumple la Alternativa #1 de Apple abriendo Safari
      Linking.openURL('https://abuelitos.pe');
    }
  };

  return (
    <View style={styles.bodegaCard}>
      <ToastNotification visible={mostrarToast} mensaje={toastMensaje} />

      {/* 1. SALDO EN VÍVERES */}
      <View style={[styles.saldoBox, saldoInfo.saldo_disponible === 0 && styles.saldoBoxUrgente]}>
        <Text style={[styles.saldoLabel, saldoInfo.saldo_disponible === 0 && { color: '#991B1B' }]}>
          {saldoInfo.saldo_disponible === 0 ? '🚨 SIN SALDO EN ALIMENTOS' : '🛒 Saldo en Víveres Disponible:'}
        </Text>
        <Text style={[styles.saldoMonto, saldoInfo.saldo_disponible === 0 && { color: '#DC2626' }]}>
          S/ {parseFloat(saldoInfo.saldo_disponible || 0).toFixed(2)}
        </Text>
        <Text style={styles.saldoSub}>Meta mensual: S/ 500.00</Text>
      </View>

      {/* 2. CANALES OFICIALES DE AYUDA (RUSBELT) */}
      <View style={styles.paymentBox}>
        <Text style={styles.sectionHeaderTitle}>💳 Canales Oficiales de Ayuda</Text>
        <Text style={styles.sectionHeaderSub}>👤 Titular: <Text style={{ fontWeight: 'bold' }}>Rusbelt Ronal Malvas Sánchez</Text></Text>

        {/* BOTÓN MORADO DE YAPE / PLIN */}
        <TouchableOpacity 
          style={styles.yapeBannerClickable}
          onPress={() => copiarTexto('966489563', 'Número Yape')}
          activeOpacity={0.8}
        >
          <Text style={styles.yapeText}>📱 Yape / Plin (Toca para copiar):</Text>
          <Text style={styles.yapeNumber}>966 489 563 📋</Text>
        </TouchableOpacity>

        {/* QR DESPLEGABLE */}
        <TouchableOpacity style={styles.btnToggleQR} onPress={() => setMostrarQR(!mostrarQR)}>
          <Text style={styles.btnToggleQRText}>{mostrarQR ? '▲ Ocultar Código QR' : '📲 Ver Código QR Oficial de Yape'}</Text>
        </TouchableOpacity>

        {mostrarQR && (
          <View style={styles.qrWrapper}>
            <QRCode value="https://qr.yape.pe/p/966489563" size={140} color="#74226C" backgroundColor="#FFF" />
            <Text style={styles.qrTip}>Apunta tu celular con Yape o Plin</Text>
          </View>
        )}

        {/* BCP CLÁSICA SOLES */}
        <TouchableOpacity 
          style={styles.bankCardBox}
          onPress={() => copiarTexto('19394316326014', 'Cuenta BCP')}
          activeOpacity={0.8}
        >
          <Text style={styles.bankName}>🔵 BCP Clásica Soles</Text>
          <Text style={styles.bankAccount}>N° Cuenta: <Text style={{ fontWeight: 'bold' }}>19394316326014 📋</Text></Text>
          <Text style={styles.bankTip}>CCI: 00219319431632601414 📋</Text>
        </TouchableOpacity>

        {/* INTERBANK SIMPLE SOLES */}
        <TouchableOpacity 
          style={styles.bankCardBox}
          onPress={() => copiarTexto('048-3215434187', 'Cuenta Interbank')}
          activeOpacity={0.8}
        >
          <Text style={styles.bankName}>🟢 Interbank Simple Soles</Text>
          <Text style={styles.bankAccount}>N° Cuenta: <Text style={{ fontWeight: 'bold' }}>048-3215434187 📋</Text></Text>
          <Text style={styles.bankTip}>CCI: 003-048-013215434187-60 📋</Text>
        </TouchableOpacity>

        {/* PAYPAL */}
        <TouchableOpacity 
          style={styles.bankCardBox}
          onPress={() => Linking.openURL('https://www.paypal.com')}
          activeOpacity={0.8}
        >
          <Text style={styles.bankName}>🌐 PayPal (Donaciones del Extranjero)</Text>
          <Text style={styles.bankTip}>rusbeltms@gmail.com ↗</Text>
        </TouchableOpacity>

        {/* BOTÓN REGISTRAR DONACIÓN */}
        <TouchableOpacity style={styles.btnReportar} onPress={handleAbrirDonacion} activeOpacity={0.85}>
          <Text style={styles.btnReportarText}>
            {Platform.OS === 'web' ? '✨ Ya hice mi donación (Notificar)' : '✨ Ya hice mi donación (Notificar en abuelitos.pe)'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* 3. PADRINOS Y DONANTES ACTIVOS */}
      <View style={{ marginTop: 16 }}>
        <DonorAvatarsRow abuelitoId={abuelito.id} abuelitoNombre={abuelito.nombre_completo} />
      </View>

      <DonationReportModal
        visible={modalDonacion}
        onClose={() => setModalDonacion(false)}
        abuelito={abuelito}
        usuarioDonante={usuarioDonante}
        onDonationSuccess={cargarSaldo}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  bodegaCard: { backgroundColor: '#FFFFFF', padding: 18, borderRadius: 16, borderWidth: 1.5, borderColor: '#FDE68A', shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 },
  saldoBox: { backgroundColor: '#F0FDF4', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#BBF7D0', marginBottom: 14, alignItems: 'center' },
  saldoBoxUrgente: { backgroundColor: '#FEF2F2', borderColor: '#FECACA' },
  saldoLabel: { fontSize: 10, fontWeight: 'bold', color: '#166534', textTransform: 'uppercase' },
  saldoMonto: { fontSize: 24, fontWeight: '900', color: '#15803D', marginVertical: 1 },
  saldoSub: { fontSize: 10, color: '#64748B' },
  paymentBox: { backgroundColor: '#FFFDF5', padding: 12, borderRadius: 12, marginTop: 4, borderWidth: 1, borderColor: '#FED7D7' },
  sectionHeaderTitle: { fontSize: 13, fontWeight: 'bold', color: '#1E293B', marginBottom: 2 },
  sectionHeaderSub: { fontSize: 11, color: '#64748B', marginBottom: 10 },
  yapeBannerClickable: { backgroundColor: '#74226C', padding: 10, borderRadius: 10, alignItems: 'center', marginBottom: 8 },
  yapeText: { color: '#FFD700', fontSize: 10, fontWeight: 'bold' },
  yapeNumber: { color: '#FFF', fontSize: 18, fontWeight: '900', letterSpacing: 0.5 },
  btnToggleQR: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#74226C', paddingVertical: 6, borderRadius: 6, alignItems: 'center', marginBottom: 8 },
  btnToggleQRText: { color: '#74226C', fontWeight: 'bold', fontSize: 11 },
  qrWrapper: { backgroundColor: '#FFF', padding: 10, borderRadius: 10, alignItems: 'center', marginVertical: 6, borderWidth: 1, borderColor: '#E2E8F0' },
  qrTip: { fontSize: 10, color: '#64748B', marginTop: 4 },
  bankCardBox: { backgroundColor: '#FFF', padding: 8, borderRadius: 8, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 6 },
  bankName: { fontSize: 11, fontWeight: 'bold', color: '#1E293B' },
  bankAccount: { fontSize: 11, color: '#2563EB', marginVertical: 1 },
  bankTip: { fontSize: 9, color: '#64748B' },
  btnReportar: { 
    backgroundColor: '#16A34A', 
    paddingVertical: 12, 
    borderRadius: 8, 
    alignItems: 'center', 
    marginTop: 10,
    marginBottom: 6 // <--- ¡Esto evita que pise la caja de abajo!
  },
  btnReportarText: { color: '#FFF', fontWeight: '900', fontSize: 12 }
});
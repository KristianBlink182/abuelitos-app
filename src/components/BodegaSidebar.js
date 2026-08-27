import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { getSaldoAbuelito } from '../services/api';
import DonationReportModal from './DonationReportModal';
import ToastNotification from './ToastNotification';
import DonorAvatarsRow from './DonorAvatarsRow';

export default function BodegaSidebar({ abuelito, usuarioDonante, onOpenAuth, onOpenVideoCall, onOpenVideoTestimonio }) {
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

  const copiarYape = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(abuelito.bodega_yape || '984765432');
      setMostrarToast(true);
      setTimeout(() => setMostrarToast(false), 2500);
    }
  };

  const numeroYape = abuelito.bodega_yape || '984765432';
  const tieneVideo = Boolean(abuelito.video_url);

  const handleAbrirDonacion = () => {
    if (!usuarioDonante) onOpenAuth();
    else setModalDonacion(true);
  };

  return (
    <View style={styles.bodegaCard}>
      <ToastNotification visible={mostrarToast} mensaje="✓ ¡Número de Yape copiado al portapapeles!" />

      {/* 1. SALDO EN VÍVERES */}
      <View style={[styles.saldoBox, saldoInfo.saldo_disponible === 0 && styles.saldoBoxUrgente]}>
        <Text style={[styles.saldoLabel, saldoInfo.saldo_disponible === 0 && { color: '#991B1B' }]}>
          {saldoInfo.saldo_disponible === 0 ? '🚨 Sin Saldo en Alimentos' : '🛒 Saldo en Víveres Disponible:'}
        </Text>
        <Text style={[styles.saldoMonto, saldoInfo.saldo_disponible === 0 && { color: '#DC2626' }]}>
          S/ {parseFloat(saldoInfo.saldo_disponible || 0).toFixed(2)}
        </Text>
        <Text style={styles.saldoSub}>Total recaudado históricamente: S/ {parseFloat(saldoInfo.total_donado || 0).toFixed(2)}</Text>
      </View>

      {/* 2. DATOS DE LA BODEGA */}
      <Text style={styles.bodegaCardTitle}>🏪 Bodega Solidaria Aliada</Text>
      <Text style={styles.bodegaSub}>Los víveres se despachan a precio de convenio en:</Text>
      
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

      {/* 3. MÓDULO DE ENVÍO DIRECTO DE DONACIÓN */}
      <View style={styles.paymentBox}>
        <Text style={styles.paymentHead}>💳 Envío directo para alimentos:</Text>
        <View style={styles.yapeBanner}>
          <Text style={styles.yapeText}>Yape / Plin Oficial:</Text>
          <Text style={styles.yapeNumber}>{numeroYape}</Text>
        </View>

        <TouchableOpacity style={styles.btnToggleQR} onPress={() => setMostrarQR(!mostrarQR)}>
          <Text style={styles.btnToggleQRText}>{mostrarQR ? '▲ Ocultar Código QR' : '📲 Ver Código QR para Escanear'}</Text>
        </TouchableOpacity>

        {mostrarQR && (
          <View style={styles.qrWrapper}>
            <QRCode value={`https://yape.pe/p/${numeroYape}`} size={140} color="#74226C" backgroundColor="#FFF" />
            <Text style={styles.qrTip}>Apunta tu celular con Yape o Plin para donar</Text>
          </View>
        )}

        <TouchableOpacity style={styles.btnCopiar} onPress={copiarYape}>
          <Text style={styles.btnCopiarText}>📋 Copiar Número Yape</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btnReportar} onPress={handleAbrirDonacion}>
          <Text style={styles.btnReportarText}>✨ Ya hice mi donación (Sumar Saldo)</Text>
        </TouchableOpacity>

        <Text style={styles.bankText}>{abuelito.bodega_banco || 'Banco de la Nación'}: {abuelito.bodega_cuenta || '04-012-456789'}</Text>
      </View>

      {/* 4. BOTÓN DE VIDEO TESTIMONIO (PARPADEANTE / ACTIVO O APAGADO) */}
      {tieneVideo ? (
        <TouchableOpacity 
          style={styles.btnVideoActivo} 
          onPress={() => onOpenVideoTestimonio(abuelito.video_url)}
          activeOpacity={0.85}
        >
          <View style={styles.pulseDot} />
          <Text style={styles.btnVideoActivoText}>▶ Ver Video Testimonio (15s)</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.btnVideoInactivo}>
          <Text style={styles.btnVideoInactivoText}>📹 Video en proceso de grabación</Text>
        </View>
      )}

      {/* 5. COORDINAR LLAMADA CON AUTORIDAD */}
      <TouchableOpacity style={styles.btnVideoCall} onPress={onOpenVideoCall}>
        <Text style={styles.btnVideoCallText}>💬 Coordinar llamada con Autoridad</Text>
      </TouchableOpacity>

      {/* 6. PADRINOS Y DONANTES */}
      <View style={{ marginTop: 18 }}>
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
  bodegaCard: { backgroundColor: '#FFFDFB', padding: 20, borderRadius: 18, borderWidth: 1.5, borderColor: '#FDE68A', shadowOpacity: 0.06, shadowRadius: 12, elevation: 4 },
  saldoBox: { backgroundColor: '#F0FDF4', padding: 14, borderRadius: 12, borderWidth: 1, borderColor: '#BBF7D0', marginBottom: 16, alignItems: 'center' },
  saldoBoxUrgente: { backgroundColor: '#FEF2F2', borderColor: '#FECACA' },
  saldoLabel: { fontSize: 11, fontWeight: 'bold', color: '#166534', textTransform: 'uppercase' },
  saldoMonto: { fontSize: 26, fontWeight: '900', color: '#15803D', marginVertical: 2 },
  saldoSub: { fontSize: 11, color: '#64748B' },
  bodegaCardTitle: { fontSize: 17, fontWeight: 'bold', color: '#1A202C', marginBottom: 2 },
  bodegaSub: { fontSize: 12, color: '#718096', marginBottom: 12 },
  bodegaInfoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  bodegaLabel: { fontSize: 13, color: '#718096', fontWeight: '600' },
  bodegaValue: { fontSize: 13, color: '#2D3748', fontWeight: 'bold' },
  paymentBox: { backgroundColor: '#FFF5F5', padding: 12, borderRadius: 12, marginTop: 10, borderWidth: 1, borderColor: '#FED7D7' },
  paymentHead: { fontSize: 12, fontWeight: 'bold', color: '#C53030', marginBottom: 6 },
  yapeBanner: { backgroundColor: '#74226C', padding: 8, borderRadius: 8, alignItems: 'center', marginBottom: 8 },
  yapeText: { color: '#E9D8FD', fontSize: 11, fontWeight: 'bold' },
  yapeNumber: { color: '#FFF', fontSize: 17, fontWeight: '900' },
  btnToggleQR: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#74226C', paddingVertical: 6, borderRadius: 6, alignItems: 'center', marginBottom: 8 },
  btnToggleQRText: { color: '#74226C', fontWeight: 'bold', fontSize: 12 },
  qrWrapper: { backgroundColor: '#FFF', padding: 12, borderRadius: 10, alignItems: 'center', marginVertical: 8, borderWidth: 1, borderColor: '#E2E8F0' },
  qrTip: { fontSize: 11, color: '#64748B', marginTop: 8, fontWeight: '600' },
  btnCopiar: { backgroundColor: '#4A5568', paddingVertical: 8, borderRadius: 6, alignItems: 'center', marginBottom: 8 },
  btnCopiarText: { color: '#FFF', fontWeight: 'bold', fontSize: 12 },
  btnReportar: { backgroundColor: '#16A34A', paddingVertical: 10, borderRadius: 6, alignItems: 'center', marginBottom: 8 },
  btnReportarText: { color: '#FFF', fontWeight: '900', fontSize: 12 },
  bankText: { fontSize: 12, fontWeight: 'bold', color: '#2D3748', textAlign: 'center', marginTop: 4 },
  btnVideoActivo: { flexDirection: 'row', backgroundColor: '#E11D48', marginTop: 14, paddingVertical: 13, paddingHorizontal: 16, borderRadius: 10, alignItems: 'center', justifyContent: 'center', shadowColor: '#E11D48', shadowOpacity: 0.35, shadowRadius: 8, elevation: 4 },
  pulseDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#FFF', marginRight: 8 },
  btnVideoActivoText: { color: '#FFF', fontWeight: '900', fontSize: 13 },
  btnVideoInactivo: { backgroundColor: '#F1F5F9', marginTop: 14, paddingVertical: 10, borderRadius: 10, alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0' },
  btnVideoInactivoText: { color: '#94A3B8', fontSize: 12, fontWeight: 'bold' },
  btnVideoCall: { backgroundColor: '#0F172A', marginTop: 8, paddingVertical: 11, borderRadius: 10, alignItems: 'center' },
  btnVideoCallText: { color: '#FFF', fontWeight: 'bold', fontSize: 12 }
});
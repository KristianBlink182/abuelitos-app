import React, { useState } from 'react';
import { StyleSheet, View, Text, Modal, TextInput, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { reportarDonacion } from '../services/api';

export default function DonationReportModal({ visible, onClose, abuelito, onDonationSuccess }) {
  const [monto, setMonto] = useState('50');
  const [codigoOperacion, setCodigoOperacion] = useState('');
  const [fotoVoucher, setFotoVoucher] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!abuelito) return null;

  const pickVoucher = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled) setFotoVoucher(result.assets[0]);
  };

  const handleReportar = async () => {
    if (!monto || parseFloat(monto) <= 0) {
      alert('Por favor ingresa un monto válido.');
      return;
    }

    if (!fotoVoucher) {
      alert('⚠️ Por seguridad, debes adjuntar la captura del comprobante (Yape/Plin/Banco).');
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('abuelito_id', abuelito.id);
    formData.append('monto', monto);
    formData.append('codigo_operacion', codigoOperacion || 'YAPE');

    if (fotoVoucher.file) {
      formData.append('foto_voucher', fotoVoucher.file);
    } else {
      const uriParts = fotoVoucher.uri.split('.');
      const fileType = uriParts[uriParts.length - 1];
      formData.append('foto_voucher', {
        uri: fotoVoucher.uri,
        name: `voucher.${fileType}`,
        type: `image/${fileType}`
      });
    }

    const res = await reportarDonacion(formData);
    setLoading(false);

    if (res.success) {
      alert(`🎉 ¡Muchas gracias!\nTu comprobante de S/ ${monto}.00 ha sido enviado a verificación.\n\n🛡️ En breve nuestro equipo confirmará el depósito y se sumará al saldo en alimentos de ${abuelito.nombre_completo}.`);
      setFotoVoucher(null);
      onClose();
      onDonationSuccess();
    } else {
      alert('❌ Error al enviar el comprobante.');
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.overlay}>
        <View style={styles.content}>
          <Text style={styles.title}>📲 Adjuntar Comprobante de Donación</Text>
          <Text style={styles.sub}>
            Sube la captura de tu Yape o transferencia a la bodega de {abuelito.nombre_completo}.
          </Text>

          {/* Montos Rápidos */}
          <Text style={styles.label}>Monto Enviado (S/):</Text>
          <View style={styles.quickRow}>
            {['20', '40', '50', '80', '100'].map((val) => (
              <TouchableOpacity key={val} style={[styles.btnQuick, monto === val && styles.btnQuickActive]} onPress={() => setMonto(val)}>
                <Text style={[styles.btnQuickText, monto === val && styles.btnQuickTextActive]}>S/ {val}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TextInput style={styles.input} keyboardType="numeric" placeholder="Otro monto (S/)" value={monto} onChangeText={setMonto} />

          <Text style={styles.label}>Código de Operación (Opcional):</Text>
          <TextInput style={styles.input} placeholder="Ej: 849201" value={codigoOperacion} onChangeText={setCodigoOperacion} />

          {/* BOTÓN SUBIR VOUCHER OBLIGATORIO */}
          <Text style={styles.label}>Captura del Voucher de Yape / Plin / Banco *:</Text>
          <TouchableOpacity style={styles.btnPickVoucher} onPress={pickVoucher} activeOpacity={0.8}>
            <Text style={styles.btnPickVoucherText}>
              📷 {fotoVoucher ? '✓ Comprobante Adjuntado' : 'Subir Foto del Comprobante'}
            </Text>
          </TouchableOpacity>
          {fotoVoucher && <Image source={{ uri: fotoVoucher.uri }} style={styles.previewVoucher} />}

          <TouchableOpacity style={styles.btnConfirmar} onPress={handleReportar} disabled={loading}>
            {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.btnConfirmarText}>Enviar Comprobante para Verificación</Text>}
          </TouchableOpacity>

          <TouchableOpacity style={styles.btnCerrar} onPress={onClose}>
            <Text style={styles.btnCerrarText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.65)', justifyContent: 'center', alignItems: 'center', padding: 16 },
  content: { backgroundColor: '#FFF', borderRadius: 18, padding: 22, maxWidth: 440, width: '100%', elevation: 6 },
  title: { fontSize: 18, fontWeight: '900', color: '#1E293B', textAlign: 'center', marginBottom: 4 },
  sub: { fontSize: 12, color: '#64748B', textAlign: 'center', marginBottom: 16, lineHeight: 17 },
  label: { fontSize: 11, fontWeight: 'bold', color: '#334155', marginBottom: 4, marginTop: 8 },
  quickRow: { flexDirection: 'row', gap: 6, marginBottom: 6, justifyContent: 'center' },
  btnQuick: { flex: 1, backgroundColor: '#F1F5F9', paddingVertical: 8, borderRadius: 8, alignItems: 'center' },
  btnQuickActive: { backgroundColor: '#74226C' },
  btnQuickText: { fontWeight: 'bold', fontSize: 12, color: '#475569' },
  btnQuickTextActive: { color: '#FFF' },
  input: { borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, fontSize: 13, outlineStyle: 'none' },
  btnPickVoucher: { backgroundColor: '#FDF2F8', borderWidth: 1.5, borderColor: '#F472B6', borderStyle: 'dashed', padding: 12, borderRadius: 10, alignItems: 'center', marginVertical: 4 },
  btnPickVoucherText: { color: '#BE185D', fontWeight: 'bold', fontSize: 12 },
  previewVoucher: { width: 110, height: 110, borderRadius: 8, alignSelf: 'center', marginVertical: 6, resizeMode: 'cover' },
  btnConfirmar: { backgroundColor: '#16A34A', paddingVertical: 13, borderRadius: 10, alignItems: 'center', marginTop: 14 },
  btnConfirmarText: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },
  btnCerrar: { padding: 8, alignItems: 'center', marginTop: 4 },
  btnCerrarText: { color: '#64748B', fontWeight: '600', fontSize: 12 }
});
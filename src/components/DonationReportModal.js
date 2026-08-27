import React, { useState } from 'react';
import { StyleSheet, View, Text, Modal, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { reportarDonacion } from '../services/api';

export default function DonationReportModal({ visible, onClose, abuelito, onDonationSuccess }) {
  const [monto, setMonto] = useState('50');
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [codigoOperacion, setCodigoOperacion] = useState('');
  const [loading, setLoading] = useState(false);

  if (!abuelito) return null;

  const handleReportar = async () => {
    if (!monto || parseFloat(monto) <= 0) {
      alert('Por favor ingresa un monto válido.');
      return;
    }

    setLoading(true);
    const res = await reportarDonacion({
      abuelito_id: abuelito.id,
      donante_nombre: nombre || 'Donante Solidario',
      donante_telefono: telefono,
      monto: monto,
      codigo_operacion: codigoOperacion || 'YAPE'
    });
    setLoading(false);

    if (res.success) {
      alert(`🎉 ¡Muchas gracias!\nTu donación de S/ ${monto}.00 ha sido sumada al saldo en alimentos de ${abuelito.nombre_completo}.`);
      onClose();
      onDonationSuccess();
    } else {
      alert('❌ Error al registrar donación.');
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.overlay}>
        <View style={styles.content}>
          <Text style={styles.title}>📲 Registrar Donación Realizada</Text>
          <Text style={styles.sub}>
            Si ya enviaste tu Yape o Plin a la bodega, regístralo aquí para que se sume al **Saldo en Víveres** de {abuelito.nombre_completo}.
          </Text>

          {/* Botones de montos rápidos */}
          <Text style={styles.label}>Monto Donado (S/):</Text>
          <View style={styles.quickRow}>
            {['20', '40', '50', '80', '100'].map((val) => (
              <TouchableOpacity key={val} style={[styles.btnQuick, monto === val && styles.btnQuickActive]} onPress={() => setMonto(val)}>
                <Text style={[styles.btnQuickText, monto === val && styles.btnQuickTextActive]}>S/ {val}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TextInput style={styles.input} keyboardType="numeric" placeholder="Otro monto (S/)" value={monto} onChangeText={setMonto} />

          <Text style={styles.label}>Tu Nombre o Apodo (Opcional):</Text>
          <TextInput style={styles.input} placeholder="Ej: Carlos G." value={nombre} onChangeText={setNombre} />

          <Text style={styles.label}>Código de Operación Yape/Plin (Opcional):</Text>
          <TextInput style={styles.input} placeholder="Ej: 849201" value={codigoOperacion} onChangeText={setCodigoOperacion} />

          <TouchableOpacity style={styles.btnConfirmar} onPress={handleReportar} disabled={loading}>
            {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.btnConfirmarText}>Confirmar y Sumar Saldo</Text>}
          </TouchableOpacity>

          <TouchableOpacity style={styles.btnCerrar} onPress={onClose}>
            <Text style={styles.btnCerrarText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.65)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  content: { backgroundColor: '#FFF', borderRadius: 16, padding: 24, maxWidth: 460, width: '100%' },
  title: { fontSize: 20, fontWeight: '900', color: '#1E293B', textAlign: 'center', marginBottom: 4 },
  sub: { fontSize: 13, color: '#64748B', textAlign: 'center', marginBottom: 16, lineHeight: 18 },
  label: { fontSize: 12, fontWeight: 'bold', color: '#334155', marginBottom: 6, marginTop: 8 },
  quickRow: { flexDirection: 'row', gap: 6, marginBottom: 8, justifyContent: 'center' },
  btnQuick: { flex: 1, backgroundColor: '#F1F5F9', paddingVertical: 8, borderRadius: 8, alignItems: 'center' },
  btnQuickActive: { backgroundColor: '#74226C' },
  btnQuickText: { fontWeight: 'bold', fontSize: 13, color: '#475569' },
  btnQuickTextActive: { color: '#FFF' },
  input: { borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, fontSize: 14, outlineStyle: 'none' },
  btnConfirmar: { backgroundColor: '#74226C', paddingVertical: 14, borderRadius: 10, alignItems: 'center', marginTop: 18 },
  btnConfirmarText: { color: '#FFF', fontWeight: 'bold', fontSize: 15 },
  btnCerrar: { padding: 10, alignItems: 'center', marginTop: 4 },
  btnCerrarText: { color: '#64748B', fontWeight: '600' }
});
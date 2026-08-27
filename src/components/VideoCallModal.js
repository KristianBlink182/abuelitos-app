import React from 'react';
import { StyleSheet, View, Text, Modal, TouchableOpacity, Linking } from 'react-native';

export default function VideoCallModal({ visible, onClose, abuelito }) {
  if (!abuelito) return null;

  const handleWhatsAppCall = () => {
    const telefono = abuelito.autoridad_telefono || abuelito.bodega_yape;
    const mensaje = encodeURIComponent(`Hola, soy donante de RedSolidaria. Quisiera solicitar una breve videollamada para corroborar y saludar a ${abuelito.nombre_completo} en ${abuelito.caserio}.`);
    const url = `https://wa.me/51${telefono}?text=${mensaje}`;
    if (typeof window !== 'undefined') {
      window.open(url, '_blank');
    } else {
      Linking.openURL(url);
    }
  };

  return (
    <Modal visible={visible} animationType="fade" transparent={true}>
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>📹 Videollamada de Corroboración</Text>
          <Text style={styles.modalText}>
            Para garantizar transparencia total, puedes coordinar una videollamada directa por WhatsApp con la **Autoridad Comunal ({abuelito.autoridad_nombre})** o la **Bodega Aliada**.
          </Text>
          
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>¿Cómo funciona?</Text>
            <Text style={styles.infoStep}>1. Se contacta a la autoridad comunal por WhatsApp.</Text>
            <Text style={styles.infoStep}>2. La autoridad o bodeguero visita a {abuelito.nombre_completo} para conectarte en vivo.</Text>
            <Text style={styles.infoStep}>3. Puedes corroborar su situación real y dejarle un mensaje de ánimo.</Text>
          </View>

          <TouchableOpacity style={styles.btnWhatsapp} onPress={handleWhatsAppCall}>
            <Text style={styles.btnWhatsappText}>💬 Iniciar Coordinación por WhatsApp</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.btnClose} onPress={onClose}>
            <Text style={styles.btnCloseText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.65)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { backgroundColor: '#FFF', borderRadius: 16, padding: 24, maxWidth: 500, width: '100%' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#1A202C', marginBottom: 10, textAlign: 'center' },
  modalText: { fontSize: 14, color: '#4A5568', lineHeight: 20, marginBottom: 16, textAlign: 'center' },
  infoBox: { backgroundColor: '#F7FAFC', padding: 14, borderRadius: 10, marginBottom: 20, borderWidth: 1, borderColor: '#EDF2F7' },
  infoTitle: { fontWeight: 'bold', color: '#2D3748', marginBottom: 6 },
  infoStep: { fontSize: 13, color: '#4A5568', marginVertical: 2 },
  btnWhatsapp: { backgroundColor: '#25D366', padding: 14, borderRadius: 10, alignItems: 'center', marginBottom: 10 },
  btnWhatsappText: { color: '#FFF', fontWeight: 'bold', fontSize: 15 },
  btnClose: { padding: 10, alignItems: 'center' },
  btnCloseText: { color: '#718096', fontWeight: '600' }
});
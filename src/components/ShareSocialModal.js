import React, { useState } from 'react';
import { StyleSheet, View, Text, Modal, TouchableOpacity, Linking, Platform } from 'react-native';

export default function ShareSocialModal({ visible, onClose, abuelito }) {
  const [copiado, setCopiado] = useState(false);
  if (!visible || !abuelito) return null;

  const urlActual = typeof window !== 'undefined' ? window.location.href : 'https://abuelitos.pe';
  const textoMensaje = `🇵🇪 Ayudemos a ${abuelito.nombre_completo} (${abuelito.edad} años) en ${abuelito.caserio}, ${abuelito.provincia}. Conoce su historia y cómo apoyarlo aquí:`;

  const compartirWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(`${textoMensaje} ${urlActual}`)}`;
    if (typeof window !== 'undefined') window.open(url, '_blank');
    else Linking.openURL(url);
  };

  const compartirFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(urlActual)}`;
    if (typeof window !== 'undefined') window.open(url, '_blank');
    else Linking.openURL(url);
  };

  const compartirTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(textoMensaje)}&url=${encodeURIComponent(urlActual)}`;
    if (typeof window !== 'undefined') window.open(url, '_blank');
    else Linking.openURL(url);
  };

  const copiarEnlace = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(urlActual);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    }
  };

  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>📢 Compartir Caso Social</Text>
          <Text style={styles.sub}>Ayuda a viralizar la historia de {abuelito.nombre_completo} para conseguirle padrinos:</Text>

          <View style={styles.gridBtns}>
            {/* WhatsApp */}
            <TouchableOpacity style={[styles.btnSocial, { backgroundColor: '#25D366' }]} onPress={compartirWhatsApp}>
              <Text style={styles.btnSocialText}>💬 WhatsApp</Text>
            </TouchableOpacity>

            {/* Facebook */}
            <TouchableOpacity style={[styles.btnSocial, { backgroundColor: '#1877F2' }]} onPress={compartirFacebook}>
              <Text style={styles.btnSocialText}>📘 Facebook</Text>
            </TouchableOpacity>

            {/* Twitter / X */}
            <TouchableOpacity style={[styles.btnSocial, { backgroundColor: '#0F172A' }]} onPress={compartirTwitter}>
              <Text style={styles.btnSocialText}>✖️ Compartir en X</Text>
            </TouchableOpacity>

            {/* Copiar Enlace */}
            <TouchableOpacity style={[styles.btnSocial, { backgroundColor: '#475569' }]} onPress={copiarEnlace}>
              <Text style={styles.btnSocialText}>{copiado ? '✓ ¡Enlace Copiado!' : '🔗 Copiar Enlace'}</Text>
            </TouchableOpacity>
          </View>

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
  card: { backgroundColor: '#FFF', borderRadius: 18, padding: 24, maxWidth: 420, width: '100%', elevation: 5 },
  title: { fontSize: 20, fontWeight: '900', color: '#1E293B', textAlign: 'center', marginBottom: 4 },
  sub: { fontSize: 13, color: '#64748B', textAlign: 'center', marginBottom: 20, lineHeight: 18 },
  gridBtns: { gap: 10 },
  btnSocial: { paddingVertical: 12, paddingHorizontal: 16, borderRadius: 10, alignItems: 'center', cursor: 'pointer' },
  btnSocialText: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },
  btnClose: { padding: 12, alignItems: 'center', marginTop: 8 },
  btnCloseText: { color: '#64748B', fontWeight: '600', fontSize: 13 }
});
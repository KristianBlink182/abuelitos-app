import React from 'react';
import { StyleSheet, View, Text, Modal, TouchableOpacity, Linking, Platform } from 'react-native';

export default function VideoPlayerModal({ visible, videoUrl, abuelitoNombre, onClose }) {
  if (!visible || !videoUrl) return null;

  // En iPhone abre directamente el reproductor de video nativo del sistema
  if (Platform.OS !== 'web') {
    Linking.openURL(videoUrl);
    onClose();
    return null;
  }

  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View style={styles.modalBg}>
        <TouchableOpacity style={styles.btnClose} onPress={onClose} activeOpacity={0.8}>
          <Text style={styles.btnCloseText}>✕ Cerrar Video</Text>
        </TouchableOpacity>

        <View style={styles.videoCard}>
          <View style={styles.videoHeader}>
            <Text style={styles.badgeLive}>🔴 TESTIMONIO</Text>
            <Text style={styles.videoTitle}>Palabras de {abuelitoNombre}</Text>
          </View>

          <video 
            src={videoUrl} 
            controls 
            autoPlay 
            playsInline
            style={{
              width: '100%',
              maxHeight: '65vh',
              borderRadius: 12,
              backgroundColor: '#000',
              outline: 'none'
            }}
          />

          <Text style={styles.videoFooter}>
            * Video grabado por la Autoridad Comunal para corroboración de identidad.
          </Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    zIndex: 99999,
  },
  btnClose: {
    position: 'absolute',
    top: 25,
    right: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    zIndex: 10,
  },
  btnCloseText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 13,
  },
  videoCard: {
    maxWidth: 600,
    width: '100%',
    backgroundColor: '#0F172A',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  videoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  badgeLive: {
    backgroundColor: '#EF4444',
    color: '#FFF',
    fontSize: 10,
    fontWeight: '900',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  videoTitle: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  videoFooter: {
    color: '#94A3B8',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 10,
    fontStyle: 'italic',
  },
});
import React from 'react';
import { StyleSheet, View, Text, Image, Modal, TouchableOpacity } from 'react-native';

export default function ImageViewerModal({ visible, imageUri, onClose }) {
  if (!visible || !imageUri) return null;

  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View style={styles.modalBg}>
        <TouchableOpacity style={styles.btnClose} onPress={onClose} activeOpacity={0.8}>
          <Text style={styles.btnCloseText}>✕ Cerrar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.imageWrapper} activeOpacity={1} onPress={onClose}>
          <Image source={{ uri: imageUri }} style={styles.fullImage} />
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.92)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    zIndex: 99999,
  },
  btnClose: {
    position: 'absolute',
    top: 25,
    right: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    zIndex: 10,
  },
  btnCloseText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  imageWrapper: {
    width: '100%',
    height: '85%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    borderRadius: 12,
  },
});
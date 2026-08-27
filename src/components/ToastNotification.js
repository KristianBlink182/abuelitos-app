import React from 'react';
import { StyleSheet, View, Text, Animated } from 'react-native';

export default function ToastNotification({ mensaje, tipo = 'success', visible }) {
  if (!visible) return null;

  const esExito = tipo === 'success';

  return (
    <View style={[styles.toastContainer, esExito ? styles.bgSuccess : styles.bgError]}>
      <Text style={styles.toastIcon}>{esExito ? '✓' : '⚠️'}</Text>
      <Text style={styles.toastText}>{mensaje}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    top: 20,
    alignSelf: 'center',
    zIndex: 9999,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
    maxWidth: '90%',
  },
  bgSuccess: {
    backgroundColor: '#16A34A',
  },
  bgError: {
    backgroundColor: '#DC2626',
  },
  toastIcon: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 8,
  },
  toastText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 13,
  },
});
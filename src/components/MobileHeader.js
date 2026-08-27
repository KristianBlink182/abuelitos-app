import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, Platform, StatusBar, Linking } from 'react-native';

export default function MobileHeader({ onGoHome }) {
  const compartirApp = () => {
    const url = 'https://wa.me/?text=' + encodeURIComponent('🇵🇪 Conoce abuelitos.pe y apadrina a un adulto mayor en extrema necesidad en el Perú profundo.');
    Linking.openURL(url);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onGoHome} activeOpacity={0.8}>
          <Text style={styles.logoText}>🇵🇪 abuelitos<Text style={{ color: '#FF385C' }}>.pe</Text></Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btnShare} onPress={compartirApp} activeOpacity={0.8}>
          <Text style={styles.btnShareText}>📲 Compartir App</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  logoText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
  },
  btnShare: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  btnShareText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#334155',
  },
});
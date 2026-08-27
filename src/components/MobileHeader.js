import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, Platform, StatusBar } from 'react-native';

export default function MobileHeader({ onGoHome, onGoAdmin }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onGoHome} activeOpacity={0.8}>
          <Text style={styles.logoText}>🇵🇪 abuelitos<Text style={{ color: '#FF385C' }}>.pe</Text></Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btnAdmin} onPress={onGoAdmin}>
          <Text style={styles.btnAdminText}>🔐 Admin</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#FFF',
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
    color: '#1E293B',
  },
  btnAdmin: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  btnAdminText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#475569',
  },
});
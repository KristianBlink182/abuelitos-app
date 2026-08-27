import React from 'react';
import { StyleSheet, View, Image, SafeAreaView, Platform, StatusBar } from 'react-native';

export default function MobileHeader() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        {/* LOGO OFICIAL 100% CENTRADO */}
        <Image 
          source={require('../../assets/logo.png')} 
          style={styles.logoMobile} 
        />
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  logoMobile: {
    width: 160,
    height: 44,
    resizeMode: 'contain',
  },
});
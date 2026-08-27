import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Animated, Image, Platform } from 'react-native';

export default function AnimatedSplash({ onFinish }) {
  const escalaLogo = useRef(new Animated.Value(0.85)).current;
  const opacidadFondo = useRef(new Animated.Value(1)).current;
  const opacidadTexto = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(escalaLogo, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
      Animated.timing(opacidadTexto, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      })
    ]).start();

    const timer = setTimeout(() => {
      Animated.timing(opacidadFondo, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        onFinish();
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Animated.View style={[styles.splashContainer, { opacity: opacidadFondo }]}>
      <View style={styles.glowCircleRed} />

      <View style={styles.centerContent}>
        {/* LOGO OFICIAL PALPITANTE */}
        <Animated.View style={{ transform: [{ scale: escalaLogo }] }}>
          <Image 
            source={require('../../assets/logo.png')} 
            style={styles.logoOficial} 
          />
        </Animated.View>

        {/* LEMA Y CARGA */}
        <Animated.View style={[styles.textWrapper, { opacity: opacidadTexto }]}>
          <Text style={styles.slogan}>Conectando corazones en el Perú profundo</Text>
          <Text style={styles.subSlogan}>Ayuda directa, transparente y sin intermediarios</Text>

          <View style={styles.loadingTrack}>
            <View style={styles.loadingBar} />
          </View>
        </Animated.View>
      </View>

      <View style={styles.footerSplash}>
        <Text style={styles.footerText}>© 2026 abuelitos.pe — Versión Oficial Móvil</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#090D16',
    zIndex: 999999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  glowCircleRed: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: 'rgba(255, 56, 92, 0.15)',
  },
  centerContent: {
    alignItems: 'center',
    zIndex: 2,
  },
  logoOficial: {
    width: 250,
    height: 90,
    resizeMode: 'contain',
  },
  textWrapper: {
    alignItems: 'center',
    marginTop: 20,
  },
  slogan: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  subSlogan: {
    color: '#94A3B8',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 25,
  },
  loadingTrack: {
    width: 140,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  loadingBar: {
    width: '100%',
    height: '100%',
    backgroundColor: '#FF385C',
    borderRadius: 2,
  },
  footerSplash: {
    position: 'absolute',
    bottom: 30,
    alignItems: 'center',
  },
  footerText: {
    color: '#475569',
    fontSize: 11,
    fontWeight: '600',
  },
});
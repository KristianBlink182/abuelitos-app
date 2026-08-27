import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';

export default function Navbar({ onNavigate, usuarioSesion, onOpenAuth }) {
  const getEtiquetaSesion = () => {
    if (!usuarioSesion) return '';
    if (usuarioSesion.tipo === 'admin') return '🔐 Admin';
    if (usuarioSesion.tipo === 'bodega') return '🏪 Bodega';
    return `👤 ${(usuarioSesion.nombre || 'Donante').split(' ')[0]}`;
  };

  const handleClicSesion = () => {
    if (!usuarioSesion) {
      onOpenAuth();
      return;
    }
    if (usuarioSesion.tipo === 'admin') onNavigate('admin');
    else if (usuarioSesion.tipo === 'bodega') onNavigate('bodega_portal');
    else onNavigate('account');
  };

  return (
    <View style={styles.navbar}>
      
      {/* 1. LOGO OFICIAL */}
      <TouchableOpacity 
        onPress={() => onNavigate('home')} 
        style={styles.navBrand}
        activeOpacity={0.85}
      >
        <Image 
          source={require('../../assets/logo.png')} 
          style={styles.logoWeb} 
        />
      </TouchableOpacity>

      {/* 2. MENÚ CENTRAL */}
      <View style={styles.centerMenu}>
        <TouchableOpacity style={styles.centerLink} onPress={() => onNavigate('home')}>
          <Text style={styles.centerLinkText}>Inicio</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.centerLink} onPress={() => onNavigate('about')}>
          <Text style={styles.centerLinkText}>Quiénes Somos</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.centerLink} onPress={() => onNavigate('directory_search')}>
          <Text style={styles.centerLinkText}>Ver Todos los Abuelitos</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.centerLink} onPress={() => onNavigate('contacto')}>
          <Text style={styles.centerLinkText}>Contacto</Text>
        </TouchableOpacity>
      </View>

      {/* 3. BOTONES DE ACCESO Y POSTULACIÓN */}
      <View style={styles.rightActions}>
        {usuarioSesion ? (
          <TouchableOpacity 
            onPress={handleClicSesion} 
            style={styles.btnSesionActiva}
            activeOpacity={0.85}
          >
            <Text style={styles.btnSesionActivaText}>{getEtiquetaSesion()}</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            onPress={onOpenAuth} 
            style={styles.btnIngresarRegistrarse} 
            activeOpacity={0.85}
          >
            <Text style={styles.btnIngresarText}>👤 Ingresar / Registrarse</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity 
          style={styles.btnNavPost} 
          onPress={() => onNavigate('register')} 
          activeOpacity={0.85}
        >
          <Text style={styles.btnNavPostText}>+ Postular Caso</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 28,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
    zIndex: 100,
  },
  navBrand: {
    cursor: 'pointer',
  },
  logoWeb: {
    width: 170,
    height: 48,
    resizeMode: 'contain',
  },
  centerMenu: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 26,
  },
  centerLink: {
    paddingVertical: 6,
    cursor: 'pointer',
  },
  centerLinkText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  btnIngresarRegistrarse: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 20,
    cursor: 'pointer',
  },
  btnIngresarText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 13,
  },
  btnSesionActiva: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    cursor: 'pointer',
    borderWidth: 1,
    borderColor: '#FECDD3',
  },
  btnSesionActivaText: {
    color: '#991B1B',
    fontWeight: 'bold',
    fontSize: 13,
  },
  btnNavPost: {
    backgroundColor: '#FF385C',
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 20,
    cursor: 'pointer',
  },
  btnNavPostText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 13,
  },
});
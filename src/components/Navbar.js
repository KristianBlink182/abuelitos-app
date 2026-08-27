import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

export default function Navbar({ onNavigate, usuarioSesion, onOpenAuth }) {
  return (
    <View style={styles.navbar}>
      {/* 1. LOGO ABUELITOS.PE */}
      <TouchableOpacity onPress={() => onNavigate('home')} style={styles.navBrand}>
        <Text style={styles.navLogoText}>🇵🇪 abuelitos<Text style={{ color: '#FF385C' }}>.pe</Text></Text>
      </TouchableOpacity>

      {/* 2. MENÚ CENTRAL ORDENADO Y BONITO */}
      <View style={styles.centerMenu}>
        <TouchableOpacity style={styles.centerLink} onPress={() => onNavigate('home')}>
          <Text style={styles.centerLinkText}>Inicio</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.centerLink} onPress={() => onNavigate('directory_search')}>
          <Text style={styles.centerLinkText}>Ver Todos los Abuelitos</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.centerLink} onPress={() => onNavigate('contacto')}>
          <Text style={styles.centerLinkText}>Contacto</Text>
        </TouchableOpacity>
      </View>

      {/* 3. BOTÓN INGRESAR / REGISTRARSE Y POSTULAR */}
      <View style={styles.rightActions}>
        {usuarioSesion ? (
          <TouchableOpacity 
            onPress={() => onNavigate(usuarioSesion.tipo === 'bodega' ? 'bodega_portal' : (usuarioSesion.tipo === 'admin' ? 'admin' : 'donor_profile'))} 
            style={styles.btnSesionActiva}
          >
            <Text style={styles.btnSesionActivaText}>
              {usuarioSesion.tipo === 'bodega' ? '🏪 ' : (usuarioSesion.tipo === 'admin' ? '🔐 ' : '👤 ')}
              {usuarioSesion.nombre.split(' ')[0]}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={onOpenAuth} style={styles.btnIngresarRegistrarse} activeOpacity={0.85}>
            <Text style={styles.btnIngresarText}>👤 Ingresar / Registrarse</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.btnNavPost} onPress={() => onNavigate('register')} activeOpacity={0.85}>
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
    paddingVertical: 14,
    paddingHorizontal: 28,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
    zIndex: 100,
  },
  navBrand: {
    cursor: 'pointer',
  },
  navLogoText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
  },
  centerMenu: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 28,
  },
  centerLink: {
    paddingVertical: 6,
    cursor: 'pointer',
  },
  centerLinkText: {
    fontSize: 14,
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
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
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
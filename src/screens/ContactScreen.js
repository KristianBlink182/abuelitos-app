import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Linking } from 'react-native';

export default function ContactScreen({ onGoHome }) {
  const abrirWhatsApp = () => {
    Linking.openURL('https://wa.me/51984123456?text=Hola%20abuelitos.pe%2C%20quisiera%20m%C3%A1s%20informaci%C3%B3n%20para%20apoyar.');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.wrapper}>
        <TouchableOpacity style={styles.btnVolver} onPress={onGoHome}>
          <Text style={styles.btnVolverText}>← Volver al Inicio</Text>
        </TouchableOpacity>

        <Text style={styles.title}>📞 Contáctanos y Únete a la Causa</Text>
        <Text style={styles.sub}>Estamos conectando caseríos de todo el Perú con personas de buen corazón.</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Canales Oficiales de Coordinación:</Text>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>📱</Text>
            <View>
              <Text style={styles.infoLabel}>WhatsApp Oficial:</Text>
              <Text style={styles.infoValue}>+51 984 123 456</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>✉️</Text>
            <View>
              <Text style={styles.infoLabel}>Correo Electrónico:</Text>
              <Text style={styles.infoValue}>contacto@abuelitos.pe</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>🇵🇪</Text>
            <View>
              <Text style={styles.infoLabel}>Cobertura:</Text>
              <Text style={styles.infoValue}>Caseríos y comunidades rurales en todo el Perú.</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.btnWs} onPress={abrirWhatsApp}>
            <Text style={styles.btnWsText}>💬 Escribir al WhatsApp Oficial</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC', padding: 20 },
  wrapper: { maxWidth: 700, alignSelf: 'center', width: '100%', marginVertical: 15 },
  btnVolver: { alignSelf: 'flex-start', marginBottom: 16, paddingVertical: 8, paddingHorizontal: 14, backgroundColor: '#E2E8F0', borderRadius: 8 },
  btnVolverText: { fontWeight: 'bold', color: '#4A5568' },
  title: { fontSize: 26, fontWeight: '900', color: '#0F172A', marginBottom: 4 },
  sub: { fontSize: 13, color: '#64748B', marginBottom: 20 },
  card: { backgroundColor: '#FFF', padding: 24, borderRadius: 16, borderWidth: 1, borderColor: '#E2E8F0' },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#1E293B', marginBottom: 16 },
  infoRow: { flexDirection: 'row', gap: 14, alignItems: 'center', marginBottom: 16 },
  infoIcon: { fontSize: 24 },
  infoLabel: { fontSize: 11, color: '#64748B', fontWeight: 'bold', textTransform: 'uppercase' },
  infoValue: { fontSize: 14, color: '#1E293B', fontWeight: 'bold' },
  btnWs: { backgroundColor: '#25D366', paddingVertical: 14, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  btnWsText: { color: '#FFF', fontWeight: 'bold', fontSize: 14 }
});
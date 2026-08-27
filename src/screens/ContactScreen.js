import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Platform } from 'react-native';

export default function ContactScreen({ onGoHome }) {
  const [copiado, setCopiado] = useState(false);
  const emailOficial = 'contacto@abuelitos.pe';

  const copiarEmail = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(emailOficial);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2500);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.topHeroBanner}>
        <View style={styles.topHeroContent}>
          <Text style={styles.topHeroTag}>CANAL INSTITUCIONAL</Text>
          <Text style={styles.topHeroTitle}>Contacto y Coordinación</Text>
          <Text style={styles.topHeroSub}>
            Ponte en contacto con nuestro equipo para alianzas, voluntariado o consultas generales.
          </Text>
        </View>
      </View>

      <View style={styles.contentSection}>
        <View style={styles.wrapper}>
          <View style={styles.contactCard}>
            <Text style={styles.contactIcon}>✉️</Text>
            <Text style={styles.contactTitle}>Correo Oficial de Atención</Text>
            <Text style={styles.contactText}>
              Para coordinar apoyo institucional, donaciones de empresas o reportar un caso en tu comunidad:
            </Text>

            <TouchableOpacity style={styles.btnEmail} onPress={copiarEmail} activeOpacity={0.85}>
              <Text style={styles.emailText}>{emailOficial}</Text>
              <Text style={styles.copyTip}>{copiado ? '✓ ¡Copiado!' : '📋 Toca para copiar'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  topHeroBanner: {
    backgroundColor: '#0F172A',
    backgroundImage: Platform.OS === 'web' 
      ? 'linear-gradient(135deg, #0B0F19 0%, #1E293B 100%)' 
      : undefined,
    paddingVertical: 45,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderColor: '#334155',
  },
  topHeroContent: { maxWidth: 900, width: '100%', alignSelf: 'center' },
  topHeroTag: { color: '#FF385C', fontSize: 11, fontWeight: '900', letterSpacing: 1.5, marginBottom: 6 },
  topHeroTitle: { fontSize: 32, fontWeight: '900', color: '#FFFFFF', marginBottom: 6 },
  topHeroSub: { fontSize: 14, color: '#94A3B8', maxWidth: 720, lineHeight: 22 },
  contentSection: { paddingVertical: 45, paddingHorizontal: 16, alignItems: 'center' },
  wrapper: { maxWidth: 650, width: '100%' },
  contactCard: { backgroundColor: '#FFF', padding: 35, borderRadius: 20, borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center', shadowOpacity: 0.04, shadowRadius: 10, elevation: 3 },
  contactIcon: { fontSize: 40, marginBottom: 10 },
  contactTitle: { fontSize: 20, fontWeight: '900', color: '#0F172A', marginBottom: 6 },
  contactText: { fontSize: 13, color: '#64748B', textAlign: 'center', marginBottom: 20, lineHeight: 20 },
  btnEmail: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#0F172A', paddingVertical: 14, paddingHorizontal: 24, borderRadius: 30, gap: 12, cursor: 'pointer' },
  emailText: { color: '#FFF', fontSize: 16, fontWeight: '900' },
  copyTip: { color: '#94A3B8', fontSize: 11, fontWeight: 'bold' }
});
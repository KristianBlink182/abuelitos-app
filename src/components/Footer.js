import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

export default function Footer({ onNavigate }) {
  return (
    <View style={styles.footer}>
      <View style={styles.footerContainer}>
        <View style={styles.col}>
          <Text style={styles.logoText}>🇵🇪 abuelitos<Text style={{ color: '#FF385C' }}>.pe</Text></Text>
          <Text style={styles.colText}>
            Plataforma comunitaria de apadrinamiento directo y transparente para adultos mayores en extrema vulnerabilidad en el Perú profundo.
          </Text>
        </View>

        <View style={styles.col}>
          <Text style={styles.colTitle}>Navegación</Text>
          <TouchableOpacity onPress={() => onNavigate('home')}><Text style={styles.linkText}>• Inicio / Directorio</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => onNavigate('caserios')}><Text style={styles.linkText}>• Caseríos Beneficiados</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => onNavigate('autoridades')}><Text style={styles.linkText}>• Red de Autoridades</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => onNavigate('bodega_portal')}><Text style={styles.linkText}>• Portal de Bodegas</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => onNavigate('register')}><Text style={styles.linkText}>• Postular un Caso</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => onNavigate('faq')}><Text style={styles.linkText}>• Preguntas Frecuentes (FAQ)</Text></TouchableOpacity>
        </View>

        <View style={styles.col}>
          <Text style={styles.colTitle}>Garantía Solidaria</Text>
          <Text style={styles.colText}>
            ✓ 100% de la donación llega a la bodega comunal.{'\n'}
            ✓ Validado por Tenientes Gobernadores.{'\n'}
            ✓ Constancias con foto de entrega.
          </Text>
        </View>
      </View>

      <View style={styles.copyRow}>
        <Text style={styles.copyText}>© 2026 abuelitos.pe — Hecho con ❤️ para nuestros adultos mayores en el Perú.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: { backgroundColor: '#0F172A', paddingTop: 50, paddingBottom: 25, paddingHorizontal: 20, borderTopWidth: 1, borderColor: '#1E293B', marginTop: 40 },
  footerContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 30, maxWidth: 1100, width: '100%', alignSelf: 'center' },
  col: { flex: 1, minWidth: 240 },
  logoText: { fontSize: 22, fontWeight: '900', color: '#FFF', marginBottom: 12 },
  colTitle: { fontSize: 15, fontWeight: 'bold', color: '#F1F5F9', marginBottom: 12 },
  colText: { fontSize: 13, color: '#94A3B8', lineHeight: 20 },
  linkText: { fontSize: 13, color: '#CBD5E1', marginBottom: 8 },
  copyRow: { borderTopWidth: 1, borderColor: '#1E293B', marginTop: 40, paddingTop: 20, alignItems: 'center' },
  copyText: { color: '#64748B', fontSize: 12 }
});
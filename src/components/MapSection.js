import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Linking } from 'react-native';

export default function MapSection({ distrito, provincia, departamento, caserio }) {
  // Enfoca el Distrito y Provincia para que Google Maps muestre carreteras y rutas reales
  const queryMaps = encodeURIComponent(`${distrito || ''}, ${provincia || ''}, ${departamento || ''}, Peru`);
  const urlGoogleMapsDirecto = `https://www.google.com/maps/search/?api=1&query=${queryMaps}`;

  return (
    <View style={styles.boxCard}>
      <View style={styles.headRow}>
        <View>
          <Text style={styles.boxTitle}>🗺️ Cómo Llegar y Ubicación de Referencia</Text>
          <Text style={styles.mapSubtitle}>Ruta hacia el distrito de acceso más cercano al caserío:</Text>
        </View>
        <TouchableOpacity style={styles.btnAbrirMaps} onPress={() => Linking.openURL(urlGoogleMapsDirecto)}>
          <Text style={styles.btnAbrirMapsText}>📍 Abrir en Google Maps ↗</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.mapContainer}>
        {typeof window !== 'undefined' ? (
          <iframe
            title="Mapa de Acceso"
            width="100%"
            height="240"
            frameBorder="0"
            scrolling="no"
            src={`https://maps.google.com/maps?q=${queryMaps}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
            style={{ borderRadius: 10, border: 'none' }}
          />
        ) : (
          <Text style={{ textAlign: 'center', padding: 20 }}>📍 {distrito} - {provincia} ({departamento})</Text>
        )}
      </View>

      <View style={styles.locBadge}>
        <Text style={styles.locNote}>
          🏡 <Text style={{ fontWeight: 'bold', color: '#0F172A' }}>Ubicación exacta:</Text> {caserio}.
        </Text>
        <Text style={styles.locSubNote}>
          🚗 <Text style={{ fontWeight: 'bold', color: '#0F172A' }}>Ruta de acceso:</Text> Llegar a la Plaza de {distrito} ({provincia}) y tomar movilidad rural hacia el {caserio}.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  boxCard: { backgroundColor: '#FFF', padding: 22, borderRadius: 16, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 20 },
  headRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, flexWrap: 'wrap', gap: 8 },
  boxTitle: { fontSize: 17, fontWeight: 'bold', color: '#2D3748' },
  mapSubtitle: { fontSize: 13, color: '#64748B', marginTop: 2 },
  btnAbrirMaps: { backgroundColor: '#2563EB', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  btnAbrirMapsText: { color: '#FFF', fontWeight: 'bold', fontSize: 11 },
  mapContainer: { width: '100%', borderRadius: 10, overflow: 'hidden', backgroundColor: '#EDF2F7' },
  locBadge: { backgroundColor: '#F8FAFC', padding: 14, borderRadius: 10, marginTop: 12, borderWidth: 1, borderColor: '#E2E8F0', gap: 6 },
  locNote: { fontSize: 13, color: '#334155' },
  locSubNote: { fontSize: 12, color: '#64748B' }
});
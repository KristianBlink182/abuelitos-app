import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Linking, Platform } from 'react-native';

export default function MapSection({ distrito, provincia, departamento, caserio }) {
  const queryMaps = encodeURIComponent(`${distrito || ''}, ${provincia || ''}, ${departamento || ''}, Peru`);
  const urlGoogleMapsDirecto = `https://www.google.com/maps/search/?api=1&query=${queryMaps}`;

  return (
    <View style={styles.boxCard}>
      {/* CABECERA COMPACTA QUE NO SE DESBORDA */}
      <View style={styles.headRow}>
        <View style={{ flex: 1, marginRight: 8 }}>
          <Text style={styles.boxTitle}>Ubicación y Cómo Llegar</Text>
          <Text style={styles.mapSubtitle} numberOfLines={1}>Ruta de acceso hacia el caserío:</Text>
        </View>
        <TouchableOpacity style={styles.btnAbrirMaps} onPress={() => Linking.openURL(urlGoogleMapsDirecto)} activeOpacity={0.85}>
          <Text style={styles.btnAbrirMapsText}>Abrir Maps ↗</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.mapContainer}>
        {Platform.OS === 'web' && typeof document !== 'undefined' ? (
          <iframe
            title="Mapa de Acceso"
            width="100%"
            height="210"
            frameBorder="0"
            scrolling="no"
            src={`https://maps.google.com/maps?q=${queryMaps}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
            style={{ borderRadius: 10, border: 'none' }}
          />
        ) : (
          <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 20 }}>
            <Text style={{ fontSize: 13, color: '#475569', marginBottom: 12, textAlign: 'center' }}>
              📍 {distrito} - {provincia} ({departamento})
            </Text>
            <TouchableOpacity 
              style={{ backgroundColor: '#0F172A', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8 }}
              onPress={() => Linking.openURL(urlGoogleMapsDirecto)}
            >
              <Text style={{ color: '#FFFFFF', fontWeight: 'bold', fontSize: 12 }}>
                🗺️ Ver Ruta en Google Maps
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.locBadge}>
        <Text style={styles.locNote}>
          <Text style={{ fontWeight: 'bold', color: '#0F172A' }}>Caserío: </Text>{caserio}.
        </Text>
        <Text style={styles.locSubNote}>
          <Text style={{ fontWeight: 'bold', color: '#0F172A' }}>Acceso: </Text>Llegar a la Plaza de {distrito} y tomar movilidad rural al {caserio}.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  boxCard: { backgroundColor: '#FFF', padding: 18, borderRadius: 16, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 16 },
  headRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  boxTitle: { fontSize: 15, fontWeight: 'bold', color: '#1E293B' },
  mapSubtitle: { fontSize: 11, color: '#64748B', marginTop: 1 },
  btnAbrirMaps: { backgroundColor: '#2563EB', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6 },
  btnAbrirMapsText: { color: '#FFF', fontWeight: 'bold', fontSize: 10 },
  mapContainer: { width: '100%', borderRadius: 10, overflow: 'hidden', backgroundColor: '#EDF2F7' },
  locBadge: { backgroundColor: '#F8FAFC', padding: 12, borderRadius: 8, marginTop: 10, borderWidth: 1, borderColor: '#E2E8F0', gap: 4 },
  locNote: { fontSize: 12, color: '#334155' },
  locSubNote: { fontSize: 11, color: '#64748B' }
});
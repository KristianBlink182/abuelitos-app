import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Linking, Platform } from 'react-native';

export default function MapSection({ distrito, provincia, departamento, caserio }) {
  const queryMaps = encodeURIComponent(`${distrito || ''}, ${provincia || ''}, ${departamento || ''}, Peru`);
  const urlGoogleMapsDirecto = `https://www.google.com/maps/search/?api=1&query=${queryMaps}`;

  return (
    <View style={styles.boxCard}>
      <View style={styles.headRow}>
        <View style={{ flex: 1, marginRight: 8 }}>
          <Text style={styles.boxTitle}>🗺️ Ubicación y Cómo Llegar</Text>
          <Text style={styles.mapSubtitle} numberOfLines={1}>Ruta hacia el caserío:</Text>
        </View>
        <TouchableOpacity style={styles.btnAbrirMaps} onPress={() => Linking.openURL(urlGoogleMapsDirecto)} activeOpacity={0.85}>
          <Text style={styles.btnAbrirMapsText}>📍 Abrir Mapa ↗</Text>
        </TouchableOpacity>
      </View>

      {/* EN WEB: MUESTRA IFRAME | EN IPHONE: MUESTRA TARJETA NATIVA SIN CRASHEAR */}
      {Platform.OS === 'web' ? (
        <View style={styles.mapContainer}>
          <iframe
            title="Mapa de Acceso"
            width="100%"
            height="210"
            frameBorder="0"
            scrolling="no"
            src={`https://maps.google.com/maps?q=${queryMaps}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
            style={{ borderRadius: 10, border: 'none' }}
          />
        </View>
      ) : (
        <TouchableOpacity style={styles.mapCardNative} onPress={() => Linking.openURL(urlGoogleMapsDirecto)} activeOpacity={0.85}>
          <Text style={styles.mapPinBig}>📍</Text>
          <Text style={styles.mapNativeTitle}>Ver Ruta en el Mapa</Text>
          <Text style={styles.mapNativeSub}>Toca aquí para abrir en Apple Maps o Google Maps</Text>
        </TouchableOpacity>
      )}

      <View style={styles.locBadge}>
        <Text style={styles.locNote}>
          🏡 <Text style={{ fontWeight: 'bold', color: '#0F172A' }}>Caserío:</Text> {caserio}.
        </Text>
        <Text style={styles.locSubNote}>
          🚗 <Text style={{ fontWeight: 'bold', color: '#0F172A' }}>Acceso:</Text> Llegar a la Plaza de {distrito} y tomar movilidad rural al {caserio}.
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
  mapCardNative: { backgroundColor: '#F1F5F9', borderRadius: 12, padding: 22, alignItems: 'center', borderWidth: 1, borderColor: '#CBD5E1' },
  mapPinBig: { fontSize: 32, marginBottom: 4 },
  mapNativeTitle: { fontSize: 15, fontWeight: 'bold', color: '#1E293B' },
  mapNativeSub: { fontSize: 12, color: '#2563EB', marginTop: 2, fontWeight: '600' },
  locBadge: { backgroundColor: '#F8FAFC', padding: 12, borderRadius: 8, marginTop: 10, borderWidth: 1, borderColor: '#E2E8F0', gap: 4 },
  locNote: { fontSize: 12, color: '#334155' },
  locSubNote: { fontSize: 11, color: '#64748B' }
});
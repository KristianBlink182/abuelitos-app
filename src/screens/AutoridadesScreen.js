import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Linking, Platform } from 'react-native';
import { getAutoridades } from '../services/api';

export default function AutoridadesScreen() {
  const [autoridades, setAutoridades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [dptoFiltro, setDptoFiltro] = useState('Todos');

  useEffect(() => {
    cargar();
  }, []);

  const cargar = async () => {
    setLoading(true);
    const data = await getAutoridades();
    setAutoridades(data);
    setLoading(false);
  };

  const departamentosPresentes = ['Todos', ...new Set(autoridades.map(a => a.departamento).filter(Boolean))];

  const autoridadesFiltradas = autoridades.filter(a => {
    const coincideTexto = (a.autoridad_nombre || '').toLowerCase().includes(busqueda.toLowerCase()) ||
                          (a.caserio_comunidad || '').toLowerCase().includes(busqueda.toLowerCase()) ||
                          (a.provincia || '').toLowerCase().includes(busqueda.toLowerCase()) ||
                          (a.bodega_nombre || '').toLowerCase().includes(busqueda.toLowerCase());
    const coincideDpto = dptoFiltro === 'Todos' || a.departamento === dptoFiltro;
    return coincideTexto && coincideDpto;
  });

  const contactarWhatsApp = (telefono, nombre, cargo, caserio) => {
    if (!telefono) return;
    const mensaje = encodeURIComponent(`Hola ${cargo} ${nombre}, le escribo desde abuelitos.pe para coordinar sobre los casos sociales en ${caserio}.`);
    const url = `https://wa.me/51${telefono}?text=${mensaje}`;
    if (typeof window !== 'undefined') window.open(url, '_blank');
    else Linking.openURL(url);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🛡️ Red Oficial de Autoridades y Bodegas Aliadas</Text>
        <Text style={styles.subtitle}>
          Líderes comunales acreditados (Tenientes Gobernadores y Presidentes) que garantizan la entrega real de los víveres.
        </Text>

        {/* Buscador */}
        <View style={styles.searchBox}>
          <TextInput 
            style={styles.inputSearch}
            placeholder="Buscar por nombre de autoridad, caserío o provincia..."
            value={busqueda}
            onChangeText={setBusqueda}
          />
        </View>

        {/* Filtros por Departamento */}
        <View style={styles.chipsRow}>
          {departamentosPresentes.map(dpto => (
            <TouchableOpacity 
              key={dpto} 
              style={[styles.chip, dptoFiltro === dpto && styles.chipActive]}
              onPress={() => setDptoFiltro(dpto)}
            >
              <Text style={[styles.chipText, dptoFiltro === dpto && styles.chipTextActive]}>
                {dpto === 'Todos' ? '📍 Todos' : dpto}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#FF385C" style={{ marginTop: 40 }} />
      ) : autoridadesFiltradas.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>No se encontraron autoridades registradas con esos criterios.</Text>
        </View>
      ) : (
        <View style={styles.grid}>
          {autoridadesFiltradas.map((item, idx) => (
            <View key={idx} style={styles.card}>
              <View style={styles.badgeAuth}>
                <Text style={styles.badgeAuthText}>✓ Autoridad Acreditada</Text>
              </View>
              
              <Text style={styles.authName}>👤 {item.autoridad_nombre}</Text>
              <Text style={styles.authCargo}>{item.cargo}</Text>
              <Text style={styles.authLoc}>📍 {item.caserio_comunidad}, {item.distrito} - {item.provincia} ({item.departamento})</Text>

              {/* Botón WhatsApp Autoridad */}
              {item.telefono ? (
                <TouchableOpacity 
                  style={styles.btnWhatsappAuth} 
                  onPress={() => contactarWhatsApp(item.telefono, item.autoridad_nombre, item.cargo, item.caserio_comunidad)}
                >
                  <Text style={styles.btnWhatsappAuthText}>💬 Contactar por WhatsApp ({item.telefono})</Text>
                </TouchableOpacity>
              ) : null}

              {/* BODEGA VINCULADA */}
              <View style={styles.bodegaBox}>
                <Text style={styles.bodegaTitle}>🏪 Bodega Solidaria Asignada:</Text>
                <Text style={styles.bodegaDetail}>{item.bodega_nombre || 'Bodega Local'} ({item.bodega_dueno || 'Comercio'})</Text>
                <Text style={styles.bodegaYape}>📱 Yape/Plin: {item.bodega_yape || item.telefono}</Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC', padding: 20 },
  header: { maxWidth: 950, alignSelf: 'center', width: '100%', marginVertical: 10, alignItems: 'center' },
  title: { fontSize: 24, fontWeight: '900', color: '#1E293B', textAlign: 'center', marginBottom: 4 },
  subtitle: { fontSize: 13, color: '#64748B', textAlign: 'center', marginBottom: 18 },
  searchBox: { width: '100%', maxWidth: 600, backgroundColor: '#FFF', borderRadius: 25, borderWidth: 1, borderColor: '#E2E8F0', paddingHorizontal: 16, paddingVertical: 10, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2, marginBottom: 12 },
  inputSearch: { fontSize: 14, outlineStyle: 'none' },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, justifyContent: 'center', marginBottom: 15 },
  chip: { backgroundColor: '#F1F5F9', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: '#E2E8F0' },
  chipActive: { backgroundColor: '#FF385C', borderColor: '#FF385C' },
  chipText: { fontSize: 12, fontWeight: '600', color: '#475569' },
  chipTextActive: { color: '#FFF', fontWeight: 'bold' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 14, maxWidth: 1000, width: '100%', alignSelf: 'center', justifyContent: 'center', marginTop: 10 },
  card: { backgroundColor: '#FFF', width: 310, padding: 18, borderRadius: 14, borderWidth: 1, borderColor: '#E2E8F0', shadowOpacity: 0.04, shadowRadius: 6, elevation: 2 },
  badgeAuth: { alignSelf: 'flex-start', backgroundColor: '#DCFCE7', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginBottom: 10 },
  badgeAuthText: { fontSize: 11, fontWeight: 'bold', color: '#166534' },
  authName: { fontSize: 17, fontWeight: 'bold', color: '#0F172A', marginBottom: 2 },
  authCargo: { fontSize: 13, color: '#2563EB', fontWeight: '600', marginBottom: 6 },
  authLoc: { fontSize: 12, color: '#64748B', marginBottom: 10 },
  btnWhatsappAuth: { backgroundColor: '#25D366', paddingVertical: 8, paddingHorizontal: 10, borderRadius: 8, alignItems: 'center', marginBottom: 12 },
  btnWhatsappAuthText: { color: '#FFF', fontWeight: 'bold', fontSize: 11 },
  bodegaBox: { backgroundColor: '#FFF7ED', padding: 10, borderRadius: 8, borderWidth: 1, borderColor: '#FFEDD5' },
  bodegaTitle: { fontSize: 11, fontWeight: 'bold', color: '#9A3412', textTransform: 'uppercase' },
  bodegaDetail: { fontSize: 13, fontWeight: 'bold', color: '#1E293B', marginTop: 2 },
  bodegaYape: { fontSize: 12, color: '#C2410C', fontWeight: 'bold', marginTop: 2 },
  emptyCard: { backgroundColor: '#FFF', padding: 30, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center', maxWidth: 500, alignSelf: 'center', marginTop: 20 },
  emptyText: { color: '#64748B', fontSize: 13, fontStyle: 'italic' }
});
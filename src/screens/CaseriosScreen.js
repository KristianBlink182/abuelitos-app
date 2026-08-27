import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { getCaserios } from '../services/api';

export default function CaseriosScreen({ onSelectCaserio }) {
  const [caserios, setCaserios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [dptoFiltro, setDptoFiltro] = useState('Todos');

  useEffect(() => {
    cargarCaserios();
  }, []);

  const cargarCaserios = async () => {
    setLoading(true);
    const data = await getCaserios();
    setCaserios(data);
    setLoading(false);
  };

  // Obtener lista única de departamentos presentes en los caseríos
  const departamentosConCasos = ['Todos', ...new Set(caserios.map(c => c.departamento).filter(Boolean))];

  const caseriosFiltrados = caserios.filter(c => {
    const coincideTexto = (c.caserio || '').toLowerCase().includes(busqueda.toLowerCase()) ||
                          (c.distrito || '').toLowerCase().includes(busqueda.toLowerCase()) ||
                          (c.provincia || '').toLowerCase().includes(busqueda.toLowerCase());
    const coincideDpto = dptoFiltro === 'Todos' || c.departamento === dptoFiltro;
    return coincideTexto && coincideDpto;
  });

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🏔️ Caseríos y Comunidades Beneficiadas</Text>
        <Text style={styles.subtitle}>
          Explora los anexos rurales del Perú profundo donde tenemos abuelitos registrados y bodegas aliadas.
        </Text>

        {/* Buscador de Caseríos */}
        <View style={styles.searchBox}>
          <TextInput 
            style={styles.inputSearch}
            placeholder="Buscar por caserío, anexo, distrito o provincia..."
            value={busqueda}
            onChangeText={setBusqueda}
          />
        </View>

        {/* Chips de Departamentos */}
        <View style={styles.chipsRow}>
          {departamentosConCasos.map(dpto => (
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
      ) : caseriosFiltrados.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>No se encontraron caseríos con los criterios de búsqueda.</Text>
        </View>
      ) : (
        <View style={styles.grid}>
          {caseriosFiltrados.map((c, idx) => (
            <TouchableOpacity key={idx} style={styles.card} onPress={() => onSelectCaserio(c.caserio)} activeOpacity={0.8}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>📍 {c.departamento}</Text>
              </View>
              
              <Text style={styles.caserioName}>{c.caserio}</Text>
              <Text style={styles.jurisdiccion}>{c.distrito} — Prov. {c.provincia}</Text>
              
              <View style={styles.footerRow}>
                <Text style={styles.countText}>
                  👥 {c.total_abuelitos} {c.total_abuelitos === 1 ? 'caso activo' : 'casos activos'}
                </Text>
                <Text style={styles.btnLink}>Ver casos →</Text>
              </View>
            </TouchableOpacity>
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
  card: { backgroundColor: '#FFF', width: 300, padding: 18, borderRadius: 14, borderWidth: 1, borderColor: '#E2E8F0', shadowOpacity: 0.04, shadowRadius: 6, elevation: 2 },
  badge: { alignSelf: 'flex-start', backgroundColor: '#F1F5F9', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginBottom: 8 },
  badgeText: { fontSize: 11, fontWeight: 'bold', color: '#475569' },
  caserioName: { fontSize: 17, fontWeight: 'bold', color: '#0F172A', marginBottom: 2 },
  jurisdiccion: { fontSize: 12, color: '#64748B', marginBottom: 14 },
  footerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderColor: '#F1F5F9', paddingTop: 10 },
  countText: { fontSize: 12, fontWeight: '700', color: '#16A34A' },
  btnLink: { fontSize: 12, fontWeight: 'bold', color: '#FF385C' },
  emptyCard: { backgroundColor: '#FFF', padding: 30, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center', maxWidth: 500, alignSelf: 'center', marginTop: 20 },
  emptyText: { color: '#64748B', fontSize: 13, fontStyle: 'italic' }
});
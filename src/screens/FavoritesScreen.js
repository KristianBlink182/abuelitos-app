import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Image, ActivityIndicator } from 'react-native';
import { getMisFavoritos } from '../services/api';

export default function FavoritesScreen({ usuario, onSelectAbuelito, onOpenAuth, onGoHome }) {
  const [favoritos, setFavoritos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (usuario && usuario.id) {
      cargarFavoritos();
    } else {
      setLoading(false);
    }
  }, [usuario]);

  const cargarFavoritos = async () => {
    setLoading(true);
    const data = await getMisFavoritos(usuario.id);
    setFavoritos(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  if (!usuario) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>❤️</Text>
        <Text style={styles.emptyTitle}>Inicia sesión para ver tus Favoritos</Text>
        <Text style={styles.emptySub}>Guarda los casos que deseas seguir de cerca y apoyar mes a mes.</Text>
        <TouchableOpacity style={styles.btnAuth} onPress={onOpenAuth} activeOpacity={0.85}>
          <Text style={styles.btnAuthText}>Ingresar a mi Cuenta</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.wrapper}>
        <Text style={styles.title}>❤️ Mis Abuelitos Favoritos</Text>
        <Text style={styles.sub}>Casos que tienes guardados para seguimiento y apoyo continuo ({favoritos.length}):</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#FF385C" style={{ marginVertical: 30 }} />
        ) : favoritos.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyTitle}>No tienes abuelitos guardados aún.</Text>
            <Text style={styles.emptySub}>Explora el directorio y toca "🤍 Guardar" en los casos que quieras seguir.</Text>
            <TouchableOpacity style={styles.btnExplorar} onPress={onGoHome} activeOpacity={0.85}>
              <Text style={styles.btnExplorarText}>Explorar Casos</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.compactList}>
            {favoritos.map((item) => (
              <TouchableOpacity 
                key={item.id} 
                style={styles.compactItem} 
                onPress={() => onSelectAbuelito(item)}
                activeOpacity={0.8}
              >
                <Image source={{ uri: item.foto_url }} style={styles.compactImg} />

                <View style={styles.compactInfo}>
                  <View style={styles.compactTopRow}>
                    <Text style={styles.compactName}>{item.nombre_completo}</Text>
                    <View style={styles.badgeUrgente}>
                      <Text style={styles.badgeUrgenteText}>🚨 Urgente</Text>
                    </View>
                  </View>

                  <Text style={styles.compactLocation}>📍 {item.caserio}, {item.provincia} ({item.edad} años)</Text>
                  
                  <Text style={styles.compactNeeds} numberOfLines={1}>
                    <Text style={{ fontWeight: 'bold', color: '#1E293B' }}>Necesita: </Text>
                    {item.necesidades_urgentes || item.dolencias_salud}
                  </Text>
                </View>

                <View style={styles.arrowBox}>
                  <Text style={styles.arrowIcon}>➔</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC', padding: 16 },
  wrapper: { maxWidth: 800, alignSelf: 'center', width: '100%' },
  title: { fontSize: 22, fontWeight: '900', color: '#1E293B', marginBottom: 2 },
  sub: { fontSize: 13, color: '#64748B', marginBottom: 16 },
  compactList: { gap: 10 },
  compactItem: { flexDirection: 'row', backgroundColor: '#FFFFFF', padding: 12, borderRadius: 14, borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center', shadowOpacity: 0.04, shadowRadius: 6, elevation: 2 },
  compactImg: { width: 65, height: 65, borderRadius: 10, resizeMode: 'cover', backgroundColor: '#0F172A' },
  compactInfo: { flex: 1, marginLeft: 12, marginRight: 6, justifyContent: 'center' },
  compactTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 },
  compactName: { fontSize: 15, fontWeight: 'bold', color: '#1E293B', flex: 1 },
  badgeUrgente: { backgroundColor: '#FFE4E6', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  badgeUrgenteText: { color: '#E11D48', fontSize: 9, fontWeight: 'bold' },
  compactLocation: { fontSize: 11, color: '#64748B', marginBottom: 4 },
  compactNeeds: { fontSize: 11, color: '#475569' },
  arrowBox: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0' },
  arrowIcon: { fontSize: 12, color: '#FF385C', fontWeight: 'bold' },
  emptyContainer: { flex: 1, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center', padding: 30, minHeight: 400 },
  emptyIcon: { fontSize: 44, marginBottom: 10 },
  emptyTitle: { fontSize: 18, fontWeight: '900', color: '#1E293B', marginBottom: 6, textAlign: 'center' },
  emptySub: { fontSize: 13, color: '#64748B', textAlign: 'center', marginBottom: 20 },
  btnAuth: { backgroundColor: '#FF385C', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 10 },
  btnAuthText: { color: '#FFF', fontWeight: 'bold', fontSize: 13 },
  emptyBox: { backgroundColor: '#FFF', padding: 30, borderRadius: 14, borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center' },
  btnExplorar: { backgroundColor: '#FF385C', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8, marginTop: 12 },
  btnExplorarText: { color: '#FFF', fontWeight: 'bold', fontSize: 13 }
});
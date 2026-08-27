import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import AbuelitoCard from '../components/AbuelitoCard';
import { getMisFavoritos } from '../services/api';

export default function DonorProfileScreen({ usuario, onSelectAbuelito, onCerrarSesion, onGoHome }) {
  const [favoritos, setFavoritos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (usuario) cargarFavoritos();
  }, [usuario]);

  const cargarFavoritos = async () => {
    setLoading(true);
    const data = await getMisFavoritos(usuario.id);
    setFavoritos(data);
    setLoading(false);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.wrapper}>
        
        {/* CABECERA DEL DONANTE */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarBig}>
            <Text style={styles.avatarBigText}>{usuario.nombre_completo.substring(0, 2).toUpperCase()}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.userName}>{usuario.nombre_completo}</Text>
            <Text style={styles.userEmail}>✉️ {usuario.email}</Text>
            <Text style={styles.userBadge}>❤️ Donante Solidario Acreditado</Text>
          </View>
          <TouchableOpacity style={styles.btnLogout} onPress={onCerrarSesion}>
            <Text style={styles.btnLogoutText}>Cerrar Sesión</Text>
          </TouchableOpacity>
        </View>

        {/* MIS ABUELITOS SEGUIDOS / FAVORITOS */}
        <Text style={styles.secTitle}>❤️ Casos que sigues y tienes en Favoritos ({favoritos.length})</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#FF385C" style={{ marginVertical: 30 }} />
        ) : favoritos.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyTitle}>Aún no has guardado ningún abuelito en favoritos.</Text>
            <Text style={styles.emptySub}>Explora el directorio y presiona "🤍 Guardar" en los casos que quieras seguir.</Text>
            <TouchableOpacity style={styles.btnExplorar} onPress={onGoHome}>
              <Text style={styles.btnExplorarText}>Explorar Casos</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.grid}>
            {favoritos.map((item) => (
              <AbuelitoCard key={item.id} item={item} onSelect={onSelectAbuelito} />
            ))}
          </View>
        )}

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC', padding: 20 },
  wrapper: { maxWidth: 1000, alignSelf: 'center', width: '100%' },
  profileHeader: { flexDirection: 'row', backgroundColor: '#FFF', padding: 20, borderRadius: 16, borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center', gap: 16, marginBottom: 25, flexWrap: 'wrap' },
  avatarBig: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#FF385C', justifyContent: 'center', alignItems: 'center' },
  avatarBigText: { color: '#FFF', fontSize: 22, fontWeight: '900' },
  userName: { fontSize: 20, fontWeight: '900', color: '#1E293B' },
  userEmail: { fontSize: 13, color: '#64748B', marginVertical: 2 },
  userBadge: { fontSize: 12, fontWeight: 'bold', color: '#16A34A', marginTop: 2 },
  btnLogout: { backgroundColor: '#F1F5F9', paddingVertical: 8, paddingHorizontal: 14, borderRadius: 8 },
  btnLogoutText: { fontSize: 12, fontWeight: 'bold', color: '#475569' },
  secTitle: { fontSize: 18, fontWeight: '900', color: '#1E293B', marginBottom: 14 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  emptyBox: { backgroundColor: '#FFF', padding: 30, borderRadius: 14, borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center' },
  emptyTitle: { fontSize: 15, fontWeight: 'bold', color: '#1E293B', marginBottom: 4 },
  emptySub: { fontSize: 13, color: '#64748B', textAlign: 'center', marginBottom: 16 },
  btnExplorar: { backgroundColor: '#FF385C', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8 },
  btnExplorarText: { color: '#FFF', fontWeight: 'bold', fontSize: 13 }
});
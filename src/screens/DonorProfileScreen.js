import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Image, ActivityIndicator } from 'react-native';
import { getMisFavoritos } from '../services/api';

export default function DonorProfileScreen({ usuario = {}, onSelectAbuelito, onCerrarSesion, onGoHome }) {
  const [favoritos, setFavoritos] = useState([]);
  const [loading, setLoading] = useState(true);

  const nombreUsuario = usuario?.nombre_completo || usuario?.nombre || 'Donante Solidario';
  const emailUsuario = usuario?.email || 'Sin correo';
  const iniciales = nombreUsuario.trim().substring(0, 2).toUpperCase();

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

  return (
    <ScrollView style={styles.container}>
      <View style={styles.wrapper}>
        
        {/* CABECERA DEL DONANTE */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarBig}>
            <Text style={styles.avatarBigText}>{iniciales}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.userName}>{nombreUsuario}</Text>
            <Text style={styles.userEmail}>✉️ {emailUsuario}</Text>
            <Text style={styles.userBadge}>❤️ Donante Solidario Acreditado</Text>
          </View>
          <TouchableOpacity style={styles.btnLogout} onPress={onCerrarSesion} activeOpacity={0.85}>
            <Text style={styles.btnLogoutText}>Cerrar Sesión</Text>
          </TouchableOpacity>
        </View>

        {/* TÍTULO DE SECCIÓN */}
        <Text style={styles.secTitle}>❤️ Casos que sigues en Favoritos ({favoritos.length})</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#FF385C" style={{ marginVertical: 30 }} />
        ) : favoritos.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyTitle}>Aún no tienes abuelitos en favoritos.</Text>
            <Text style={styles.emptySub}>Explora los casos y toca "🤍 Guardar" para agregarlos a tu lista.</Text>
            <TouchableOpacity style={styles.btnExplorar} onPress={onGoHome} activeOpacity={0.85}>
              <Text style={styles.btnExplorarText}>Explorar Casos</Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* LISTA DE ITEMS COMPACTOS EN VEZ DE TARJETAS GIGANTES */
          <View style={styles.compactList}>
            {favoritos.map((item) => (
              <TouchableOpacity 
                key={item.id} 
                style={styles.compactItem} 
                onPress={() => onSelectAbuelito(item)}
                activeOpacity={0.8}
              >
                {/* Foto Pequeña a la Izquierda */}
                <Image source={{ uri: item.foto_url }} style={styles.compactImg} />

                {/* Información Central */}
                <View style={styles.compactInfo}>
                  <View style={styles.compactTopRow}>
                    <Text style={styles.compactName}>{item.nombre_completo}</Text>
                    <View style={styles.badgeUrgenteMini}>
                      <Text style={styles.badgeUrgenteMiniText}>🚨 Urgente</Text>
                    </View>
                  </View>

                  <Text style={styles.compactLocation}>📍 {item.caserio}, {item.provincia} ({item.edad} años)</Text>
                  
                  <Text style={styles.compactNeeds} numberOfLines={1}>
                    <Text style={{ fontWeight: 'bold', color: '#1E293B' }}>Necesita: </Text>
                    {item.necesidades_urgentes || item.dolencias_salud}
                  </Text>
                </View>

                {/* Flecha a la Derecha */}
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
  profileHeader: { flexDirection: 'row', backgroundColor: '#FFF', padding: 18, borderRadius: 16, borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center', gap: 14, marginBottom: 20, flexWrap: 'wrap' },
  avatarBig: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#FF385C', justifyContent: 'center', alignItems: 'center' },
  avatarBigText: { color: '#FFF', fontSize: 18, fontWeight: '900' },
  userName: { fontSize: 17, fontWeight: '900', color: '#1E293B' },
  userEmail: { fontSize: 12, color: '#64748B', marginVertical: 1 },
  userBadge: { fontSize: 11, fontWeight: 'bold', color: '#16A34A', marginTop: 1 },
  btnLogout: { backgroundColor: '#F1F5F9', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8 },
  btnLogoutText: { fontSize: 11, fontWeight: 'bold', color: '#475569' },
  secTitle: { fontSize: 16, fontWeight: '900', color: '#1E293B', marginBottom: 12 },
  
  // ITEMS COMPACTOS
  compactList: { gap: 10 },
  compactItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    cursor: 'pointer',
  },
  compactImg: {
    width: 65,
    height: 65,
    borderRadius: 10,
    resizeMode: 'cover',
    backgroundColor: '#0F172A',
  },
  compactInfo: {
    flex: 1,
    marginLeft: 12,
    marginRight: 6,
    justifyContent: 'center',
  },
  compactTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  compactName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1E293B',
    flex: 1,
  },
  badgeUrgenteMini: {
    backgroundColor: '#FFE4E6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeUrgenteMiniText: {
    color: '#E11D48',
    fontSize: 9,
    fontWeight: 'bold',
  },
  compactLocation: {
    fontSize: 11,
    color: '#64748B',
    marginBottom: 4,
  },
  compactNeeds: {
    fontSize: 11,
    color: '#475569',
  },
  arrowBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  arrowIcon: {
    fontSize: 12,
    color: '#FF385C',
    fontWeight: 'bold',
  },

  emptyBox: { backgroundColor: '#FFF', padding: 30, borderRadius: 14, borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center' },
  emptyTitle: { fontSize: 15, fontWeight: 'bold', color: '#1E293B', marginBottom: 4, textAlign: 'center' },
  emptySub: { fontSize: 12, color: '#64748B', textAlign: 'center', marginBottom: 16 },
  btnExplorar: { backgroundColor: '#FF385C', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8 },
  btnExplorarText: { color: '#FFF', fontWeight: 'bold', fontSize: 13 }
});
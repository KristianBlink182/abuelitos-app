import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { getDonantesAbuelito } from '../services/api';

export default function DonorAvatarsRow({ abuelitoId, abuelitoNombre }) {
  const [donantes, setDonantes] = useState([]);

  useEffect(() => {
    cargarDonantes();
  }, [abuelitoId]);

  const cargarDonantes = async () => {
    const data = await getDonantesAbuelito(abuelitoId);
    setDonantes(data);
  };

  const getIniciales = (nombre) => {
    if (!nombre) return 'DS';
    const partes = nombre.trim().split(' ');
    if (partes.length >= 2) return `${partes[0][0]}${partes[1][0]}`.toUpperCase();
    return nombre.substring(0, 2).toUpperCase();
  };

  const colores = ['#FF385C', '#2563EB', '#16A34A', '#7C3AED', '#EA580C', '#0D9488'];

  return (
    <View style={styles.container}>
      <View style={styles.head}>
        <Text style={styles.title}>👥 Padrinos y Donantes Activos</Text>
        <Text style={styles.badgeCount}>{donantes.length} {donantes.length === 1 ? 'donante' : 'donantes'}</Text>
      </View>

      {donantes.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>💡 Este caso aún no tiene donantes. ¡Sé el primero en apadrinar a {abuelitoNombre}!</Text>
        </View>
      ) : (
        <View style={styles.contentRow}>
          {/* Círculos de Avatares Superpuestos */}
          <View style={styles.avatarsGroup}>
            {donantes.slice(0, 5).map((d, index) => (
              <View key={index} style={[styles.avatarCircle, { backgroundColor: colores[index % colores.length], marginLeft: index === 0 ? 0 : -10 }]}>
                <Text style={styles.avatarText}>{getIniciales(d.donante_nombre)}</Text>
              </View>
            ))}
            {donantes.length > 5 && (
              <View style={[styles.avatarCircle, styles.avatarMore, { marginLeft: -10 }]}>
                <Text style={styles.avatarMoreText}>+{donantes.length - 5}</Text>
              </View>
            )}
          </View>

          {/* Texto de Resumen */}
          <View style={styles.namesWrapper}>
            <Text style={styles.namesText}>
              Apoyado por <Text style={{ fontWeight: 'bold', color: '#1E293B' }}>{donantes[0]?.donante_nombre}</Text>
              {donantes.length > 1 ? ` y ${donantes.length - 1} persona(s) más.` : '.'}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#FFF', padding: 18, borderRadius: 16, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 20 },
  head: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  title: { fontSize: 16, fontWeight: 'bold', color: '#1E293B' },
  badgeCount: { backgroundColor: '#F0FDF4', color: '#16A34A', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, fontSize: 11, fontWeight: 'bold', borderWidth: 1, borderColor: '#BBF7D0' },
  contentRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 12 },
  avatarsGroup: { flexDirection: 'row', alignItems: 'center' },
  avatarCircle: { width: 38, height: 38, borderRadius: 19, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#FFF', elevation: 2 },
  avatarText: { color: '#FFF', fontWeight: 'bold', fontSize: 12 },
  avatarMore: { backgroundColor: '#334155' },
  avatarMoreText: { color: '#FFF', fontSize: 11, fontWeight: 'bold' },
  namesWrapper: { flex: 1, minWidth: 180 },
  namesText: { fontSize: 13, color: '#64748B' },
  emptyCard: { backgroundColor: '#FFFBEB', padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#FDE68A' },
  emptyText: { color: '#B45309', fontSize: 12, fontWeight: '600' }
});
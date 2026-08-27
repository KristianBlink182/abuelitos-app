import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { getEntregas } from '../services/api';

export default function DeliverySection({ abuelitoId, abuelitoNombre }) {
  const [entregas, setEntregas] = useState([]);

  useEffect(() => {
    cargarEntregas();
  }, [abuelitoId]);

  const cargarEntregas = async () => {
    const data = await getEntregas(abuelitoId);
    setEntregas(Array.isArray(data) ? data : []);
  };

  return (
    <View style={styles.boxCard}>
      <Text style={styles.boxTitle}>📦 Muro de Transparencia de Ayuda Entregada</Text>
      <Text style={styles.boxSubtitle}>
        Registro fotográfico oficial de las canastas de víveres y medicinas entregadas a {abuelitoNombre}:
      </Text>

      {entregas.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>
            💡 Aún no se han registrado entregas este mes. Cuando la bodega despache los víveres con tu donación, aquí aparecerá la fotografía de constancia.
          </Text>
        </View>
      ) : (
        <View style={styles.entregasList}>
          {entregas.map((item) => (
            <View key={item.id} style={styles.entregaItem}>
              {item.foto_comprobante_url ? (
                <Image source={{ uri: item.foto_comprobante_url }} style={styles.entregaFoto} />
              ) : null}
              <View style={styles.entregaInfo}>
                <Text style={styles.entregaFecha}>🗓️ Fecha: {new Date(item.fecha_entrega).toLocaleDateString('es-PE')}</Text>
                <Text style={styles.entregaDesc}>{item.descripcion}</Text>
                <Text style={styles.badgeVerificado}>✓ Despacho verificado por la Bodega Aliada</Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  boxCard: { backgroundColor: '#FFF', padding: 22, borderRadius: 16, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 20 },
  boxTitle: { fontSize: 17, fontWeight: 'bold', color: '#2D3748', marginBottom: 2 },
  boxSubtitle: { fontSize: 13, color: '#718096', marginBottom: 14 },
  emptyBox: { backgroundColor: '#F8FAFC', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center' },
  emptyText: { color: '#64748B', fontSize: 13, textAlign: 'center', lineHeight: 20, fontStyle: 'italic' },
  entregasList: { gap: 12 },
  entregaItem: { flexDirection: 'row', backgroundColor: '#F8FAFC', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#E2E8F0', gap: 14 },
  entregaFoto: { width: 90, height: 90, borderRadius: 10, resizeMode: 'cover' },
  entregaInfo: { flex: 1, justifyContent: 'center' },
  entregaFecha: { fontSize: 12, fontWeight: 'bold', color: '#16A34A', marginBottom: 4 },
  entregaDesc: { fontSize: 13, color: '#334155', lineHeight: 18, marginBottom: 4 },
  badgeVerificado: { fontSize: 11, color: '#15803D', fontWeight: '600' }
});
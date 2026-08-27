import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, useWindowDimensions, Platform } from 'react-native';

export default function AbuelitoCard({ item, onSelect }) {
  const { width } = useWindowDimensions();
  const esMovil = width <= 768;

  // 1. DNI PROTEGIDO CON ASTERISCOS (Solo muestra los 3 últimos dígitos)
  const dniProtegido = item.dni && item.dni.length >= 4 
    ? `•••••${item.dni.slice(-3)}` 
    : '••••••••';

  // 2. META MENSUAL QUE SE REINICIA SOLA
  const metaMensual = parseFloat(item.meta_mensual || 120);
  const recaudadoMes = parseFloat(item.recaudado_mes_actual || item.saldo_disponible || 0);
  const porcentaje = Math.min(100, Math.round((recaudadoMes / metaMensual) * 100));

  return (
    <TouchableOpacity 
      style={[styles.gridCard, esMovil && styles.cardMovil]} 
      onPress={() => onSelect(item)} 
      activeOpacity={0.9}
    >
      <View style={styles.imageWrapper}>
        {Platform.OS === 'web' ? (
          <img 
            src={item.foto_url} 
            alt={item.nombre_completo}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'top center',
              display: 'block'
            }}
          />
        ) : (
          <Image source={{ uri: item.foto_url }} style={styles.gridCardImage} />
        )}
        
        <View style={styles.locationBadge}>
          <Text style={styles.locationBadgeText} numberOfLines={1}>📍 {item.caserio}, {item.provincia}</Text>
        </View>

        <View style={styles.urgenteBadge}>
          <Text style={styles.urgenteBadgeText}>🚨 Urgente</Text>
        </View>
      </View>

      <View style={styles.gridCardContent}>
        <Text style={styles.cardTitle} numberOfLines={1}>{item.nombre_completo}</Text>
        
        {/* DNI CENSURADO POR SEGURIDAD */}
        <Text style={styles.cardAge}>Edad: {item.edad} años | DNI: {dniProtegido}</Text>

        <Text style={styles.cardStory} numberOfLines={2}>
          {item.dolencias_salud || item.historia_biografia}
        </Text>

        {/* BARRA DE APOYO DEL MES ACTUAL */}
        <View style={styles.progressContainer}>
          <View style={styles.progressHead}>
            <Text style={styles.progressLabel}>Canasta de este Mes:</Text>
            <Text style={styles.progressValue}>S/ {recaudadoMes.toFixed(0)} de S/ {metaMensual.toFixed(0)}</Text>
          </View>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${porcentaje}%` }]} />
          </View>
          <Text style={styles.progressPct}>
            {porcentaje >= 100 ? '🎉 100% Cubierto este mes' : `${porcentaje}% cubierto`}
          </Text>
        </View>

        <View style={styles.verifiedRow}>
          <Text style={styles.verifiedCheck}>✓</Text>
          <Text style={styles.verifiedText} numberOfLines={1}>Validado por {item.autoridad_cargo || 'Autoridad Comunal'}</Text>
        </View>

        <View style={styles.btnDonar}>
          <Text style={styles.btnDonarText}>❤️ Ver Ficha & Donar</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  gridCard: {
    backgroundColor: '#FFFFFF',
    width: 335,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 4,
    margin: 8,
  },
  cardMovil: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
    marginHorizontal: 0,
    marginBottom: 16,
  },
  imageWrapper: {
    position: 'relative',
    width: '100%',
    height: 240,
    backgroundColor: '#0F172A',
    overflow: 'hidden',
  },
  gridCardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  locationBadge: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    maxWidth: '85%',
  },
  locationBadgeText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  urgenteBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#E11D48',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  urgenteBadgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '900',
  },
  gridCardContent: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 2,
  },
  cardAge: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 8,
  },
  cardStory: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
    marginBottom: 12,
    height: 36,
  },
  progressContainer: {
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  progressHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  progressLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#475569',
  },
  progressValue: {
    fontSize: 11,
    fontWeight: '900',
    color: '#16A34A',
  },
  progressBarBg: {
    height: 7,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 3,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#16A34A',
    borderRadius: 4,
  },
  progressPct: {
    fontSize: 10,
    color: '#64748B',
    textAlign: 'right',
  },
  verifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    padding: 7,
    borderRadius: 8,
    marginBottom: 12,
  },
  verifiedCheck: {
    color: '#16A34A',
    fontWeight: 'bold',
    fontSize: 12,
    marginRight: 6,
  },
  verifiedText: {
    color: '#16A34A',
    fontSize: 11,
    fontWeight: '600',
    flex: 1,
  },
  btnDonar: {
    backgroundColor: '#FF385C',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  btnDonarText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 13,
  },
});
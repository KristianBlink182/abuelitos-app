import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, Platform } from 'react-native';

export default function DepartmentBubblesSection({ onSelectDpto }) {
  // Catálogo de paisajes 100% peruanos para todas las regiones
  const regionesFotos = [
    { nombre: 'Cusco', foto: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=400' },
    { nombre: 'Puno', foto: 'https://images.unsplash.com/photo-1589802829985-817e51171b92?w=400' },
    { nombre: 'Huancavelica', foto: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400' },
    { nombre: 'Ayacucho', foto: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400' },
    { nombre: 'Áncash', foto: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400' },
    { nombre: 'Arequipa', foto: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400' },
    { nombre: 'Cajamarca', foto: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=400' },
    { nombre: 'Apurímac', foto: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=400' },
    { nombre: 'Junín', foto: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400' },
    { nombre: 'Huánuco', foto: 'https://images.unsplash.com/photo-1511497584788-87676104235f?w=400' },
    { nombre: 'La Libertad', foto: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=400' },
    { nombre: 'Piura', foto: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400' },
    { nombre: 'Amazonas', foto: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400' },
    { nombre: 'San Martín', foto: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=400' },
    { nombre: 'Loreto', foto: 'https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?w=400' },
    { nombre: 'Ica', foto: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400' },
    { nombre: 'Tacna', foto: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=400' },
    { nombre: 'Moquegua', foto: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=400' },
    { nombre: 'Pasco', foto: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=400' },
    { nombre: 'Lambayeque', foto: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400' },
    { nombre: 'Tumbes', foto: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400' },
    { nombre: 'Ucayali', foto: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=400' },
    { nombre: 'Madre de Dios', foto: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400' },
    { nombre: 'Lima Provincias', foto: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400' },
  ];

  return (
    <View style={styles.sectionWrapper}>
      <Text style={styles.tag}>COBERTURA EN EL PERÚ PROFUNDO</Text>
      <Text style={styles.title}>Explora por Departamentos y Regiones</Text>
      <Text style={styles.subtitle}>Selecciona cualquier región para ver los casos activos y bodegas solidarias:</Text>

      <View style={styles.regionsGrid}>
        {regionesFotos.map((r, idx) => (
          <TouchableOpacity 
            key={idx} 
            style={styles.regionCard}
            onPress={() => onSelectDpto(r.nombre)}
            activeOpacity={0.85}
          >
            <Image source={{ uri: r.foto }} style={styles.regionCardBg} />
            <View style={styles.regionOverlay} />
            <Text style={styles.regionName}>📍 {r.nombre}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionWrapper: {
    backgroundColor: '#FFFDF9',
    backgroundImage: Platform.OS === 'web' 
      ? 'radial-gradient(circle at 50% 0%, rgba(255, 56, 92, 0.05) 0%, transparent 60%), linear-gradient(180deg, #F8FAFC 0%, #FFFDF9 50%, #F1F5F9 100%)' 
      : undefined,
    paddingVertical: 55,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#E2E8F0',
  },
  tag: {
    color: '#FF385C',
    fontWeight: '900',
    fontSize: 11,
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 30,
  },
  regionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    maxWidth: 1150,
    width: '100%',
    justifyContent: 'center',
  },
  regionCard: {
    width: 175,
    height: 90,
    borderRadius: 14,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
  },
  regionCardBg: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  regionOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(15, 23, 42, 0.52)',
  },
  regionName: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 13,
    zIndex: 2,
    textAlign: 'center',
    paddingHorizontal: 8,
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
});
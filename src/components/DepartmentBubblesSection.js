import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, useWindowDimensions } from 'react-native';

export default function DepartmentBubblesSection({ onSelectDpto }) {
  const { width } = useWindowDimensions();
  const esMovil = width <= 768;

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
    <View style={[styles.sectionWrapper, esMovil && styles.sectionWrapperMovil]}>
      <Text style={styles.tag}>COBERTURA EN EL PERÚ PROFUNDO</Text>
      <Text style={[styles.title, esMovil && styles.titleMovil]}>Explora por Departamentos</Text>
      <Text style={styles.subtitle}>Toca cualquier región para ver sus casos activos:</Text>

      <View style={[styles.regionsGrid, esMovil && styles.regionsGridMovil]}>
        {regionesFotos.map((r, idx) => (
          <TouchableOpacity 
            key={idx} 
            style={[styles.regionCard, esMovil && styles.regionCardMovil]}
            onPress={() => onSelectDpto(r.nombre)}
            activeOpacity={0.85}
          >
            <Image source={{ uri: r.foto }} style={styles.regionCardBg} />
            <View style={styles.regionOverlay} />
            <Text style={[styles.regionName, esMovil && styles.regionNameMovil]} numberOfLines={1}>
              {r.nombre}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionWrapper: {
    backgroundColor: '#FFFDF9',
    paddingVertical: 45,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#E2E8F0',
  },
  sectionWrapperMovil: {
    paddingVertical: 25,
    paddingHorizontal: 12,
  },
  tag: {
    color: '#FF385C',
    fontWeight: '900',
    fontSize: 11,
    letterSpacing: 1.5,
    marginBottom: 4,
    textAlign: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 4,
  },
  titleMovil: {
    fontSize: 20,
  },
  subtitle: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 20,
  },
  regionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    maxWidth: 1150,
    width: '100%',
    justifyContent: 'center',
  },
  regionsGridMovil: {
    gap: 6,
    justifyContent: 'space-between',
  },
  regionCard: {
    width: 175,
    height: 85,
    borderRadius: 14,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  regionCardMovil: {
    width: '31.5%', // 3 columnas exactas en pantalla de celular
    height: 65,
    borderRadius: 10,
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
    paddingHorizontal: 6,
  },
  regionNameMovil: {
    fontSize: 10,
    fontWeight: 'bold',
  },
});
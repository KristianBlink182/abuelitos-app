import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';

export default function GallerySection({ abuelito = {}, onFotoClick, onVideoClick }) {
  // Solo toma las 3 fotos de vivienda/situación (sin duplicar la de perfil)
  const fotosVivienda = [
    abuelito.foto_vivienda_1,
    abuelito.foto_vivienda_2,
    abuelito.foto_vivienda_3
  ].filter(Boolean);

  const tieneVideo = Boolean(abuelito.video_url);

  return (
    <View style={styles.boxCard}>
      <Text style={styles.boxTitle}>📸 Galería Multimedia y Testimonio</Text>
      <Text style={styles.boxSubtitle}>Toca el video o las fotografías para verlas en pantalla completa:</Text>
      
      <View style={styles.galleryGrid}>
        
        {/* RECUADRO 1: VIDEO TESTIMONIO */}
        {tieneVideo && (
          <TouchableOpacity 
            style={[styles.galleryItem, styles.videoItem]} 
            onPress={() => onVideoClick && onVideoClick(abuelito.video_url)}
            activeOpacity={0.85}
          >
            <Image source={{ uri: abuelito.foto_url }} style={styles.galleryImg} />
            <View style={styles.videoOverlay}>
              <View style={styles.playPulseCircle}>
                <Text style={styles.playIcon}>▶</Text>
              </View>
              <View style={styles.videoBadge}>
                <Text style={styles.videoBadgeText}>🔴 Video (15s)</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}

        {/* LAS 3 FOTOGRAFÍAS EXACTAS (SIN DUPLICADOS) */}
        {fotosVivienda.slice(0, 3).map((uri, index) => (
          <TouchableOpacity 
            key={index} 
            style={styles.galleryItem} 
            onPress={() => onFotoClick && onFotoClick(uri)}
            activeOpacity={0.85}
          >
            <Image source={{ uri }} style={styles.galleryImg} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  boxCard: { backgroundColor: '#FFF', padding: 20, borderRadius: 16, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 20 },
  boxTitle: { fontSize: 16, fontWeight: 'bold', color: '#2D3748', marginBottom: 2 },
  boxSubtitle: { fontSize: 12, color: '#718096', marginBottom: 14 },
  galleryGrid: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
  galleryItem: { 
    width: 135, // Ancho fijo para que no se estire nunca
    height: 140, 
    borderRadius: 12, 
    overflow: 'hidden', 
    backgroundColor: '#F1F5F9', 
    position: 'relative' 
  },
  galleryImg: { width: '100%', height: '100%', resizeMode: 'cover' },
  videoItem: { borderWidth: 2, borderColor: '#EF4444' },
  videoOverlay: { position: 'absolute', width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.45)', justifyContent: 'center', alignItems: 'center' },
  playPulseCircle: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#EF4444', justifyContent: 'center', alignItems: 'center', shadowColor: '#EF4444', shadowOpacity: 0.6, shadowRadius: 8, elevation: 4 },
  playIcon: { color: '#FFF', fontSize: 16, fontWeight: 'bold', marginLeft: 2 },
  videoBadge: { position: 'absolute', bottom: 6, backgroundColor: 'rgba(15, 23, 42, 0.9)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  videoBadgeText: { color: '#FFF', fontSize: 9, fontWeight: 'bold' }
});
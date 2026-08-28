import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';

export default function GallerySection({ abuelito = {}, onFotoClick, onVideoClick }) {
  // Solo toma las fotos reales del abuelito
  const fotosReales = [
    abuelito.foto_url,
    abuelito.foto_vivienda_1,
    abuelito.foto_vivienda_2,
    abuelito.foto_vivienda_3
  ].filter(Boolean);

  const tieneVideo = Boolean(abuelito.video_url);

  return (
    <View style={styles.boxCard}>
      <Text style={styles.boxTitle}>📸 Galería de Fotografías y Testimonio</Text>
      <Text style={styles.boxSubtitle}>Toca el video o las fotografías para verlas en pantalla completa:</Text>
      
      <View style={styles.galleryGrid}>
        
        {/* RECUADRO 1: VIDEO (SI TIENE) */}
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
                <Text style={styles.videoBadgeText}>🔴 Video Testimonio (15s)</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}

        {/* FOTOGRAFÍAS REALES SUBIDAS */}
        {fotosReales.map((uri, index) => (
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
  boxCard: { backgroundColor: '#FFF', padding: 22, borderRadius: 16, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 20 },
  boxTitle: { fontSize: 17, fontWeight: 'bold', color: '#2D3748', marginBottom: 2 },
  boxSubtitle: { fontSize: 13, color: '#718096', marginBottom: 14 },
  galleryGrid: { flexDirection: 'row', gap: 12, flexWrap: 'wrap' },
  galleryItem: { flex: 1, minWidth: 140, height: 160, borderRadius: 12, overflow: 'hidden', backgroundColor: '#F1F5F9', position: 'relative' },
  galleryImg: { width: '100%', height: '100%', resizeMode: 'cover' },
  videoItem: { borderWidth: 2, borderColor: '#EF4444' },
  videoOverlay: { position: 'absolute', width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.45)', justifyContent: 'center', alignItems: 'center' },
  playPulseCircle: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#EF4444', justifyContent: 'center', alignItems: 'center' },
  playIcon: { color: '#FFF', fontSize: 18, fontWeight: 'bold', marginLeft: 3 },
  videoBadge: { position: 'absolute', bottom: 8, backgroundColor: 'rgba(15, 23, 42, 0.9)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  videoBadgeText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' }
});
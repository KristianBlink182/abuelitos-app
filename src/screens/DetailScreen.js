import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, Linking, Platform } from 'react-native';
import GallerySection from '../components/GallerySection';
import MapSection from '../components/MapSection';
import BodegaSidebar from '../components/BodegaSidebar';
import VideoCallModal from '../components/VideoCallModal';
import VideoPlayerModal from '../components/VideoPlayerModal';
import DeliverySection from '../components/DeliverySection';
import TestimoniosSection from '../components/TestimoniosSection';
import ImageViewerModal from '../components/ImageViewerModal';
import { generarFichaPDF } from '../utils/pdfGenerator';
import { toggleFavorito } from '../services/api';

export default function DetailScreen({ abuelito, onBack, onEdit, usuarioDonante, onOpenAuth }) {
  const [videoCallModalOpen, setVideoCallModalOpen] = useState(false);
  const [videoPlayerOpen, setVideoPlayerOpen] = useState(false);
  const [videoUrlActual, setVideoUrlActual] = useState(null);
  const [fotoZoomUrl, setFotoZoomUrl] = useState(null);
  const [esFavorito, setEsFavorito] = useState(false);

  const handleAbrirVideo = (url) => {
    setVideoUrlActual(url || abuelito.video_url);
    setVideoPlayerOpen(true);
  };

  const handleToggleFavorito = async () => {
    if (!usuarioDonante) {
      onOpenAuth();
      return;
    }
    const res = await toggleFavorito(usuarioDonante.id, abuelito.id);
    setEsFavorito(res.esFavorito);
  };

  const compartirWhatsApp = () => {
    const texto = encodeURIComponent(
      `🇵🇪 Ayudemos a ${abuelito.nombre_completo} (${abuelito.edad} años) en ${abuelito.caserio}, ${abuelito.provincia}. ` +
      `Necesita apoyo urgente en salud y víveres. Mira su caso aquí: `
    );
    const url = `https://wa.me/?text=${texto}`;
    if (typeof window !== 'undefined') window.open(url, '_blank');
    else Linking.openURL(url);
  };

  return (
    <View style={styles.detailWrapper}>
      <View style={styles.topActions}>
        <TouchableOpacity style={styles.btnVolver} onPress={onBack}>
          <Text style={styles.btnVolverText}>← Volver al Directorio</Text>
        </TouchableOpacity>

        <View style={styles.shareRow}>
          <TouchableOpacity style={[styles.btnFav, esFavorito && styles.btnFavActive]} onPress={handleToggleFavorito}>
            <Text style={[styles.btnFavText, esFavorito && { color: '#FFF' }]}>{esFavorito ? '❤️ Guardado' : '🤍 Guardar'}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.btnPdf} onPress={() => generarFichaPDF(abuelito)}>
            <Text style={styles.btnPdfText}>📄 Ficha PDF</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.btnShareWs} onPress={compartirWhatsApp}>
            <Text style={styles.btnShareWsText}>📲 Compartir</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.btnEditar} onPress={onEdit}>
            <Text style={styles.btnEditarText}>✏️ Editar</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* HEADER BANNER */}
      <View style={styles.detailBanner}>
        {Platform.OS === 'web' ? (
          <img 
            src={abuelito.foto_url} 
            alt={abuelito.nombre_completo}
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'top center',
              filter: 'brightness(0.7)'
            }}
          />
        ) : (
          <Image source={{ uri: abuelito.foto_url }} style={styles.detailBannerImage} />
        )}

        <View style={styles.bannerOverlay} />
        
        <View style={styles.detailHeaderInfo}>
          <TouchableOpacity onPress={() => setFotoZoomUrl(abuelito.foto_url)} activeOpacity={0.8}>
            <Image source={{ uri: abuelito.foto_url }} style={styles.avatarImg} />
            <View style={styles.badgeZoom}><Text style={styles.badgeZoomText}>🔍 Ampliar</Text></View>
          </TouchableOpacity>

          <View style={{ marginLeft: 20, flex: 1 }}>
            <View style={styles.tagRow}>
              <View style={styles.tagBadgeRed}><Text style={styles.tagBadgeText}>Extrema Pobreza</Text></View>
              <View style={styles.tagBadgeGreen}><Text style={styles.tagBadgeText}>✓ Verificado por Autoridad</Text></View>
            </View>
            <Text style={styles.detailTitle}>{abuelito.nombre_completo}</Text>
            <Text style={styles.detailSubLoc}>📍 {abuelito.caserio}, {abuelito.distrito} - {abuelito.provincia} ({abuelito.departamento})</Text>
            <Text style={styles.detailAge}>Edad: {abuelito.edad} años | DNI: {abuelito.dni}</Text>
          </View>
        </View>
      </View>

      {/* CONTENIDO PRINCIPAL */}
      <View style={styles.detailColumns}>
        
        <View style={styles.colLeft}>
          
          {/* 1. HISTORIA DE VIDA */}
          <View style={styles.boxCard}>
            <Text style={styles.boxTitle}>📖 Situación Actual e Historia de Vida</Text>
            <Text style={styles.boxParagraph}>{abuelito.historia_biografia}</Text>
          </View>

          {/* 2. GALERÍA CON VIDEO Y FOTOS */}
          <GallerySection 
            abuelito={abuelito} 
            onFotoClick={(url) => setFotoZoomUrl(url)}
            onVideoClick={handleAbrirVideo}
          />

          {/* 3. UBICACIÓN GEOGRÁFICA */}
          <MapSection 
            distrito={abuelito.distrito} 
            provincia={abuelito.provincia} 
            departamento={abuelito.departamento} 
            caserio={abuelito.caserio} 
          />

          {/* 4. DIAGNÓSTICO DE SALUD */}
          <View style={[styles.boxCard, styles.boxSalud]}>
            <Text style={[styles.boxTitle, { color: '#B91C1C' }]}>🏥 Diagnóstico de Salud y Medicamentos Requeridos</Text>
            <View style={styles.medRow}>
              <Text style={styles.medLabel}>Dolencias de Salud:</Text>
              <Text style={styles.medText}>{abuelito.dolencias_salud || abuelito.necesidades_urgentes}</Text>
            </View>
            <View style={[styles.medRow, { marginTop: 8 }]}>
              <Text style={styles.medLabel}>Medicamentos que Necesita:</Text>
              <Text style={styles.medText}>{abuelito.medicamentos || 'Medicinas básicas y analgésicos para el dolor.'}</Text>
            </View>
          </View>

          {/* 5. CARENCIAS DE HOGAR */}
          <View style={[styles.boxCard, styles.boxHogar]}>
            <Text style={[styles.boxTitle, { color: '#C2410C' }]}>🛏️ Carencias de Hogar, Enseres y Abrigo</Text>
            <Text style={styles.boxParagraph}>
              {abuelito.carencias_materiales || 'Víveres, cama y frazadas térmicas para heladas.'}
            </Text>
          </View>

          {/* 6. MURO DE TRANSPARENCIA */}
          <DeliverySection abuelitoId={abuelito.id} abuelitoNombre={abuelito.nombre_completo} />

          {/* 7. PALABRAS DE ALIENTO */}
          <TestimoniosSection abuelitoId={abuelito.id} abuelitoNombre={abuelito.nombre_completo} />
        </View>

        {/* COLUMNA DERECHA */}
        <View style={styles.colRight}>
          <BodegaSidebar 
            abuelito={abuelito} 
            usuarioDonante={usuarioDonante}
            onOpenAuth={onOpenAuth}
            onOpenVideoCall={() => setVideoCallModalOpen(true)}
            onOpenVideoTestimonio={handleAbrirVideo}
          />
        </View>
      </View>

      {/* POPUP DE REPRODUCTOR DE VIDEO */}
      <VideoPlayerModal 
        visible={videoPlayerOpen}
        videoUrl={videoUrlActual}
        abuelitoNombre={abuelito.nombre_completo}
        onClose={() => setVideoPlayerOpen(false)}
      />

      {/* POPUP DE VIDEOLLAMADA */}
      <VideoCallModal visible={videoCallModalOpen} onClose={() => setVideoCallModalOpen(false)} abuelito={abuelito} />

      {/* POPUP DE FOTO EN ALTA DEFINICIÓN */}
      <ImageViewerModal 
        visible={!!fotoZoomUrl} 
        imageUri={fotoZoomUrl} 
        onClose={() => setFotoZoomUrl(null)} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  detailWrapper: { maxWidth: 1100, width: '100%', alignSelf: 'center', padding: 20 },
  topActions: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15, flexWrap: 'wrap', gap: 10 },
  btnVolver: { paddingVertical: 8, paddingHorizontal: 14, backgroundColor: '#E2E8F0', borderRadius: 8 },
  btnVolverText: { fontWeight: 'bold', color: '#4A5568' },
  shareRow: { flexDirection: 'row', gap: 8, alignItems: 'center', flexWrap: 'wrap' },
  btnFav: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#CBD5E1', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 },
  btnFavActive: { backgroundColor: '#FF385C', borderColor: '#FF385C' },
  btnFavText: { fontSize: 12, fontWeight: 'bold', color: '#475569' },
  btnPdf: { backgroundColor: '#2563EB', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 },
  btnPdfText: { color: '#FFF', fontWeight: 'bold', fontSize: 12 },
  btnShareWs: { backgroundColor: '#25D366', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 },
  btnShareWsText: { color: '#FFF', fontWeight: 'bold', fontSize: 12 },
  btnEditar: { paddingVertical: 8, paddingHorizontal: 12, backgroundColor: '#ED8936', borderRadius: 8 },
  btnEditarText: { fontWeight: 'bold', color: '#FFF', fontSize: 12 },
  detailBanner: { height: 260, borderRadius: 20, overflow: 'hidden', position: 'relative', justifyContent: 'flex-end', padding: 24, marginBottom: 25, backgroundColor: '#0F172A' },
  detailBannerImage: { position: 'absolute', width: '100%', height: '100%', resizeMode: 'cover' },
  bannerOverlay: { position: 'absolute', width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)' },
  detailHeaderInfo: { flexDirection: 'row', alignItems: 'center', zIndex: 2 },
  avatarImg: { width: 110, height: 110, borderRadius: 55, borderWidth: 4, borderColor: '#FFF', backgroundColor: '#0F172A' },
  badgeZoom: { position: 'absolute', bottom: -5, alignSelf: 'center', backgroundColor: '#1E293B', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  badgeZoomText: { color: '#FFF', fontSize: 9, fontWeight: 'bold' },
  tagRow: { flexDirection: 'row', gap: 10, marginBottom: 6, flexWrap: 'wrap' },
  tagBadgeRed: { backgroundColor: '#FF385C', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  tagBadgeGreen: { backgroundColor: '#16A34A', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  tagBadgeText: { color: '#FFF', fontSize: 11, fontWeight: 'bold' },
  detailTitle: { fontSize: 28, fontWeight: '900', color: '#FFF' },
  detailSubLoc: { fontSize: 14, color: '#E2E8F0', marginTop: 2 },
  detailAge: { fontSize: 13, color: '#CBD5E0', fontWeight: '600' },
  detailColumns: { flexDirection: 'row', flexWrap: 'wrap', gap: 24 },
  colLeft: { flex: 2, minWidth: 320 },
  colRight: { flex: 1, minWidth: 300 },
  boxCard: { backgroundColor: '#FFF', padding: 22, borderRadius: 16, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 20 },
  boxSalud: { backgroundColor: '#FEF2F2', borderColor: '#FECACA' },
  boxHogar: { backgroundColor: '#FFF7ED', borderColor: '#FFEDD5' },
  boxTitle: { fontSize: 17, fontWeight: 'bold', color: '#2D3748', marginBottom: 10 },
  boxParagraph: { fontSize: 14, color: '#4A5568', lineHeight: 22 },
  medRow: { backgroundColor: '#FFF', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#FCA5A5' },
  medLabel: { fontSize: 12, fontWeight: 'bold', color: '#991B1B', marginBottom: 2, textTransform: 'uppercase' },
  medText: { fontSize: 13, color: '#1E293B', lineHeight: 18 }
});
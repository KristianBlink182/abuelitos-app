import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, useWindowDimensions, Platform } from 'react-native';
import GallerySection from '../components/GallerySection';
import MapSection from '../components/MapSection';
import BodegaSidebar from '../components/BodegaSidebar';
import VideoCallModal from '../components/VideoCallModal';
import VideoPlayerModal from '../components/VideoPlayerModal';
import DeliverySection from '../components/DeliverySection';
import TestimoniosSection from '../components/TestimoniosSection';
import ImageViewerModal from '../components/ImageViewerModal';
import ShareSocialModal from '../components/ShareSocialModal';
import { toggleFavorito } from '../services/api';

export default function DetailScreen({ abuelito, onBack, onEdit, usuarioDonante, onOpenAuth }) {
  const { width } = useWindowDimensions();
  const esMovil = width <= 768;

  const [videoCallModalOpen, setVideoCallModalOpen] = useState(false);
  const [videoPlayerOpen, setVideoPlayerOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
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

  return (
    <View style={[styles.detailWrapper, esMovil && styles.detailWrapperMovil]}>
      
      {/* BOTONES SUPERIORES EN LA WEB: SOLO VOLVER, GUARDAR Y COMPARTIR */}
      {!esMovil && (
        <View style={styles.topActions}>
          <TouchableOpacity style={styles.btnVolver} onPress={onBack}>
            <Text style={styles.btnVolverText}>← Volver al Directorio</Text>
          </TouchableOpacity>

          <View style={styles.shareRow}>
            <TouchableOpacity style={[styles.btnFav, esFavorito && styles.btnFavActive]} onPress={handleToggleFavorito}>
              <Text style={[styles.btnFavText, esFavorito && { color: '#FFF' }]}>{esFavorito ? '❤️ Guardado' : '🤍 Guardar en Favoritos'}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btnShareWs} onPress={() => setShareModalOpen(true)}>
              <Text style={styles.btnShareWsText}>📢 Compartir en Redes</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* HEADER BANNER */}
      <View style={[styles.detailBanner, esMovil && styles.detailBannerMovil]}>
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

        {esMovil && (
          <TouchableOpacity style={styles.btnAtrasFlotante} onPress={onBack} activeOpacity={0.85}>
            <Text style={styles.btnAtrasFlotanteText}>←</Text>
          </TouchableOpacity>
        )}

        {esMovil && (
          <TouchableOpacity style={styles.btnFavFlotante} onPress={handleToggleFavorito} activeOpacity={0.85}>
            <Text style={styles.btnFavFlotanteText}>{esFavorito ? '❤️' : '🤍'}</Text>
          </TouchableOpacity>
        )}
        
        <View style={[styles.detailHeaderInfo, esMovil && styles.detailHeaderInfoMovil]}>
          <TouchableOpacity onPress={() => setFotoZoomUrl(abuelito.foto_url)} activeOpacity={0.8}>
            <Image source={{ uri: abuelito.foto_url }} style={[styles.avatarImg, esMovil && styles.avatarImgMovil]} />
            <View style={styles.badgeZoom}><Text style={styles.badgeZoomText}>🔍 Ampliar</Text></View>
          </TouchableOpacity>

          <View style={{ marginLeft: esMovil ? 14 : 20, flex: 1 }}>
            <View style={styles.tagRow}>
              <View style={styles.tagBadgeRed}><Text style={styles.tagBadgeText}>Extrema Pobreza</Text></View>
              <View style={styles.tagBadgeGreen}><Text style={styles.tagBadgeText}>✓ Verificado</Text></View>
            </View>
            <Text style={[styles.detailTitle, esMovil && styles.detailTitleMovil]}>{abuelito.nombre_completo}</Text>
            <Text style={[styles.detailSubLoc, esMovil && styles.detailSubLocMovil]}>📍 {abuelito.caserio}, {abuelito.distrito} - {abuelito.provincia}</Text>
            <Text style={styles.detailAge}>Edad: {abuelito.edad} años | DNI: {abuelito.dni && abuelito.dni.length >= 4 ? `•••••${abuelito.dni.slice(-3)}` : '••••••••'}</Text>
          </View>
        </View>
      </View>

      {/* CONTENIDO PRINCIPAL */}
      {esMovil ? (
        <View style={styles.movilColumn}>
          <View style={styles.boxCard}>
            <Text style={styles.boxTitle}>📖 Situación Actual e Historia de Vida</Text>
            <Text style={styles.boxParagraph}>{abuelito.historia_biografia}</Text>
          </View>

          <GallerySection 
            abuelito={abuelito} 
            onFotoClick={(url) => setFotoZoomUrl(url)}
            onVideoClick={handleAbrirVideo}
          />

          <MapSection 
            distrito={abuelito.distrito} 
            provincia={abuelito.provincia} 
            departamento={abuelito.departamento} 
            caserio={abuelito.caserio} 
          />

          <View style={[styles.boxCard, styles.boxSalud]}>
            <Text style={[styles.boxTitle, { color: '#B91C1C' }]}>🏥 Diagnóstico de Salud y Medicamentos</Text>
            <View style={styles.medRow}>
              <Text style={styles.medLabel}>Dolencias de Salud:</Text>
              <Text style={styles.medText}>{abuelito.dolencias_salud || abuelito.necesidades_urgentes}</Text>
            </View>
            <View style={[styles.medRow, { marginTop: 8 }]}>
              <Text style={styles.medLabel}>Medicamentos Requeridos:</Text>
              <Text style={styles.medText}>{abuelito.medicamentos || 'Medicinas básicas y analgésicos para el dolor.'}</Text>
            </View>
          </View>

          <View style={[styles.boxCard, styles.boxHogar]}>
            <Text style={[styles.boxTitle, { color: '#C2410C' }]}>🛏️ Carencias de Hogar, Enseres y Abrigo</Text>
            <Text style={styles.boxParagraph}>
              {abuelito.carencias_materiales || 'Víveres, cama y frazadas térmicas para heladas.'}
            </Text>
          </View>

          <View style={{ marginBottom: 20 }}>
            <BodegaSidebar 
              abuelito={abuelito} 
              usuarioDonante={usuarioDonante}
              onOpenAuth={onOpenAuth}
              onOpenVideoCall={() => setVideoCallModalOpen(true)}
              onOpenVideoTestimonio={handleAbrirVideo}
            />
          </View>

          <DeliverySection abuelitoId={abuelito.id} abuelitoNombre={abuelito.nombre_completo} />

          <TestimoniosSection abuelitoId={abuelito.id} abuelitoNombre={abuelito.nombre_completo} />
        </View>
      ) : (
        <View style={styles.detailColumns}>
          <View style={styles.colLeft}>
            <View style={styles.boxCard}>
              <Text style={styles.boxTitle}>📖 Situación Actual e Historia de Vida</Text>
              <Text style={styles.boxParagraph}>{abuelito.historia_biografia}</Text>
            </View>

            <GallerySection 
              abuelito={abuelito} 
              onFotoClick={(url) => setFotoZoomUrl(url)}
              onVideoClick={handleAbrirVideo}
            />

            <MapSection 
              distrito={abuelito.distrito} 
              provincia={abuelito.provincia} 
              departamento={abuelito.departamento} 
              caserio={abuelito.caserio} 
            />

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

            <View style={[styles.boxCard, styles.boxHogar]}>
              <Text style={[styles.boxTitle, { color: '#C2410C' }]}>🛏️ Carencias de Hogar, Enseres y Abrigo</Text>
              <Text style={styles.boxParagraph}>
                {abuelito.carencias_materiales || 'Víveres, cama y frazadas térmicas para heladas.'}
              </Text>
            </View>

            <DeliverySection abuelitoId={abuelito.id} abuelitoNombre={abuelito.nombre_completo} />

            <TestimoniosSection abuelitoId={abuelito.id} abuelitoNombre={abuelito.nombre_completo} />
          </View>

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
      )}

      {/* POPUPS */}
      <ShareSocialModal 
        visible={shareModalOpen}
        abuelito={abuelito}
        onClose={() => setShareModalOpen(false)}
      />

      <VideoPlayerModal 
        visible={videoPlayerOpen}
        videoUrl={videoUrlActual}
        abuelitoNombre={abuelito.nombre_completo}
        onClose={() => setVideoPlayerOpen(false)}
      />

      <VideoCallModal visible={videoCallModalOpen} onClose={() => setVideoCallModalOpen(false)} abuelito={abuelito} />

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
  detailWrapperMovil: { padding: 12 },
  topActions: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15, flexWrap: 'wrap', gap: 10 },
  btnVolver: { paddingVertical: 8, paddingHorizontal: 14, backgroundColor: '#E2E8F0', borderRadius: 8 },
  btnVolverText: { fontWeight: 'bold', color: '#4A5568' },
  shareRow: { flexDirection: 'row', gap: 8, alignItems: 'center', flexWrap: 'wrap' },
  btnFav: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#CBD5E1', paddingVertical: 8, paddingHorizontal: 14, borderRadius: 8 },
  btnFavActive: { backgroundColor: '#FF385C', borderColor: '#FF385C' },
  btnFavText: { fontSize: 12, fontWeight: 'bold', color: '#475569' },
  btnShareWs: { backgroundColor: '#0F172A', paddingVertical: 8, paddingHorizontal: 14, borderRadius: 8 },
  btnShareWsText: { color: '#FFF', fontWeight: 'bold', fontSize: 12 },
  detailBanner: { height: 260, borderRadius: 20, overflow: 'hidden', position: 'relative', justifyContent: 'flex-end', padding: 24, marginBottom: 25, backgroundColor: '#0F172A' },
  detailBannerMovil: { height: 230, borderRadius: 16, padding: 14, marginBottom: 16 },
  detailBannerImage: { position: 'absolute', width: '100%', height: '100%', resizeMode: 'cover' },
  bannerOverlay: { position: 'absolute', width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)' },
  btnAtrasFlotante: { position: 'absolute', top: 12, left: 12, zIndex: 10, backgroundColor: 'rgba(15, 23, 42, 0.75)', width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  btnAtrasFlotanteText: { color: '#FFF', fontSize: 20, fontWeight: 'bold', marginTop: -2 },
  btnFavFlotante: { position: 'absolute', top: 12, right: 12, zIndex: 10, backgroundColor: 'rgba(15, 23, 42, 0.75)', width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  btnFavFlotanteText: { fontSize: 16 },
  detailHeaderInfo: { flexDirection: 'row', alignItems: 'center', zIndex: 2 },
  detailHeaderInfoMovil: { alignItems: 'flex-end' },
  avatarImg: { width: 110, height: 110, borderRadius: 55, borderWidth: 4, borderColor: '#FFF', backgroundColor: '#0F172A' },
  avatarImgMovil: { width: 85, height: 85, borderRadius: 42, borderWidth: 3 },
  badgeZoom: { position: 'absolute', bottom: -5, alignSelf: 'center', backgroundColor: '#1E293B', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  badgeZoomText: { color: '#FFF', fontSize: 9, fontWeight: 'bold' },
  tagRow: { flexDirection: 'row', gap: 8, marginBottom: 4, flexWrap: 'wrap' },
  tagBadgeRed: { backgroundColor: '#FF385C', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  tagBadgeGreen: { backgroundColor: '#16A34A', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  tagBadgeText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },
  detailTitle: { fontSize: 28, fontWeight: '900', color: '#FFF' },
  detailTitleMovil: { fontSize: 20, lineHeight: 24 },
  detailSubLoc: { fontSize: 14, color: '#E2E8F0', marginTop: 2 },
  detailSubLocMovil: { fontSize: 11 },
  detailAge: { fontSize: 12, color: '#CBD5E0', fontWeight: '600' },
  movilColumn: { width: '100%' },
  detailColumns: { flexDirection: 'row', flexWrap: 'wrap', gap: 24 },
  colLeft: { flex: 2, minWidth: 320 },
  colRight: { flex: 1, minWidth: 300 },
  boxCard: { backgroundColor: '#FFF', padding: 18, borderRadius: 16, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 16 },
  boxSalud: { backgroundColor: '#FEF2F2', borderColor: '#FECACA' },
  boxHogar: { backgroundColor: '#FFF7ED', borderColor: '#FFEDD5' },
  boxTitle: { fontSize: 16, fontWeight: 'bold', color: '#2D3748', marginBottom: 8 },
  boxParagraph: { fontSize: 13, color: '#4A5568', lineHeight: 20 },
  medRow: { backgroundColor: '#FFF', padding: 10, borderRadius: 8, borderWidth: 1, borderColor: '#FCA5A5' },
  medLabel: { fontSize: 11, fontWeight: 'bold', color: '#991B1B', marginBottom: 2, textTransform: 'uppercase' },
  medText: { fontSize: 12, color: '#1E293B', lineHeight: 17 }
});
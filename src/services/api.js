import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 🌐 TU API OFICIAL EN PRODUCCIÓN (PARA LA WEB Y PARA EL IPHONE)
export const API_URL = 'https://abuelitos.pe/api';

// ========================================================
// MÓDULO 1: DIRECTORIO PÚBLICO Y DETALLES DE ABUELITOS
// ========================================================

// 1. Obtener listado de abuelitos (con respaldo offline en memoria del celular)
export const getAbuelitos = async () => {
  try {
    const res = await fetch(`${API_URL}/abuelitos`, {
      headers: { 'Bypass-Tunnel-Reminder': 'true' }
    });
    if (res.ok) {
      const data = await res.json();
      // Guarda copia en el teléfono por si se corta el internet en el campo
      await AsyncStorage.setItem('cached_abuelitos', JSON.stringify(data));
      return data;
    }
  } catch (error) {
    console.log('📡 Sin conexión a internet. Cargando datos guardados en memoria...');
  }

  // Respaldo sin conexión
  const cached = await AsyncStorage.getItem('cached_abuelitos');
  return cached ? JSON.parse(cached) : [];
};

// 2. Consultar el saldo acumulado en víveres de un abuelito
export const getSaldoAbuelito = async (abuelitoId) => {
  try {
    const res = await fetch(`${API_URL}/abuelitos/${abuelitoId}/saldo`, {
      headers: { 'Bypass-Tunnel-Reminder': 'true' }
    });
    if (!res.ok) {
      return { total_donado: 0, total_entregado: 0, saldo_disponible: 0 };
    }
    return await res.json();
  } catch (error) {
    console.error('Error al consultar saldo:', error);
    return { total_donado: 0, total_entregado: 0, saldo_disponible: 0 };
  }
};

// 3. Postular un nuevo caso social con fotografía real
export const postularAbuelito = async (formData) => {
  try {
    const res = await fetch(`${API_URL}/postular`, {
      method: 'POST',
      headers: { 'Bypass-Tunnel-Reminder': 'true' },
      body: formData
    });
    return await res.json();
  } catch (error) {
    console.error('Error al postular abuelito:', error);
    return { error: 'Error al conectar con el servidor' };
  }
};

// 4. Actualizar información o cambiar foto de un caso existente
export const updateAbuelito = async (id, formData) => {
  try {
    const res = await fetch(`${API_URL}/abuelitos/${id}`, {
      method: 'PUT',
      headers: { 'Bypass-Tunnel-Reminder': 'true' },
      body: formData
    });
    return await res.json();
  } catch (error) {
    console.error('Error al actualizar abuelito:', error);
    return { error: 'Error al conectar con el servidor' };
  }
};

// ========================================================
// MÓDULO 2: DONACIONES Y BILLETERA SOLIDARIA
// ========================================================

// Reportar una Donación de Yape/Plin con Comprobante
export const reportarDonacion = async (formData) => {
  try {
    const res = await fetch(`${API_URL}/donaciones`, {
      method: 'POST',
      headers: { 'Bypass-Tunnel-Reminder': 'true' }, // Sin Content-Type para permitir la subida de la foto
      body: formData
    });
    return await res.json();
  } catch (error) {
    console.error('Error al reportar donación:', error);
    return { error: 'Error de conexión' };
  }
};

// ========================================================
// MÓDULO 3: PORTAL DE LA BODEGA COMUNAL
// ========================================================

// 6. Consultar abuelitos asignados a una bodega por su número telefónico
export const getAbuelitosBodega = async (telefonoBodega) => {
  try {
    const res = await fetch(`${API_URL}/bodega/${telefonoBodega}/abuelitos`, {
      headers: { 'Bypass-Tunnel-Reminder': 'true' }
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error('Error al consultar bodega:', error);
    return [];
  }
};

// 7. Entregar canasta básica y descontar saldo con foto de constancia
export const entregarCanastaBodega = async (formData) => {
  try {
    const res = await fetch(`${API_URL}/bodega/entregar`, {
      method: 'POST',
      headers: { 'Bypass-Tunnel-Reminder': 'true' },
      body: formData
    });
    return await res.json();
  } catch (error) {
    console.error('Error al registrar entrega de bodega:', error);
    return { error: 'Error de conexión' };
  }
};

// ========================================================
// MÓDULO 4: CASERÍOS, AUTORIDADES Y TRANSPARENCIA
// ========================================================

// 8. Directorio de caseríos con conteo de beneficiarios
export const getCaserios = async () => {
  try {
    const res = await fetch(`${API_URL}/caserios`, {
      headers: { 'Bypass-Tunnel-Reminder': 'true' }
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error('Error al consultar caseríos:', error);
    return [];
  }
};

// 9. Directorio de autoridades comunales y bodegas asociadas
export const getAutoridades = async () => {
  try {
    const res = await fetch(`${API_URL}/autoridades`, {
      headers: { 'Bypass-Tunnel-Reminder': 'true' }
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error('Error al consultar autoridades:', error);
    return [];
  }
};

// 10. Obtener historial fotográfico de entregas de un abuelito
export const getEntregas = async (abuelitoId) => {
  try {
    const res = await fetch(`${API_URL}/entregas/${abuelitoId}`, {
      headers: { 'Bypass-Tunnel-Reminder': 'true' }
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error('Error al consultar entregas:', error);
    return [];
  }
};

// 11. Subir una nueva constancia fotográfica de entrega
export const createEntrega = async (formData) => {
  try {
    const res = await fetch(`${API_URL}/entregas`, {
      method: 'POST',
      headers: { 'Bypass-Tunnel-Reminder': 'true' },
      body: formData
    });
    return await res.json();
  } catch (error) {
    console.error('Error al registrar entrega:', error);
    return { error: 'Error de conexión' };
  }
};

// ========================================================
// MÓDULO 5: MENSAJES DE ALIENTO Y TESTIMONIOS
// ========================================================

// 12. Obtener mensajes de aliento dejados por donantes
export const getMensajes = async (abuelitoId) => {
  try {
    const res = await fetch(`${API_URL}/mensajes/${abuelitoId}`, {
      headers: { 'Bypass-Tunnel-Reminder': 'true' }
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error('Error al consultar mensajes:', error);
    return [];
  }
};

// 13. Publicar un nuevo mensaje de aliento
export const createMensaje = async (data) => {
  try {
    const res = await fetch(`${API_URL}/mensajes`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json', 
        'Bypass-Tunnel-Reminder': 'true' 
      },
      body: JSON.stringify(data)
    });
    return await res.json();
  } catch (error) {
    console.error('Error al enviar mensaje:', error);
    return { error: 'Error de conexión' };
  }
};

// ========================================================
// MÓDULO 6: PANEL DE ADMINISTRACIÓN CENTRAL (SUPER ADMIN)
// ========================================================

// 14. Resumen general de métricas para el panel administrativo
export const getAdminResumen = async () => {
  try {
    const res = await fetch(`${API_URL}/admin/resumen`, {
      headers: { 'Bypass-Tunnel-Reminder': 'true' }
    });
    if (!res.ok) {
      return { total_activos: 0, total_pendientes: 0, total_donado: 0, total_entregas: 0 };
    }
    return await res.json();
  } catch (error) {
    console.error('Error al consultar resumen admin:', error);
    return { total_activos: 0, total_pendientes: 0, total_donado: 0, total_entregas: 0 };
  }
};

// 15. Consultar casos pendientes de validación
export const getCasosPendientes = async () => {
  try {
    const res = await fetch(`${API_URL}/admin/pendientes`, {
      headers: { 'Bypass-Tunnel-Reminder': 'true' }
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error('Error al consultar casos pendientes:', error);
    return [];
  }
};

// 16. Aprobar caso asignándole autoridad y bodega verificada
export const aprobarCaso = async (id, data) => {
  try {
    const res = await fetch(`${API_URL}/admin/aprobar/${id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json', 
        'Bypass-Tunnel-Reminder': 'true' 
      },
      body: JSON.stringify(data)
    });
    return await res.json();
  } catch (error) {
    console.error('Error al aprobar caso:', error);
    return { error: 'Error de conexión' };
  }
};

// 17. Descartar o eliminar un caso
export const eliminarCaso = async (id) => {
  try {
    const res = await fetch(`${API_URL}/admin/eliminar/${id}`, {
      method: 'DELETE',
      headers: { 'Bypass-Tunnel-Reminder': 'true' }
    });
    return await res.json();
  } catch (error) {
    console.error('Error al eliminar caso:', error);
    return { error: 'Error de conexión' };
  }
};

// Autenticación de Donantes
export const registroDonante = async (data) => {
  try {
    const res = await fetch(`${API_URL}/auth/registro`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Bypass-Tunnel-Reminder': 'true' },
      body: JSON.stringify(data)
    });
    return await res.json();
  } catch (error) {
    return { error: 'Error de conexión' };
  }
};

export const loginDonante = async (data) => {
  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Bypass-Tunnel-Reminder': 'true' },
      body: JSON.stringify(data)
    });
    return await res.json();
  } catch (error) {
    return { error: 'Error de conexión' };
  }
};

export const getDonantesAbuelito = async (abuelitoId) => {
  try {
    const res = await fetch(`${API_URL}/abuelitos/${abuelitoId}/donantes`, { headers: { 'Bypass-Tunnel-Reminder': 'true' } });
    return await res.json();
  } catch (error) {
    return [];
  }
};

export const toggleFavorito = async (usuario_donante_id, abuelito_id) => {
  try {
    const res = await fetch(`${API_URL}/favoritos/toggle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Bypass-Tunnel-Reminder': 'true' },
      body: JSON.stringify({ usuario_donante_id, abuelito_id })
    });
    return await res.json();
  } catch (error) {
    return { esFavorito: false };
  }
};

export const getMisFavoritos = async (usuario_id) => {
  try {
    const res = await fetch(`${API_URL}/favoritos/${usuario_id}`, { headers: { 'Bypass-Tunnel-Reminder': 'true' } });
    return await res.json();
  } catch (error) {
    return [];
  }
};

// Obtener ajustes de la portada
export const getHeroConfig = async () => {
  try {
    const res = await fetch(`${API_URL}/hero`, { headers: { 'Bypass-Tunnel-Reminder': 'true' } });
    return await res.json();
  } catch (error) {
    return {
      tagline: 'CONECTANDO CORAZONES, TRANSFORMANDO VIDAS:',
      titulo: 'Apadrina una Sonrisa en el Perú Profundo',
      foto_banner_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200',
      color_fondo: '#1E232B'
    };
  }
};

// Guardar ajustes de la portada desde el Admin
export const updateHeroConfig = async (formData) => {
  try {
    const res = await fetch(`${API_URL}/admin/hero`, {
      method: 'POST',
      headers: { 'Bypass-Tunnel-Reminder': 'true' },
      body: formData
    });
    return await res.json();
  } catch (error) {
    return { error: 'Error al conectar' };
  }
};

export const loginBodega = async (data) => {
  try {
    const res = await fetch(`${API_URL}/auth/bodega-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Bypass-Tunnel-Reminder': 'true' },
      body: JSON.stringify(data)
    });
    return await res.json();
  } catch (error) {
    return { error: 'Error de conexión' };
  }
};

export const cambiarPasswordDonante = async (usuario_id, nueva_password) => {
  try {
    const res = await fetch(`${API_URL}/auth/cambiar-password`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Bypass-Tunnel-Reminder': 'true' },
      body: JSON.stringify({ usuario_id, nueva_password })
    });
    return await res.json();
  } catch (error) {
    return { error: 'Error de conexión' };
  }
};

export const getMisDonaciones = async (usuario_id) => {
  try {
    const res = await fetch(`${API_URL}/donaciones/usuario/${usuario_id}`, { headers: { 'Bypass-Tunnel-Reminder': 'true' } });
    if (res.ok) return await res.json();
  } catch (error) {}
  return [];
};

export const getDonacionesPendientes = async () => {
  try {
    const res = await fetch(`${API_URL}/admin/donaciones-pendientes`, { headers: { 'Bypass-Tunnel-Reminder': 'true' } });
    if (res.ok) return await res.json();
  } catch (error) {}
  return [];
};

export const validarDonacionAdmin = async (id) => {
  try {
    const res = await fetch(`${API_URL}/admin/donaciones/validar/${id}`, {
      method: 'PUT',
      headers: { 'Bypass-Tunnel-Reminder': 'true' }
    });
    return await res.json();
  } catch (error) {
    return { error: 'Error de conexión' };
  }
};

export const rechazarDonacionAdmin = async (id) => {
  try {
    const res = await fetch(`${API_URL}/admin/donaciones/rechazar/${id}`, {
      method: 'DELETE',
      headers: { 'Bypass-Tunnel-Reminder': 'true' }
    });
    return await res.json();
  } catch (error) {
    return { error: 'Error de conexión' };
  }
};

export const getAdminBodegas = async () => {
  try {
    const res = await fetch(`${API_URL}/admin/bodegas`, { headers: { 'Bypass-Tunnel-Reminder': 'true' } });
    if (res.ok) return await res.json();
  } catch (error) {}
  return [];
};

export const crearBodegaAdmin = async (data) => {
  try {
    const res = await fetch(`${API_URL}/admin/bodegas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Bypass-Tunnel-Reminder': 'true' },
      body: JSON.stringify(data)
    });
    return await res.json();
  } catch (error) {
    return { error: 'Error de conexión' };
  }
};

export const toggleEstadoBodega = async (id) => {
  try {
    const res = await fetch(`${API_URL}/admin/bodegas/toggle-estado/${id}`, {
      method: 'PUT',
      headers: { 'Bypass-Tunnel-Reminder': 'true' }
    });
    return await res.json();
  } catch (error) {
    return { error: 'Error de conexión' };
  }
};

export const toggleEstadoAbuelito = async (id) => {
  try {
    const res = await fetch(`${API_URL}/admin/abuelitos/toggle-estado/${id}`, {
      method: 'PUT',
      headers: { 'Bypass-Tunnel-Reminder': 'true' }
    });
    return await res.json();
  } catch (error) {
    return { error: 'Error de conexión' };
  }
};
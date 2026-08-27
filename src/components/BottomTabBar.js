import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform } from 'react-native';

export default function BottomTabBar({ currentView, onNavigate, usuarioSesion, onOpenAuth }) {
  const tabs = [
    { id: 'home', label: 'Inicio', icon: '🏠' },
    { id: 'directory_search', label: 'Explorar', icon: '🔍' },
    { id: 'favorites', label: 'Favoritos', icon: '❤️' },
    { id: 'account', label: usuarioSesion ? 'Mi Cuenta' : 'Ingresar', icon: '👤' },
  ];

  const handleTabPress = (tabId) => {
    if (tabId === 'favorites' && !usuarioSesion) {
      onOpenAuth();
      return;
    }
    if (tabId === 'account') {
      if (!usuarioSesion) onOpenAuth();
      else onNavigate('account');
      return;
    }
    onNavigate(tabId);
  };

  return (
    <View style={styles.tabBarContainer}>
      {tabs.map((tab) => {
        const isActive = currentView === tab.id;
        return (
          <TouchableOpacity
            key={tab.id}
            style={styles.tabItem}
            onPress={() => handleTabPress(tab.id)}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabIcon, isActive && styles.tabIconActive]}>{tab.icon}</Text>
            <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderColor: '#E2E8F0',
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 26 : 10,
    justifyContent: 'space-around',
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
  },
  tabItem: { alignItems: 'center', justifyContent: 'center', flex: 1 },
  tabIcon: { fontSize: 20, marginBottom: 3, opacity: 0.55 },
  tabIconActive: { opacity: 1, transform: [{ scale: 1.15 }] },
  tabLabel: { fontSize: 11, fontWeight: '600', color: '#64748B' },
  tabLabelActive: { color: '#FF385C', fontWeight: 'bold' },
});
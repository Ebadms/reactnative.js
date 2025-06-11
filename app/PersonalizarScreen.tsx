import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import DraggableFlatList, { RenderItemParams } from 'react-native-draggable-flatlist';
import { SafeAreaView } from 'react-native-safe-area-context';

const SERVICES = [
  { key: 'cuenta', icon: 'wallet-outline', label: 'CUENTA', color: '#e6007a' },
  { key: 'deposito', icon: 'bank', label: 'DEPÓSITO', color: '#00e6e6' },
  { key: 'medios', icon: 'credit-card-outline', label: 'MEDIOS DE PAGO', color: '#00e6e6' },
  { key: 'cajeros', icon: 'cash-multiple', label: 'CAJEROS', color: '#a259e6' },
  { key: 'inversiones', icon: 'chart-line', label: 'INVERSIONES', color: '#39d353' },
  { key: 'financiacion', icon: 'file-document-edit-outline', label: 'FINANCIACIÓN', color: '#e6007a' },
  { key: 'seguros', icon: 'shield-check-outline', label: 'SEGUROS', color: '#ffd600' },
  { key: 'hucha', icon: 'piggy-bank-outline', label: 'HUCHA INTELIGENTE', color: '#00e6e6' },
  { key: 'calendario', icon: 'calendar-month-outline', label: 'CALENDARIO', color: '#e6007a' },
  { key: 'evoplace', icon: 'storefront-outline', label: 'EVO PLACE', color: '#ffd600' },
  { key: 'evofit', icon: 'chart-pie', label: 'EVOFIT', color: '#a259e6' },
];

export default function PersonalizarScreen() {
  const router = useRouter();
  const [data, setData] = useState(SERVICES);

  const renderItem = ({ item, drag, isActive }: RenderItemParams<typeof SERVICES[0]>) => (
    <TouchableOpacity
      style={[styles.card, isActive && { opacity: 0.85 }]}
      onLongPress={drag}
      delayLongPress={120}
      activeOpacity={0.95}
    >
      <View style={styles.cardRow}>
        <MaterialCommunityIcons name={item.icon as any} size={32} color={item.color} style={styles.cardIcon} />
        <Text style={styles.cardLabel}>{item.label}</Text>
        <MaterialCommunityIcons name="drag-horizontal-variant" size={32} color={item.color} style={styles.cardDrag} />
      </View>
      <View style={[styles.cardUnderline, { backgroundColor: item.color }]} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <ImageBackground
        source={require('../assets/images/background.jpg')}
        style={StyleSheet.absoluteFill}
        imageStyle={{ width: '100%', height: '100%' }}
        resizeMode="cover"
      >
        <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill} />
      </ImageBackground>
      <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
        <Ionicons name="close" size={44} color="#fff" />
      </TouchableOpacity>
      <Text style={styles.title}>Personalizar</Text>
      <View style={{ flex: 1, width: '100%' }}>
        <DraggableFlatList
          data={data}
          onDragEnd={({ data }) => setData(data)}
          keyExtractor={item => item.key}
          renderItem={renderItem}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: 100 }]}
          showsVerticalScrollIndicator={false}
        />
      </View>
      <SafeAreaView edges={['bottom']} style={styles.saveBarSafeFixed}>
        <TouchableOpacity style={styles.saveBtn} activeOpacity={0.8}>
          <Text style={styles.saveBtnText}>GUARDAR CAMBIOS</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: 'transparent' },
  closeBtn: { position: 'absolute', top: 32, right: 24, zIndex: 10 },
  title: { color: '#fff', fontSize: 28, fontWeight: '400', textAlign: 'center', marginTop: 32, marginBottom: 18 },
  scrollContent: { paddingHorizontal: 12, paddingBottom: 40 },
  card: { backgroundColor: 'rgba(255,255,255,0.10)', borderRadius: 16, marginBottom: 18, paddingHorizontal: 18, paddingTop: 18, paddingBottom: 0, elevation: 2 },
  cardRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  cardIcon: { marginRight: 14 },
  cardLabel: { color: '#fff', fontWeight: 'bold', fontSize: 18, flex: 1 },
  cardDrag: { marginLeft: 10 },
  cardUnderline: { height: 3, borderRadius: 2, marginBottom: 0 },
  saveBarSafe: { backgroundColor: 'transparent', paddingHorizontal: 18, paddingBottom: 10 },
  saveBarSafeFixed: { backgroundColor: 'transparent', paddingHorizontal: 18, paddingBottom: 10, position: 'absolute', left: 0, right: 0, bottom: 0 },
  saveBtn: { backgroundColor: '#e6007a', borderRadius: 8, alignItems: 'center', paddingVertical: 18 },
  saveBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 18, letterSpacing: 1 },
}); 
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DomiciliacionesScreen() {
  const router = useRouter();
  const [tab, setTab] = useState(0);
  const [domiciliaciones, setDomiciliaciones] = useState<any[]>([]);

  useEffect(() => {
    AsyncStorage.getItem('domiciliaciones').then(data => {
      if (data) setDomiciliaciones(JSON.parse(data));
      else setDomiciliaciones([]);
    });
  }, []);

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
      <View style={styles.topSection}>
        <Text style={styles.title}>Domiciliaciones</Text>
        <MaterialCommunityIcons name="file-document-multiple-outline" size={48} color="#fff" style={styles.centerIcon} />
        <Text style={styles.heading}>Gestiona los pagos</Text>
        <Text style={styles.subheading}>Gestiona y controla el pago de tus recibos mensuales.</Text>
        <View style={styles.tabsRow}>
          <TouchableOpacity style={[styles.tabBtn, tab === 0 && styles.tabBtnActive]} onPress={() => setTab(0)}>
            <Text style={[styles.tabText, tab === 0 && styles.tabTextActive]}>DOCIMICILIACIONES</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.tabBtn, tab === 1 && styles.tabBtnActive]} onPress={() => setTab(1)}>
            <Text style={[styles.tabText, tab === 1 && styles.tabTextActive]}>SUSCRIPCIONES BIZUM</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.whiteSheet}>
        {tab === 0 ? (
          <>
            <ScrollView contentContainerStyle={styles.listSection} showsVerticalScrollIndicator={false}>
              {domiciliaciones.length === 0 ? (
                <Text style={styles.emptyListText}>No hay domiciliaciones disponibles.</Text>
              ) : domiciliaciones.map((item, idx) => (
                <View style={styles.listItem} key={idx}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.listName}>{item.name}</Text>
                    <Text style={styles.listNumber}>Nº de domiciliación: {item.number}</Text>
                    <Text style={styles.listLast}>Último recibo: {item.last}</Text>
                  </View>
                  <Text style={styles.listAmount}>{item.amount}</Text>
                </View>
              ))}
            </ScrollView>
            <SafeAreaView edges={['bottom']} style={styles.fabBarSafe}>
              <TouchableOpacity style={styles.fab} activeOpacity={0.7}>
                <MaterialCommunityIcons name="apps" size={36} color="#fff" />
              </TouchableOpacity>
            </SafeAreaView>
          </>
        ) : (
          <View style={styles.emptySection}>
            <MaterialCommunityIcons name="file-cancel-outline" size={54} color="#bbb" style={{ marginBottom: 10 }} />
            <Text style={styles.emptyTextBizum}>En estos momentos no podemos mostrarte tus suscripciones de Bizum, inténtalo de nuevo más tarde.</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: 'transparent' },
  closeBtn: { position: 'absolute', top: 32, right: 24, zIndex: 10 },
  topSection: { paddingHorizontal: 18, paddingTop: 32, paddingBottom: 0 },
  title: { color: '#fff', fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  centerIcon: { alignSelf: 'center', marginBottom: 10 },
  heading: { color: '#fff', fontSize: 28, fontWeight: '300', textAlign: 'center', marginBottom: 4 },
  subheading: { color: '#fff', fontSize: 16, textAlign: 'center', marginBottom: 18 },
  tabsRow: { flexDirection: 'row', marginBottom: 0, borderBottomWidth: 2, borderBottomColor: '#eee' },
  tabBtn: { flex: 1, alignItems: 'center', paddingVertical: 12, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabBtnActive: { borderBottomColor: '#e6007a' },
  tabText: { color: '#888', fontWeight: 'bold', fontSize: 15 },
  tabTextActive: { color: '#e6007a' },
  whiteSheet: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -8,
    paddingTop: 12,
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: -2 },
    minHeight: 200,
  },
  listSection: { paddingHorizontal: 0, paddingBottom: 100 },
  listItem: { flexDirection: 'row', alignItems: 'flex-start', borderBottomWidth: 1, borderBottomColor: '#eee', paddingVertical: 16, paddingHorizontal: 18 },
  listName: { color: '#222', fontWeight: 'bold', fontSize: 16, marginBottom: 2 },
  listNumber: { color: '#888', fontSize: 13 },
  listLast: { color: '#888', fontSize: 13 },
  listAmount: { color: '#e6007a', fontWeight: 'bold', fontSize: 18, marginLeft: 10 },
  emptySection: { flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 60 },
  emptyText: { color: '#888', fontSize: 16, textAlign: 'center' },
  emptyListText: { color: '#888', fontSize: 16, textAlign: 'center', marginTop: 40 },
  emptyTextBizum: { color: '#888', fontSize: 16, textAlign: 'center', marginTop: 0, marginHorizontal: 24 },
  fabBarSafe: { alignItems: 'center', backgroundColor: 'transparent', paddingBottom: 10 },
  fab: {
    position: 'absolute',
    bottom: 24,
    alignSelf: 'center',
    backgroundColor: '#e6007a',
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
}); 
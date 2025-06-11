import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

function InfoBanner() {
  return (
    <View style={styles.infoBanner}>
      <MaterialCommunityIcons name="lightbulb-on-outline" size={28} color="#e6007a" style={{ marginRight: 10 }} />
      <View style={{ flex: 1 }}>
        <Text style={styles.infoText}>
          Puede que no veas reflejada tu compra aún por diferentes motivos.
        </Text>
        <TouchableOpacity>
          <Text style={styles.infoLink}>SABER MÁS <Ionicons name="chevron-forward" size={16} color="#e6007a" /></Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function CashbackEmptyCard() {
  return (
    <View style={styles.emptyCard}>
      <Image source={require('../assets/images/cashback.jpg')} style={styles.emptyImg} resizeMode="cover" />
      <Text style={styles.emptyTitle}>Aún no has recibido ningún Cashback</Text>
      <Text style={styles.emptyDesc}>Usa tu tarjeta EVO en comercios seleccionados y recibe los Cashback.</Text>
      <TouchableOpacity style={styles.pinkBtn2}>
        <Text style={styles.pinkBtnText2}>VER CASHBACKS DISPONIBLES</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function CashbackScreen() {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <BlurView intensity={60} tint="dark" style={StyleSheet.absoluteFill} />
      {/* Top right close and info */}
      <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
        <Ionicons name="close" size={44} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.infoBtn}>
        <Ionicons name="information-circle-outline" size={36} color="#fff" />
      </TouchableOpacity>
      <ScrollView contentContainerStyle={styles.scrollContent} style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <Text style={styles.header}>Cashback</Text>
        <MaterialCommunityIcons name="percent-outline" size={48} color="#e6007a" style={styles.topIcon} />
        <Text style={styles.totalLabel}>TOTAL AHORRADO</Text>
        <Text style={styles.totalAmount}>0,00 €</Text>
        <View style={styles.divider} />
        <InfoBanner />
        <CashbackEmptyCard />
      </ScrollView>
      <SafeAreaView edges={['bottom']} style={styles.fabBarSafe}>
        <TouchableOpacity style={styles.fab} activeOpacity={0.7}>
          <MaterialCommunityIcons name="apps" size={36} color="#fff" />
        </TouchableOpacity>
      </SafeAreaView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: 'transparent' },
  scrollContent: { paddingHorizontal: 16, paddingTop: 32, paddingBottom: 140, width: '100%' },
  fabBarSafe: { position: 'absolute', left: 0, right: 0, bottom: 0, alignItems: 'center', backgroundColor: 'transparent', paddingBottom: 20}, // Add some padding from bottom },
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  closeBtn: { position: 'absolute', top: 32, right: 24, zIndex: 10 },
  infoBtn: { position: 'absolute', top: 36, right: 80, zIndex: 10 },
  header: { color: '#fff', fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginTop: 12, marginBottom: 18 },
  topIcon: { alignSelf: 'center', marginBottom: 8 },
  totalLabel: { color: '#fff', fontWeight: 'bold', fontSize: 15, textAlign: 'center', marginTop: 0, letterSpacing: 1 },
  totalAmount: { color: '#fff', fontSize: 44, fontWeight: '300', textAlign: 'center', marginBottom: 8 },
  divider: { height: 2, backgroundColor: '#e6007a', width: '90%', alignSelf: 'center', marginVertical: 16, borderRadius: 2 },
  infoBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 12, padding: 12, marginBottom: 18, width: '100%' },
  infoText: { color: '#fff', fontSize: 15, fontWeight: '400' },
  infoLink: { color: '#e6007a', fontWeight: 'bold', fontSize: 15, marginTop: 4 },
  emptyCard: { backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 18, alignItems: 'center', padding: 18, width: '100%', marginTop: 0 },
  emptyImg: { width: width - 64, height: 140, borderRadius: 12, marginBottom: 18 },
  emptyTitle: { color: '#fff', fontSize: 32, fontWeight: '300', textAlign: 'center', marginBottom: 12 },
  emptyDesc: { color: '#fff', fontSize: 16, textAlign: 'center', marginBottom: 18 },
  pinkBtn2: { backgroundColor: '#e6007a', borderRadius: 6, alignItems: 'center', paddingVertical: 16, paddingHorizontal: 24, marginTop: 8, width: '100%' },
  pinkBtnText2: { color: '#fff', fontWeight: 'bold', fontSize: 16, letterSpacing: 1 },
  fab: {
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
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CorreosCashScreen() {
  const router = useRouter();
  const [showBanner, setShowBanner] = useState(true);
  const [checked, setChecked] = useState(false);
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
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {showBanner && (
          <View style={styles.banner}>
            <MaterialCommunityIcons name="alert-circle-outline" size={28} color="#ff4081" style={{ marginRight: 10 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.bannerTitle}>¡Correos Cash! Últimos días para realizar tus ingresos</Text>
              <Text style={styles.bannerText}>El día 03/07/25 el servicio de Correos Cash dejará de estar disponible. Aprovecha para realizar antes tus ingresos.</Text>
            </View>
            <TouchableOpacity onPress={() => setShowBanner(false)} style={{ marginLeft: 8 }}>
              <Ionicons name="close" size={28} color="#fff" />
            </TouchableOpacity>
          </View>
        )}
        <View style={styles.centerContent}>
          <MaterialCommunityIcons name="crown-circle-outline" size={54} color="#fff" style={styles.centerIcon} />
          <Text style={styles.header}>Correos Cash</Text>
          <Text style={styles.desc}>Ya puedes enviar dinero en efectivo a tu cuenta EVO desde las oficinas de Correos de España.</Text>
        </View>
        <View style={styles.infoRow}>
          <View style={styles.infoIconWrap}>
            <MaterialCommunityIcons name="cellphone-message" size={28} color="#fff" />
          </View>
          <View style={styles.infoTextWrap}>
            <Text style={styles.infoTitle}>Genera el código</Text>
            <Text style={styles.infoDesc}>Para crear el código solo necesitas unos simples datos: tu cuenta EVO donde quieres recibir el dinero, el remitente y el importe. ¡Y listo! Puedes descargar el código o compartirlo.</Text>
          </View>
        </View>
        <View style={styles.infoRow}>
          <View style={styles.infoIconWrap}>
            <MaterialCommunityIcons name="eye-outline" size={28} color="#fff" />
          </View>
          <View style={styles.infoTextWrap}>
            <Text style={styles.infoTitle}>Acércate a una oficina de Correos</Text>
            <Text style={styles.infoDesc}>Lleva el código junto con el documento de identificación a la oficina de Correos que prefieras.</Text>
          </View>
        </View>
        <View style={styles.infoRow}>
          <View style={styles.infoIconWrap}>
            <MaterialCommunityIcons name="credit-card-fast-outline" size={28} color="#fff" />
          </View>
          <View style={styles.infoTextWrap}>
            <Text style={styles.infoTitle}>Tu dinero inmediato</Text>
            <Text style={styles.infoDesc}>El dinero está disponible de forma inmediata, sin esperas.</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.checkboxRow} onPress={() => setChecked(v => !v)} activeOpacity={0.7}>
          <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
            {checked && <Ionicons name="checkmark" size={18} color="#fff" />}
          </View>
          <Text style={styles.checkboxLabel}>Acepto los <Text style={styles.link}>términos y condiciones del servicio</Text>.</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.continueBtn, !checked && { opacity: 0.5 }]} disabled={!checked}>
          <Text style={styles.continueBtnText}>CONTINUAR</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: 'transparent' },
  closeBtn: { position: 'absolute', top: 32, right: 24, zIndex: 10 },
  scrollContent: { paddingHorizontal: 18, paddingTop: 32, paddingBottom: 40 },
  banner: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: 'rgba(255,255,255,0.10)', borderRadius: 12, padding: 12, marginBottom: 18 },
  bannerTitle: { color: '#ff4081', fontWeight: 'bold', fontSize: 15, marginBottom: 2 },
  bannerText: { color: '#fff', fontSize: 14 },
  centerContent: { alignItems: 'center', marginBottom: 24 },
  centerIcon: { marginBottom: 10 },
  header: { color: '#fff', fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 8 },
  desc: { color: '#fff', fontSize: 16, textAlign: 'center', marginBottom: 18 },
  infoRow: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: 12, padding: 14, marginBottom: 14 },
  infoIconWrap: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#ff4081', alignItems: 'center', justifyContent: 'center', marginRight: 14, marginTop: 2 },
  infoTextWrap: { flex: 1 },
  infoTitle: { color: '#fff', fontWeight: 'bold', fontSize: 16, marginBottom: 2 },
  infoDesc: { color: '#fff', fontSize: 15 },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', marginTop: 18, marginBottom: 18 },
  checkbox: { width: 24, height: 24, borderRadius: 6, borderWidth: 2, borderColor: '#fff', alignItems: 'center', justifyContent: 'center', marginRight: 10, backgroundColor: 'rgba(255,255,255,0.08)' },
  checkboxChecked: { backgroundColor: '#ff4081', borderColor: '#ff4081' },
  checkboxLabel: { color: '#fff', fontSize: 15 },
  link: { color: '#ff4081', textDecorationLine: 'underline' },
  continueBtn: { backgroundColor: '#e6007a', borderRadius: 8, alignItems: 'center', paddingVertical: 18, marginTop: 8 },
  continueBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 18, letterSpacing: 1 },
}); 
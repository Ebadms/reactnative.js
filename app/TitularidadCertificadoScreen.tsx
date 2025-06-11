import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const CERT_OPTIONS = [
  'Titularidad de cuenta',
  'Titularidad de cuenta con segundos titulares',
];

export default function TitularidadCertificadoScreen() {
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(CERT_OPTIONS[0]);
  const [account, setAccount] = useState<any>(null);

  useEffect(() => {
    AsyncStorage.getItem('accountData').then(data => {
      if (data) setAccount(JSON.parse(data));
    });
  }, []);

  const maskedAccount = account?.name
    ? `${account.name} **** ${account.iban?.slice(-4) || '----'}`
    : '----';

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
        <Text style={styles.header}>Titularidad de cuenta</Text>
        <Text style={styles.subHeader}>Selecciona la cuenta de la que quieres obtener el certificado de titularidad.</Text>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>CUENTAS (OBLIGATORIO)</Text>
          <View style={styles.accountRow}>
            <MaterialCommunityIcons name="credit-card-outline" size={28} color="#fff" style={{ marginRight: 10 }} />
            <Text style={styles.accountText}>{maskedAccount}</Text>
          </View>
        </View>
        <View style={[styles.card, { marginBottom: dropdownOpen ? 0 : 18 }]}> 
          <TouchableOpacity style={styles.dropdownRow} activeOpacity={0.8} onPress={() => setDropdownOpen(v => !v)}>
            <MaterialCommunityIcons name="file-document-outline" size={28} color="#fff" style={{ marginRight: 10 }} />
            <Text style={styles.cardLabel}>TIPO DE CERTIFICADO</Text>
            <Ionicons name={dropdownOpen ? 'chevron-up' : 'chevron-down'} size={28} color="#fff" style={{ marginLeft: 'auto' }} />
          </TouchableOpacity>
          {!dropdownOpen && (
            <Text style={styles.accountText}>{selectedOption}</Text>
          )}
          {dropdownOpen && (
            <View style={styles.dropdownOptions}>
              {CERT_OPTIONS.map(option => (
                <TouchableOpacity
                  key={option}
                  style={styles.dropdownOptionRow}
                  onPress={() => { setSelectedOption(option); setDropdownOpen(false); }}
                  activeOpacity={0.8}
                >
                  <View style={styles.radioOuter}>
                    {selectedOption === option && <View style={styles.radioInner} />}
                  </View>
                  <Text style={styles.dropdownOptionText}>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
      <SafeAreaView edges={['bottom']} style={styles.downloadBtnBar}>
        <TouchableOpacity style={styles.downloadBtn} activeOpacity={0.8}>
          <Text style={styles.downloadBtnText}>DESCARGAR CERTIFICADO</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: 'transparent' },
  closeBtn: { position: 'absolute', top: 32, right: 24, zIndex: 10 },
  scrollContent: { paddingHorizontal: 18, paddingTop: 32, paddingBottom: 40 },
  header: { color: '#fff', fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  subHeader: { color: '#fff', fontSize: 15, textAlign: 'center', marginBottom: 18 },
  card: {
    backgroundColor: 'rgba(0,0,0,0.0)',
    borderRadius: 12,
    padding: 18,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  cardLabel: { color: '#fff', fontWeight: 'bold', fontSize: 15, marginBottom: 6 },
  accountRow: { flexDirection: 'row', alignItems: 'center' },
  accountText: { color: '#fff', fontSize: 17, fontWeight: 'bold', marginTop: 2 },
  dropdownRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  dropdownOptions: { marginTop: 8 },
  dropdownOptionRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#e6007a',
  },
  dropdownOptionText: { color: '#fff', fontSize: 16 },
  downloadBtnBar: {
    backgroundColor: 'transparent',
    paddingHorizontal: 18,
    paddingBottom: 10,
  },
  downloadBtn: { backgroundColor: '#e6007a', borderRadius: 8, alignItems: 'center', paddingVertical: 18 },
  downloadBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 18, letterSpacing: 1 },
}); 
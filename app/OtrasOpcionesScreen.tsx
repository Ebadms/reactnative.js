import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import React from 'react';
import { ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const OPTIONS = [
  {
    icon: <MaterialCommunityIcons name="file-document-multiple-outline" size={28} color="#fff" />,
    title: 'Domiciliaciones y recibos',
    desc: 'Gestiona tus domiciliaciones y recibos.',
    key: 'domiciliaciones',
    nav: '/DomiciliacionesScreen',
  },
  {
    icon: <MaterialCommunityIcons name="file-document-outline" size={28} color="#fff" />,
    title: 'Pago de recibos',
    desc: 'Paga tus recibos.',
    key: 'pago',
  },
  {
    icon: <MaterialCommunityIcons name="currency-eur" size={28} color="#fff" />,
    title: 'EVO Travel Cash',
    desc: 'Tu servicio online para comprar moneda extranjera.',
    key: 'travel',
  },
];

export default function OtrasOpcionesScreen() {
  const router = useRouter();
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
      <View style={styles.bottomSheet}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
            <Ionicons name="arrow-back" size={32} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.title}>Otras opciones</Text>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
            <Ionicons name="close" size={32} color="#fff" />
          </TouchableOpacity>
        </View>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {OPTIONS.map(opt => (
            <TouchableOpacity
              style={styles.optionCard}
              key={opt.key}
              activeOpacity={0.8}
              onPress={() => opt.nav && router.push(opt.nav)}
            >
              <View style={styles.optionIconWrap}>{opt.icon}</View>
              <View style={styles.optionTextWrap}>
                <Text style={styles.optionTitle}>{opt.title}</Text>
                <Text style={styles.optionDesc}>{opt.desc}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: 'transparent' },
  bottomSheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#111',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    paddingTop: 12,
    paddingBottom: 24,
    paddingHorizontal: 0,
    minHeight: '38%',
    maxHeight: '90%',
    height: undefined,
    elevation: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    marginBottom: 10,
  },
  iconBtn: {
    padding: 4,
  },
  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 12,
    paddingBottom: 20,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 12,
    padding: 18,
    marginBottom: 16,
  },
  optionIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#222',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  optionTextWrap: {
    flex: 1,
  },
  optionTitle: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  optionDesc: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.85,
  },
}); 
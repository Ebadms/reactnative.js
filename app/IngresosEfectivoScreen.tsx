import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import React from 'react';
import { ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function IngresosEfectivoScreen() {
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
          <Text style={styles.title}>Ingresos de efectivo</Text>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
            <Ionicons name="close" size={32} color="#fff" />
          </TouchableOpacity>
        </View>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <TouchableOpacity style={styles.optionCard} activeOpacity={0.8} onPress={() => router.push('/CorreosCashScreen')}>
            <View style={styles.optionIconWrap}>
              <MaterialCommunityIcons name="crown-circle-outline" size={36} color="#fff" />
            </View>
            <View style={styles.optionTextWrap}>
              <Text style={styles.optionTitle}>Correos Cash</Text>
              <Text style={styles.optionDesc}>Envía dinero en efectivo desde las oficinas de Correos.</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionCard} activeOpacity={0.8}>
            <View style={styles.optionIconWrap}>
              <MaterialCommunityIcons name="atm" size={36} color="#fff" />
            </View>
            <View style={styles.optionTextWrap}>
              <Text style={styles.optionTitle}>Cajeros</Text>
              <Text style={styles.optionDesc}>Encuentra tu punto más cercano y realiza ingreso de efectivo.</Text>
            </View>
          </TouchableOpacity>
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
    minHeight: 260,
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
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  optionDesc: {
    color: '#bbb',
    fontSize: 15,
  },
}); 
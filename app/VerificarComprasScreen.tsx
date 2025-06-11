import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function VerificarComprasScreen() {
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
      {/* Top right close and info */}
      <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
        <Ionicons name="close" size={44} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.infoBtn}>
        <Ionicons name="information-circle-outline" size={36} color="#fff" />
      </TouchableOpacity>
      <View style={styles.centerContent}>
        <Text style={styles.header}>Importe a cargar en tu cuenta</Text>
        <MaterialCommunityIcons name="file-cancel-outline" size={90} color="#fff" style={styles.centerIcon} />
        <Text style={styles.emptyTitle}>No hay compras pendientes de validación.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: 'transparent' },
  closeBtn: { position: 'absolute', top: 32, right: 24, zIndex: 10 },
  infoBtn: { position: 'absolute', top: 36, right: 80, zIndex: 10 },
  centerContent: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 },
  header: { color: '#fff', fontSize: 24, fontWeight: '400', textAlign: 'center', marginBottom: 40, marginTop: 60 },
  centerIcon: { marginBottom: 40 },
  emptyTitle: { color: '#fff', fontSize: 28, fontWeight: '300', textAlign: 'center', marginBottom: 12 },
}); 
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

function Warning() {
  return (
    <View style={styles.warningWrap}>
      <MaterialCommunityIcons name="alert-outline" size={36} color="#fff" style={{ marginBottom: 8 }} />
      <Text style={styles.warningText}>
        Las operaciones pendientes serán canceladas en caso de cambio de banco.
      </Text>
    </View>
  );
}

export default function BizumScreen() {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <BlurView intensity={60} tint="dark" style={StyleSheet.absoluteFill} />
      <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
        <Ionicons name="close" size={44} color="#fff" />
      </TouchableOpacity>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <MaterialCommunityIcons name="content-copy" size={48} color="#fff" style={styles.icon} />
          <Text style={styles.title}>Elígenos</Text>
          <Text style={styles.desc}>
            Hemos detectado que ya estás dado de alta con otra entidad. Para disfrutar de Bizum en Banca Móvil primero tienes que darte de baja.
          </Text>
          <Warning />
        </View>
      </ScrollView>
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.pinkBtn}>
          <Text style={styles.pinkBtnText}>SOLICITAR BAJA</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: 'transparent' },
  scrollContent: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', width: '100%' },
  closeBtn: { position: 'absolute', top: 32, right: 24, zIndex: 10 },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', width: '90%' },
  icon: { marginBottom: 18 },
  title: { color: '#fff', fontSize: 36, fontWeight: '300', marginBottom: 18, textAlign: 'center' },
  desc: { color: '#fff', fontSize: 17, textAlign: 'center', marginBottom: 32, fontWeight: '400' },
  warningWrap: { alignItems: 'center', marginBottom: 32 },
  warningText: { color: '#fff', fontSize: 16, textAlign: 'center', fontWeight: '400' },
  bottomBar: { paddingBottom: 0, paddingTop: 0, backgroundColor: 'transparent' },
  pinkBtn: { marginHorizontal: 20, marginBottom: 24, backgroundColor: '#e6007a', borderRadius: 6, alignItems: 'center', paddingVertical: 18 },
  pinkBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 18, letterSpacing: 1 },
}); 
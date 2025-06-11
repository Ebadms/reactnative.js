import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HalCashScreen() {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <BlurView intensity={60} tint="dark" style={StyleSheet.absoluteFill} />
      <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
        <Ionicons name="close" size={44} color="#fff" />
      </TouchableOpacity>
      <View style={styles.content}>
        <MaterialCommunityIcons name="cellphone" size={64} color="#fff" style={styles.icon} />
        <Text style={styles.title}>Hal-Cash</Text>
        <Text style={styles.desc}>Hal-Cash te permite enviar dinero a un cajero para poder retirarlo sin la necesidad de una tarjeta. Todo de manera inmediata y segura.</Text>
      </View>
      <SafeAreaView edges={['bottom']} style={styles.fabBarSafe}>
        <TouchableOpacity style={styles.pinkBtn}>
          <Text style={styles.pinkBtnText}>COMENZAR</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: 'transparent' },
  closeBtn: { position: 'absolute', top: 32, right: 24, zIndex: 10 },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 },
  icon: { marginBottom: 24 },
  title: { color: '#fff', fontSize: 38, fontWeight: '400', marginBottom: 18, textAlign: 'center' },
  desc: { color: '#fff', fontSize: 18, textAlign: 'center', marginBottom: 18, fontWeight: '400' },
  fabBarSafe: { position: 'absolute', left: 0, right: 0, bottom: 0, alignItems: 'center', backgroundColor: 'transparent', paddingBottom: 24 },
  pinkBtn: { backgroundColor: '#e6007a', borderRadius: 8, alignItems: 'center', paddingVertical: 18, width: '92%' },
  pinkBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 20, letterSpacing: 1 },
}); 
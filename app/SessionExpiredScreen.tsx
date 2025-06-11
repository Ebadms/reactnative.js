import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

function PowerIcon() {
  return <Ionicons name="power" size={64} color="#fff" style={{ marginBottom: 24 }} />;
}

export default function SessionExpiredScreen() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <BlurView intensity={60} tint="dark" style={StyleSheet.absoluteFill} />
      <View style={styles.centerContent}>
        <PowerIcon />
        <Text style={styles.title}>Tu sesión ha finalizado</Text>
        <Text style={styles.desc}>
          Parece que llevas un rato sin usar la aplicación. ¿Quieres volver a entrar? Aún tenemos mucho que ofrecerte.
        </Text>
      </View>
      <TouchableOpacity style={styles.pinkBtn} onPress={() => router.replace('/PinScreen')}>
        <Text style={styles.pinkBtnText}>VOLVER A ENTRAR</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  centerContent: { flex: 1, justifyContent: 'center', alignItems: 'center', width: '90%' },
  title: { color: '#fff', fontSize: 32, fontWeight: '300', marginBottom: 18, textAlign: 'center' },
  desc: { color: '#fff', fontSize: 16, textAlign: 'center', marginBottom: 32, fontWeight: '400' },
  pinkBtn: { position: 'absolute', bottom: 32, left: 20, right: 20, backgroundColor: '#e6007a', borderRadius: 6, alignItems: 'center', paddingVertical: 18 },
  pinkBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 18, letterSpacing: 1 },
}); 
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

const options = [
  {
    icon: <MaterialCommunityIcons name="account-outline" size={32} color="#fff" />,
    title: 'Mis datos',
    desc: 'Edita tus datos personales.',
  },
  {
    icon: <MaterialCommunityIcons name="file-document-outline" size={32} color="#fff" />,
    title: 'Mis documentos',
    desc: 'Aquí podrás ver todos tus procesos a distancia pendientes.',
  },
  {
    icon: <MaterialCommunityIcons name="account-multiple-outline" size={32} color="#fff" />,
    title: 'Mi agenda',
    desc: 'Añade y edita tus contactos para hacer más rápidas tus operaciones.',
  },
  {
    icon: <MaterialCommunityIcons name="account-box-outline" size={32} color="#fff" />,
    title: 'Mi foto de perfil',
    desc: 'Elige una foto para el perfil de tu app de EVO.',
  },
  {
    icon: <MaterialCommunityIcons name="email-outline" size={32} color="#fff" />,
    title: 'Cambio de email',
    desc: 'Modifica el correo electrónico asociado a tu cuenta de EVO.',
  },
  {
    icon: <MaterialCommunityIcons name="cellphone-cog" size={32} color="#fff" />,
    title: 'Cambiar nº de teléfono',
    desc: 'Aquí podrás modificar el número de teléfono asociado a tu cuenta de EVO.',
  },
];

function TopBar({ onBack, onClose }: { onBack: () => void; onClose: () => void }) {
  return (
    <View style={styles.topBar}>
      <TouchableOpacity onPress={onBack} style={styles.topBarBtn}>
        <Ionicons name="arrow-back" size={36} color="#fff" />
      </TouchableOpacity>
      <Text style={styles.topBarTitle}>Mi perfil</Text>
      <TouchableOpacity onPress={onClose} style={styles.topBarBtn}>
        <Ionicons name="close" size={36} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

function ProfileCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardIcon}>{icon}</View>
      <View style={{ flex: 1 }}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardDesc}>{desc}</Text>
      </View>
    </View>
  );
}

export default function ProfileScreen() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <BlurView intensity={60} tint="dark" style={StyleSheet.absoluteFill} />
      <TopBar onBack={() => router.back()} onClose={() => router.back()} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {options.map((opt, idx) => (
          <ProfileCard key={idx} icon={opt.icon} title={opt.title} desc={opt.desc} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 36, paddingBottom: 18, backgroundColor: 'transparent' },
  topBarBtn: { padding: 4 },
  topBarTitle: { color: '#fff', fontSize: 28, fontWeight: 'bold', textAlign: 'center', flex: 1 },
  scrollContent: { paddingHorizontal: 0, paddingBottom: 32 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 12, marginHorizontal: 16, marginBottom: 18, padding: 18 },
  cardIcon: { marginRight: 18 },
  cardTitle: { color: '#fff', fontWeight: 'bold', fontSize: 18, marginBottom: 2 },
  cardDesc: { color: '#fff', fontSize: 15, opacity: 0.85 },
}); 
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ImageBackground, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ConfigScreen = () => {
  const [name, setName] = useState('');
  const [iban, setIban] = useState('');
  const [balance, setBalance] = useState('');
  const [phone, setPhone] = useState('');
  const router = useRouter();

  const handleSave = async () => {
    if (!name || !iban || !balance || !phone) {
      Alert.alert('Todos los campos son obligatorios');
      return;
    }
    await AsyncStorage.setItem('accountData', JSON.stringify({ name, iban, balance, phone }));
    await AsyncStorage.removeItem('recentTransfers');
    router.replace('/');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <ImageBackground
        source={require('../assets/images/background.jpg')}
        style={styles.background}
        imageStyle={styles.imageStyle}
      >
        <View style={styles.overlay} />
        <KeyboardAvoidingView
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.cardGlass}>
            <Text style={styles.title}>Configuración de Cuenta</Text>
            <TextInput
              style={styles.input}
              placeholder="Nombre del titular"
              placeholderTextColor="#ccc"
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={styles.input}
              placeholder="IBAN"
              placeholderTextColor="#ccc"
              value={iban}
              onChangeText={setIban}
            />
            <TextInput
              style={styles.input}
              placeholder="Saldo disponible"
              placeholderTextColor="#ccc"
              value={balance}
              onChangeText={setBalance}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Número personal"
              placeholderTextColor="#ccc"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
            <TouchableOpacity style={styles.button} onPress={handleSave}>
              <Text style={styles.buttonText}>Guardar y Reiniciar</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#000' },
  background: { flex: 1 },
  imageStyle: { width: '100%', height: '100%' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.55)' },
  cardGlass: { backgroundColor: 'rgba(30,30,40,0.55)', borderRadius: 18, padding: 24, width: '90%', maxWidth: 400, shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, alignItems: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#fff', marginBottom: 24, textAlign: 'center', letterSpacing: 1 },
  input: { width: '100%', height: 48, borderColor: 'rgba(255,255,255,0.18)', borderWidth: 1, borderRadius: 8, marginBottom: 18, paddingHorizontal: 14, fontSize: 17, color: '#fff', backgroundColor: 'rgba(255,255,255,0.08)' },
  button: { backgroundColor: '#1ed760', paddingVertical: 14, borderRadius: 8, width: '100%', alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});

export default ConfigScreen; 
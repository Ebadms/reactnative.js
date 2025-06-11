import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const PIN_LENGTH = 6;
const SPECIAL_CODES = {
  CONFIG: '909090',
  SIMULATION: '102030',
};

const bottomIcons = [
  { icon: <MaterialIcons name="atm" size={28} color="#fff" />, label: 'Cajeros' },
  { icon: <MaterialIcons name="lock-outline" size={28} color="#fff" />, label: 'Error acceso' },
  { icon: <MaterialCommunityIcons name="fingerprint" size={28} color="#fff" />, label: 'Biometría' },
  { icon: <MaterialCommunityIcons name="cellphone-cog" size={28} color="#fff" />, label: 'Mi app' },
];

const PinScreen = () => {
  const [pin, setPin] = useState('');
  const [titular, setTitular] = useState('');
  const router = useRouter();

  useEffect(() => {
    AsyncStorage.getItem('accountData').then(data => {
      if (data) {
        const parsed = JSON.parse(data);
        setTitular(parsed.name || '');
      }
    });
  }, []);

  const handleKeyPress = (num: string) => {
    if (pin.length < PIN_LENGTH) {
      setPin(pin + num);
    }
  };

  const handleDelete = () => {
    setPin(pin.slice(0, -1));
  };

  useEffect(() => {
    if (pin.length === PIN_LENGTH) {
      if (pin === SPECIAL_CODES.CONFIG) {
        setPin('');
        router.replace('/ConfigScreen');
      } else if (pin === SPECIAL_CODES.SIMULATION) {
        setPin('');
        router.replace('/SimulationScreen');
      } else {
        setPin('');
        // Optionally show error
      }
    }
  }, [pin]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <ImageBackground
        source={require('../assets/images/background.jpg')}
        style={styles.background}
        imageStyle={styles.imageStyle}
      >
        {/* Dim overlay */}
        <View style={styles.overlay} />
        {/* Bell icon only */}
        <View style={styles.bellRow}>
          <View style={{ flex: 1 }} />
          <Ionicons name="notifications-outline" size={30} color="#fff" style={styles.bellIcon} />
        </View>
        {/* EVO and profile icon */}
        <View style={styles.evoProfileRow}>
          <Text style={styles.evoLogo}>EVO</Text>
        </View>
        <View style={styles.profileCircleWrap}>
          <View style={styles.profileCircle}>
            <Ionicons name="person-outline" size={48} color="#fff" />
          </View>
        </View>
        {/* Hola, TITULAR */}
        <View style={styles.centerContent}>
          <Text style={styles.holaText}>
            Hola{titular ? <Text style={styles.titularText}>, {titular}</Text> : ''}
          </Text>
          {titular ? (
            <TouchableOpacity>
              <Text style={styles.notYouText}>¿No eres <Text style={styles.titularLink}>{titular}</Text>? <Ionicons name="chevron-forward" size={16} color="#fff" /></Text>
            </TouchableOpacity>
          ) : null}
          {/* PIN dots */}
          <View style={styles.pinDotsRow}>
            {Array.from({ length: PIN_LENGTH }).map((_, i) => (
              <View
                key={i}
                style={[styles.pinDot, pin[i] ? styles.pinDotFilled : null]}
              />
            ))}
          </View>
        </View>
        {/* Keypad */}
        <View style={styles.keypad}>
          {[1,2,3,4,5,6,7,8,9,'',0,'del'].map((key, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.key}
              onPress={() => {
                if (key === 'del') handleDelete();
                else if (key === 0 || typeof key === 'number') handleKeyPress(String(key));
              }}
              disabled={key === ''}
              activeOpacity={0.7}
            >
              {key === 'del' ? (
                <Ionicons name="backspace-outline" size={28} color="#fff" />
              ) : (
                <Text style={styles.keyText}>{key}</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
        {/* Bottom Bar in SafeAreaView */}
        <SafeAreaView style={styles.bottomBar} edges={['bottom']}>
          {bottomIcons.map((item, idx) => (
            <View style={styles.bottomIconCol} key={idx}>
              {item.icon}
              <Text style={styles.bottomLabel}>{item.label}</Text>
            </View>
          ))}
        </SafeAreaView>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#000' },
  background: { flex: 1, justifyContent: 'flex-start' },
  imageStyle: { width: '100%', height: '100%' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.55)' },
  bellRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8, marginHorizontal: 16 },
  bellIcon: { alignSelf: 'flex-end' },
  evoProfileRow: { alignItems: 'center', marginTop: 10 },
  evoLogo: { fontSize: 28, fontWeight: 'bold', color: '#fff', letterSpacing: 1 },
  profileCircleWrap: { alignItems: 'center', marginTop: 10 },
  profileCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(0,0,0,0.18)', justifyContent: 'center', alignItems: 'center' },
  centerContent: { alignItems: 'center', marginTop: 18 },
  holaText: { fontSize: 28, color: '#fff', fontWeight: '400' },
  titularText: { fontWeight: 'bold', color: '#fff', fontSize: 28 },
  notYouText: { color: '#fff', fontSize: 15, marginTop: 4, marginBottom: 18 },
  titularLink: { color: '#fff', textDecorationLine: 'underline', fontWeight: 'bold' },
  pinDotsRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginVertical: 12 },
  pinDot: { width: 16, height: 16, borderRadius: 8, borderWidth: 2, borderColor: '#fff', marginHorizontal: 7, backgroundColor: 'transparent' },
  pinDotFilled: { backgroundColor: '#fff' },
  keypad: { flexDirection: 'row', flexWrap: 'wrap', width: 260, alignSelf: 'center', justifyContent: 'center', marginTop: 10 },
  key: { width: 70, height: 70, justifyContent: 'center', alignItems: 'center', margin: 5, borderRadius: 35, backgroundColor: 'rgba(255,255,255,0.13)' },
  keyText: { fontSize: 28, color: '#fff', fontWeight: '400' },
  bottomBar: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingBottom: 0, paddingTop: 10, backgroundColor: 'rgba(0,0,0,0.13)', width: '100%' },
  bottomIconCol: { alignItems: 'center', marginHorizontal: 10},
  bottomLabel: { color: '#fff', fontSize: 13, marginTop: 2 },
});

export default PinScreen; 
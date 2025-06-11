import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Sharing from 'expo-sharing';
import React from 'react';
import { Alert, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import Pdf from 'react-native-pdf';

export default function PdfViewerScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { uri } = params;

  if (!uri) return null;

  const PdfResource = { uri: uri as string, cache: true };

  const handleShare = async () => {
    try {
      await Sharing.shareAsync(uri as string);
    } catch (e) {
      Alert.alert('Error', 'No se pudo compartir el PDF.');
    }
  };

  const handleDownload = async () => {
    try {
      const fileName = (typeof uri === 'string' ? uri : uri[0]).split('/').pop() || `recibo_${Date.now()}.pdf`;
      const dest = Platform.OS === 'android'
        ? `${FileSystem.documentDirectory}${fileName}`
        : `${FileSystem.cacheDirectory}${fileName}`;
      await FileSystem.copyAsync({ from: uri as string, to: dest });
      Alert.alert('Descargado', 'El PDF se ha guardado en tus archivos.');
    } catch (e) {
      Alert.alert('Error', 'No se pudo descargar el PDF.');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={32} color="#222" />
      </TouchableOpacity>
      <View style={styles.topRightBtns}>
        <TouchableOpacity style={styles.iconBtn} onPress={handleShare}>
          <MaterialCommunityIcons name="share-variant" size={28} color="#222" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconBtn} onPress={handleDownload}>
          <MaterialCommunityIcons name="download" size={28} color="#222" />
        </TouchableOpacity>
      </View>
      <Pdf
        source={PdfResource}
        style={styles.pdf}
        onLoadComplete={(numberOfPages, filePath) => {
          console.log(`number of pages: ${numberOfPages}`);
        }}
        onError={error => {
          console.log(error);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  backBtn: { position: 'absolute', top: 36, left: 10, zIndex: 10, backgroundColor: '#fff', borderRadius: 20, padding: 4 },
  topRightBtns: { position: 'absolute', top: 36, right: 16, flexDirection: 'row', zIndex: 10 },
  iconBtn: { marginLeft: 16, backgroundColor: '#fff', borderRadius: 20, padding: 4 },
  pdf: { flex: 1, width: '100%', height: '100%', marginTop: 60 },
}); 
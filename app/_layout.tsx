import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import AnimatedSplash from '../components/AnimatedSplash';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const [showSplash, setShowSplash] = React.useState(true);
  React.useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }
  if (showSplash) {
    return <AnimatedSplash />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="ConfigScreen" options={{ headerShown: false }} />
          <Stack.Screen name="SimulationScreen" options={{ headerShown: false }} />
          <Stack.Screen name="TransferScreen" options={{ headerShown: false }} />
          <Stack.Screen name="BizumScreen" options={{ headerShown: false }} />
          <Stack.Screen name="CashbackScreen" options={{ headerShown: false }} />
          <Stack.Screen name="ProfileScreen" options={{ headerShown: false }} />
          <Stack.Screen name="SessionExpiredScreen" options={{ headerShown: false }} />
          <Stack.Screen name="RecientesFavoritosScreen" options={{ headerShown: false }} />
          <Stack.Screen name="AccountDetailsScreen" options={{ headerShown: false }} />
          <Stack.Screen name="TransferDetailScreen" options={{ headerShown: false }} />
          <Stack.Screen name="PdfViewerScreen" options={{ headerShown: false }} />
          <Stack.Screen name="VerificarComprasScreen" options={{ headerShown: false }} />
          <Stack.Screen name="IngresosEfectivoScreen" options={{ headerShown: false }} />
          <Stack.Screen name="CorreosCashScreen" options={{ headerShown: false }} />
          <Stack.Screen name="CertificadosScreen" options={{ headerShown: false }} />
          <Stack.Screen name="TitularidadCertificadoScreen" options={{ headerShown: false }} />
          <Stack.Screen name="ConfiguracionScreen" options={{ headerShown: false }} />
          <Stack.Screen name="OtrasOpcionesScreen" options={{ headerShown: false }} />
          <Stack.Screen name="DomiciliacionesScreen" options={{ headerShown: false }} />
          <Stack.Screen name="PersonalizarScreen" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

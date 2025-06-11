import { FontAwesome5, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Dimensions, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const sections = [
  { key: 'cuentas', label: 'CUENTAS', icon: <MaterialIcons name="account-balance-wallet" size={22} color="#fff" /> },
  { key: 'depositos', label: 'DEPÓSITOS', icon: <MaterialCommunityIcons name="bank" size={22} color="#fff" /> },
  { key: 'medios', label: 'MEDIOS DE PAGO', icon: <FontAwesome5 name="credit-card" size={20} color="#fff" /> },
  { key: 'ingresar', label: 'INGRESAR Y RETIRAR DINERO', icon: <MaterialIcons name="attach-money" size={22} color="#fff" /> },
  { key: 'inversiones', label: 'INVERSIONES', icon: <MaterialCommunityIcons name="chart-line" size={22} color="#fff" /> },
  { key: 'hucha', label: 'HUCHA INTELIGENTE', icon: <MaterialCommunityIcons name="piggy-bank-outline" size={22} color="#fff" /> },
  { key: 'calendario', label: 'CALENDARIO', icon: <MaterialCommunityIcons name="calendar-month-outline" size={22} color="#fff" /> },
  { key: 'evoplace', label: 'EVO PLACE', icon: <MaterialCommunityIcons name="star-outline" size={22} color="#fff" /> },
  { key: 'personalizar', label: 'PERSONALIZAR', icon: <MaterialIcons name="edit" size={22} color="#fff" /> },
];

type SectionKey = 'cuentas' | 'depositos' | 'medios' | 'ingresar' | 'inversiones' | 'hucha' | 'calendario' | 'evoplace' | 'personalizar';

export default function SimulationScreen() {
  const [account, setAccount] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showBalance, setShowBalance] = useState(true);
  const [expanded, setExpanded] = useState<Record<SectionKey, boolean>>({
    cuentas: true,
    depositos: true,
    medios: true,
    ingresar: false,
    inversiones: false,
    hucha: false,
    calendario: false,
    evoplace: false,
    personalizar: false,
  });
  const [menuVisible, setMenuVisible] = useState(false);
  const [sendMoneyModalVisible, setSendMoneyModalVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const data = await AsyncStorage.getItem('accountData');
      if (data) setAccount(JSON.parse(data));
      setLoading(false);
    };
    fetchData();
  }, []);

  const toggleExpand = (key: SectionKey) => {
    setExpanded(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const maskedBalance = (balance: string | number) => {
    if (!showBalance) {
      if (typeof balance === 'string' && balance.length > 0) {
        return '*'.repeat(balance.length) + ' €';
      }
      return '***** €';
    }
    return `${balance} €`;
  };

  function formatAmount(amount: number) {
    // US/UK style: 1,000 € (no decimals, comma as thousands separator)
    return amount.toLocaleString('en-US', { maximumFractionDigits: 0 }) + ' €';
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <ImageBackground
        source={require('../assets/images/background.jpg')}
        style={styles.background}
        imageStyle={styles.imageStyle}
      >
        <BlurView intensity={60} tint="dark" style={StyleSheet.absoluteFill} />
        <View style={[styles.overlay, { backgroundColor: 'rgba(0,0,0,0.55)' }]} />
        {/* Top Bar */}
        <View style={styles.topBar}>
          <Ionicons name="mail-outline" size={26} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.evoLogo}>EVO</Text>
          <View style={styles.topIcons}>
            <TouchableOpacity onPress={() => setShowBalance(v => !v)}>
              <Ionicons name={showBalance ? 'eye-outline' : 'eye-off-outline'} size={30} color="#fff" style={{ marginRight: 10 }} />
            </TouchableOpacity>
            <Ionicons name="notifications-outline" size={30} color="#fff" />
          </View>
        </View>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Cuentas Section */}
          <View style={styles.cardGlass}>
            <TouchableOpacity style={styles.cardHeader} onPress={() => toggleExpand('cuentas')} activeOpacity={0.8}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <MaterialIcons name="account-balance-wallet" size={22} color="#fff" />
              <Text style={styles.sectionTitle}>  CUENTAS | 1</Text>
            </View>
              <Ionicons name={expanded.cuentas ? 'chevron-up' : 'chevron-down'} size={26} color="#fff" />
            </TouchableOpacity>
            {expanded.cuentas && (
              <>
            <Text style={styles.sectionSub}>SALDO TOTAL EN 1 CUENTA SELECCIONADA</Text>
                <Text style={styles.balanceText}>
                  {showBalance
                    ? (account ? formatAmount(Number(account.balance)) : formatAmount(0))
                    : '***** €'}
                </Text>
            <TouchableOpacity style={styles.accountCard} activeOpacity={0.85} onPress={() => router.push('/AccountDetailsScreen')}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <MaterialCommunityIcons name="bank" size={22} color="#fff" />
                <Text style={styles.accountName}>  EVO</Text>
                    {account?.name ? <Text style={styles.accountType}>{account.name}</Text> : null}
              </View>
                  <Text style={styles.ibanLabel}>{account?.iban ? account.iban.slice(0, 4) : ''}</Text>
                  <Text style={styles.ibanText}>{account?.iban ? account.iban.slice(4) : ''}</Text>
                  <Text style={styles.accountBalance}>
                    {showBalance
                      ? (account ? formatAmount(Number(account.balance)) : formatAmount(0))
                      : '***** €'}
                  </Text>
            </TouchableOpacity>
              </>
            )}
          </View>
          {/* Depósitos Section */}
          <View style={styles.cardGlass}>
            <TouchableOpacity style={styles.cardHeader} onPress={() => toggleExpand('depositos')} activeOpacity={0.8}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <MaterialCommunityIcons name="bank" size={22} color="#fff" />
              <Text style={styles.sectionTitle}>  DEPÓSITOS</Text>
            </View>
              <Ionicons name={expanded.depositos ? 'chevron-up' : 'chevron-down'} size={26} color="#fff" />
            </TouchableOpacity>
            {expanded.depositos && (
              <>
            <Text style={styles.sectionSub}>No tienes depósitos</Text>
                <View style={styles.greenCard}><Text style={styles.greenCardText}>Tu dinero en EVO es más dinero. Descúbrelo con nuestros depósitos.</Text></View>
                <TouchableOpacity style={styles.linkRow} activeOpacity={0.7}>
                  <Text style={styles.linkText}>CONOCE EL TUYO</Text>
                  <Ionicons name="chevron-forward" size={18} color="#fff" />
                </TouchableOpacity>
              </>
            )}
          </View>
          {/* Medios de Pago Section */}
          <View style={styles.cardGlass}>
            <TouchableOpacity style={styles.cardHeader} onPress={() => toggleExpand('medios')} activeOpacity={0.8}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <FontAwesome5 name="credit-card" size={20} color="#fff" />
              <Text style={styles.sectionTitle}>  MEDIOS DE PAGO | 1</Text>
            </View>
              <Ionicons name={expanded.medios ? 'chevron-up' : 'chevron-down'} size={26} color="#fff" />
            </TouchableOpacity>
            {expanded.medios && (
              <>
            <Text style={styles.sectionSub}>Tarjeta Joven</Text>
            <View style={styles.cardImage} />
            <Text style={styles.cardNumber}>4133 **** **** 1980</Text>
            <View style={styles.greenCard}><Text style={styles.greenCardText}>Recibe cashbacks al comprar con tu tarjeta en comercios asociados.</Text></View>
                <TouchableOpacity style={styles.linkRow} activeOpacity={0.7}>
                  <Text style={styles.linkText}>DESCUBRIR COMERCIOS</Text>
                  <Ionicons name="chevron-forward" size={18} color="#fff" />
                </TouchableOpacity>
              </>
            )}
          </View>
          {/* Ingresar y Retirar Dinero Section */}
          <View style={styles.cardGlass}>
            <TouchableOpacity style={styles.cardHeader} onPress={() => toggleExpand('ingresar')} activeOpacity={0.8}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <MaterialIcons name="attach-money" size={22} color="#fff" />
                <Text style={styles.sectionTitle}>  INGRESAR Y RETIRAR DINERO</Text>
              </View>
              <Ionicons name={expanded.ingresar ? 'chevron-up' : 'chevron-down'} size={26} color="#fff" />
            </TouchableOpacity>
            {expanded.ingresar && (
              <>
                <Text style={styles.sectionSub}>Ubicación desconocida</Text>
                <Text style={styles.sectionSubSmall}>Facilítanos el permiso de localización para mostrarte los cajeros y las oficinas más cercanos.</Text>
                <TouchableOpacity style={styles.linkRow} activeOpacity={0.7}>
                  <Text style={styles.linkText}>Permisos de la app</Text>
                  <Ionicons name="chevron-forward" size={18} color="#fff" />
                </TouchableOpacity>
              </>
            )}
          </View>
          {/* Inversiones Section */}
          <View style={styles.cardGlass}>
            <TouchableOpacity style={styles.cardHeader} onPress={() => toggleExpand('inversiones')} activeOpacity={0.8}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <MaterialCommunityIcons name="chart-line" size={22} color="#fff" />
                <Text style={styles.sectionTitle}>  INVERSIONES</Text>
              </View>
              <Ionicons name={expanded.inversiones ? 'chevron-up' : 'chevron-down'} size={26} color="#fff" />
            </TouchableOpacity>
            {expanded.inversiones && (
              <>
                <Text style={styles.sectionSub}>No tienes inversiones</Text>
                <TouchableOpacity style={styles.linkRow} activeOpacity={0.7}>
                  <Text style={styles.linkText}>SABER MÁS</Text>
                  <Ionicons name="chevron-forward" size={18} color="#fff" />
                </TouchableOpacity>
              </>
            )}
          </View>
          {/* Hucha Inteligente Section */}
          <View style={styles.cardGlass}>
            <TouchableOpacity style={styles.cardHeader} onPress={() => toggleExpand('hucha')} activeOpacity={0.8}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <MaterialCommunityIcons name="piggy-bank-outline" size={22} color="#fff" />
                <Text style={styles.sectionTitle}>  HUCHA INTELIGENTE</Text>
              </View>
              <Ionicons name={expanded.hucha ? 'chevron-up' : 'chevron-down'} size={26} color="#fff" />
            </TouchableOpacity>
            {expanded.hucha && (
              <>
                <Text style={styles.sectionSub}>No tienes objetivos creados</Text>
                <Text style={styles.sectionSubSmall}>Caja Fuerte (Plan de Pensiones)</Text>
                <TouchableOpacity style={styles.linkRow} activeOpacity={0.7}>
                  <Text style={styles.linkText}>SABER MÁS</Text>
                  <Ionicons name="chevron-forward" size={18} color="#fff" />
                </TouchableOpacity>
              </>
            )}
          </View>
          {/* Calendario Section */}
          <View style={styles.cardGlass}>
            <TouchableOpacity style={styles.cardHeader} onPress={() => toggleExpand('calendario')} activeOpacity={0.8}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <MaterialCommunityIcons name="calendar-month-outline" size={22} color="#fff" />
                <Text style={styles.sectionTitle}>  CALENDARIO</Text>
              </View>
              <Ionicons name={expanded.calendario ? 'chevron-up' : 'chevron-down'} size={26} color="#fff" />
            </TouchableOpacity>
            {expanded.calendario && (
              <>
                <Text style={styles.sectionSub}>Con el calendario controla todos tus recibos de un solo vistazo. ¡Domicílialos en EVO y que no se te escape nada!</Text>
              </>
            )}
          </View>
          {/* EVO Place Section */}
          <View style={styles.cardGlass}>
            <TouchableOpacity style={styles.cardHeader} onPress={() => toggleExpand('evoplace')} activeOpacity={0.8}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <MaterialCommunityIcons name="star-outline" size={22} color="#fff" />
                <Text style={styles.sectionTitle}>  EVO PLACE</Text>
              </View>
              <Ionicons name={expanded.evoplace ? 'chevron-up' : 'chevron-down'} size={26} color="#fff" />
            </TouchableOpacity>
            {expanded.evoplace && (
              <>
                <Text style={styles.sectionSub}>Hazte con las ventajas más exclusivas.</Text>
                <Text style={styles.sectionSubSmall}>Tarjeta Regalo Amazon.es</Text>
                <TouchableOpacity style={styles.linkRow} activeOpacity={0.7}>
                  <Text style={styles.linkText}>SABER MÁS</Text>
                  <Ionicons name="chevron-forward" size={18} color="#fff" />
                </TouchableOpacity>
              </>
            )}
          </View>
          {/* Personalizar Section */}
          <View style={styles.cardGlass}>
            <TouchableOpacity style={styles.cardHeader} activeOpacity={0.8} onPress={() => router.push('/PersonalizarScreen')}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <MaterialIcons name="edit" size={22} color="#fff" />
                <Text style={styles.sectionTitle}>  PERSONALIZAR</Text>
              </View>
              {/* No arrow icon here */}
            </TouchableOpacity>
            {/* No expanded content, always show this */}
            {/* <Text style={styles.sectionSub}>Personaliza tu experiencia EVO.</Text> */}
          </View>
        </ScrollView>
        {/* Floating Action Button */}
        <TouchableOpacity style={styles.fab} activeOpacity={0.7} onPress={() => setMenuVisible(true)}>
          <MaterialCommunityIcons name="apps" size={36} color="#fff" />
        </TouchableOpacity>
        {/* Main Menu Modal */}
        {menuVisible && (
          <View style={styles.menuOverlay}>
            <View style={[styles.menuBlur, { backgroundColor: '#111' }]}> 
              <View style={[styles.menuContainer, { backgroundColor: '#111' }]}> 
                <View style={styles.menuHeader}>
                  <Text style={styles.menuTitle}>Menú principal</Text>
                  <TouchableOpacity onPress={() => setMenuVisible(false)} style={styles.menuCloseBtn}>
                    <Ionicons name="close" size={32} color="#fff" />
                  </TouchableOpacity>
                </View>
                {/* Frecuentes */}
                <Text style={styles.menuSectionTitle}>FRECUENTES</Text>
                <View style={styles.menuRow}>
                  <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuVisible(false); setTimeout(() => router.push('/BizumScreen'), 250); }}>
                    <MaterialCommunityIcons name="flash" size={28} color="#fff" style={styles.menuIcon} />
                    <Text style={styles.menuItemText}>Envío Bizum</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuVisible(false); setTimeout(() => router.push('/TransferScreen'), 250); }}>
                    <MaterialCommunityIcons name="swap-horizontal" size={28} color="#fff" style={styles.menuIcon} />
                    <Text style={styles.menuItemText}>Transferencias</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuVisible(false); setTimeout(() => router.push('/CashbackScreen'), 250); }}>
                    <MaterialCommunityIcons name="cash-refund" size={28} color="#fff" style={styles.menuIcon} />
                    <Text style={styles.menuItemText}>Cashback</Text>
                  </TouchableOpacity>
                </View>
                {/* Operaciones */}
                <Text style={styles.menuSectionTitle}>OPERACIONES</Text>
                <View style={styles.menuRow}>
                  <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuVisible(false); setTimeout(() => setSendMoneyModalVisible(true), 250); }}>
                    <MaterialCommunityIcons name="cash-plus" size={28} color="#fff" style={styles.menuIcon} />
                    <Text style={styles.menuItemText}>Envia/solicita dinero</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuVisible(false); setTimeout(() => router.push('/RecientesFavoritosScreen'), 250); }}>
                    <MaterialCommunityIcons name="heart-outline" size={28} color="#fff" style={styles.menuIcon} />
                    <Text style={styles.menuItemText}>Recientes y favoritos</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuVisible(false); setTimeout(() => router.push('/IngresosEfectivoScreen'), 250); }}>
                    <MaterialCommunityIcons name="bank-transfer-in" size={28} color="#fff" style={styles.menuIcon} />
                    <Text style={styles.menuItemText}>Ingresos de efectivo</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.menuRow}>
                  <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuVisible(false); setTimeout(() => router.push('/VerificarComprasScreen'), 250); }}>
                    <MaterialCommunityIcons name="shield-check-outline" size={28} color="#fff" style={styles.menuIcon} />
                    <Text style={styles.menuItemText}>Verificar compras online</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuVisible(false); setTimeout(() => router.push('/CertificadosScreen'), 250); }}>
                    <MaterialCommunityIcons name="certificate-outline" size={28} color="#fff" style={styles.menuIcon} />
                    <Text style={styles.menuItemText}>Certificados</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuVisible(false); setTimeout(() => router.push('/OtrasOpcionesScreen'), 250); }}>
                    <MaterialCommunityIcons name="dots-horizontal-circle-outline" size={28} color="#fff" style={styles.menuIcon} />
                    <Text style={styles.menuItemText}>Otras opciones</Text>
                  </TouchableOpacity>
                </View>
                {/* Bottom Bar */}
                <View style={styles.menuBottomBarImproved}>
                  <View style={styles.menuBottomIconWrap}><MaterialCommunityIcons name="power" size={28} color="#fff" /></View>
                  <View style={styles.menuBottomIconWrap}><MaterialCommunityIcons name="credit-card-outline" size={28} color="#fff" /></View>
                  <View style={[styles.menuBottomIconWrap, styles.menuBottomIconMicWrap]}><MaterialCommunityIcons name="microphone-outline" size={28} color="#fff" style={styles.menuBottomIconMic} /></View>
                  <TouchableOpacity style={styles.menuBottomIconWrap} onPress={() => { setMenuVisible(false); setTimeout(() => router.push('/ProfileScreen'), 250); }}>
                    <MaterialCommunityIcons name="account-outline" size={28} color="#fff" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.menuBottomIconWrap} onPress={() => { setMenuVisible(false); setTimeout(() => router.push('/ConfiguracionScreen'), 250); }}>
                    <MaterialCommunityIcons name="cog-outline" size={28} color="#fff" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        )}
        {sendMoneyModalVisible && (
          <View style={styles.sendMoneyModalOverlay}>
            <View style={styles.sendMoneyModalCard}>
              <View style={styles.sendMoneyModalHeader}>
                <TouchableOpacity onPress={() => { setSendMoneyModalVisible(false); setTimeout(() => setMenuVisible(true), 250); }}>
                  <Ionicons name="arrow-back" size={32} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.sendMoneyModalTitle}>Envia/solicita dinero</Text>
                <TouchableOpacity onPress={() => setSendMoneyModalVisible(false)}>
                  <Ionicons name="close" size={36} color="#fff" />
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={styles.sendMoneyOption} onPress={() => { setSendMoneyModalVisible(false); setTimeout(() => router.push('/BizumScreen'), 250); }}>
                <View style={styles.sendMoneyIconWrap}><MaterialCommunityIcons name="flash" size={32} color="#fff" /></View>
                <View style={styles.sendMoneyTextWrap}>
                  <Text style={styles.sendMoneyOptionTitle}>Bizum</Text>
                  <Text style={styles.sendMoneyOptionDesc}>Envío/solicitud de dinero a cualquier teléfono móvil.</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.sendMoneyOption} onPress={() => { setSendMoneyModalVisible(false); setTimeout(() => router.push('/TransferScreen'), 250); }}>
                <View style={styles.sendMoneyIconWrap}><MaterialCommunityIcons name="swap-horizontal" size={32} color="#fff" /></View>
                <View style={styles.sendMoneyTextWrap}>
                  <Text style={styles.sendMoneyOptionTitle}>Transferencias</Text>
                  <Text style={styles.sendMoneyOptionDesc}>Envío de dinero a cuentas corrientes nacionales y europeas.</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.sendMoneyOption} onPress={() => { setSendMoneyModalVisible(false); setTimeout(() => router.push('/HalCashScreen'), 250); }}>
                <View style={styles.sendMoneyIconWrap}><MaterialCommunityIcons name="cellphone" size={32} color="#fff" /></View>
                <View style={styles.sendMoneyTextWrap}>
                  <Text style={styles.sendMoneyOptionTitle}>Hal-Cash</Text>
                  <Text style={styles.sendMoneyOptionDesc}>Retirada de efectivo desde un cajero sin necesidad de tarjeta.</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#000' },
  background: { flex: 1 },
  imageStyle: { width: '100%', height: '100%' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.45)' },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 18, paddingTop: 10, marginBottom: 8 },
  evoLogo: { fontSize: 28, fontWeight: 'bold', color: '#fff', letterSpacing: 1 },
  topIcons: { flexDirection: 'row', alignItems: 'center' },
  scrollContent: { paddingBottom: 100, paddingHorizontal: 10 },
  cardGlass: { backgroundColor: 'rgba(30,30,40,0.55)', borderRadius: 18, marginBottom: 18, padding: 16, shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 8, shadowOffset: { width: 0, height: 2 } },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  sectionTitle: { color: '#fff', fontWeight: 'bold', fontSize: 16, letterSpacing: 1 },
  sectionSub: { color: '#ccc', fontSize: 13, marginBottom: 6 },
  sectionSubSmall: { color: '#ccc', fontSize: 12, marginBottom: 6 },
  balanceText: { color: '#fff', fontWeight: 'bold', fontSize: 28, marginVertical: 6 },
  accountCard: { backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 12, padding: 12, marginTop: 10 },
  accountName: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  accountType: { color: '#fff', fontSize: 13, marginLeft: 8 },
  ibanLabel: { color: '#fff', fontWeight: 'bold', fontSize: 13, marginTop: 8 },
  ibanText: { color: '#fff', fontWeight: 'bold', fontSize: 15, marginBottom: 4 },
  accountBalance: { color: '#fff', fontWeight: 'bold', fontSize: 20 },
  greenCard: { backgroundColor: '#1ed760', borderRadius: 8, padding: 8, marginTop: 8 },
  greenCardText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
  cardImage: { width: 90, height: 56, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.18)', marginVertical: 8, alignSelf: 'center' },
  cardNumber: { color: '#fff', fontWeight: 'bold', fontSize: 15, marginBottom: 4, alignSelf: 'center' },
  linkRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  linkText: { color: '#fff', fontWeight: 'bold', fontSize: 14, marginRight: 4, textDecorationLine: 'underline' },
  fab: {
    position: 'absolute',
    bottom: 24,
    alignSelf: 'center',
    backgroundColor: '#e6007a',
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  menuOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  menuBlur: {
    width: '95%',
    maxWidth: 420,
    borderRadius: 28,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuContainer: {
    width: '100%',
    padding: 22,
    alignItems: 'center',
  },
  menuHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  menuTitle: {
    flex: 1,
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 1,
  },
  menuCloseBtn: {
    position: 'absolute',
    right: 0,
    top: -4,
    padding: 4,
    zIndex: 10,
  },
  menuSectionTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
    alignSelf: 'flex-start',
    marginTop: 8,
    marginBottom: 4,
    letterSpacing: 1,
  },
  menuRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
  },
  menuItem: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.07)',
    marginHorizontal: 4,
    borderRadius: 12,
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 2,
    minWidth: 90,
    maxWidth: 120,
  },
  menuIcon: {
    marginBottom: 8,
  },
  menuItemText: {
    color: '#fff',
    fontSize: 13,
    textAlign: 'center',
    fontWeight: '500',
  },
  menuBottomBarImproved: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    paddingTop: 10,
    paddingHorizontal: 24,
    marginBottom: 0,
  },
  menuBottomIconWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuBottomIconMicWrap: {
    flex: 1.2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuBottomIconMic: {
    borderColor: '#e6007a',
    borderWidth: 2,
    borderRadius: 18,
    padding: 4,
  },
  sendMoneyModalOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center', zIndex: 200 },
  sendMoneyModalCard: { width: '94%', maxWidth: 420, backgroundColor: '#222', borderRadius: 18, padding: 18, alignItems: 'stretch', elevation: 10 },
  sendMoneyModalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 },
  sendMoneyModalTitle: { color: '#fff', fontSize: 22, fontWeight: 'bold', flex: 1, textAlign: 'center' },
  sendMoneyOption: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#222', borderRadius: 12, marginBottom: 16, padding: 16, elevation: 2 },
  sendMoneyIconWrap: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#333', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  sendMoneyTextWrap: { flex: 1 },
  sendMoneyOptionTitle: { color: '#fff', fontWeight: 'bold', fontSize: 18, marginBottom: 2 },
  sendMoneyOptionDesc: { color: '#bbb', fontSize: 15 },
}); 
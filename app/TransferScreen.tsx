import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const TABS = ['NUEVA', 'RECIENTES', 'FAVORITOS'];

function WarningBanner({ onClose }: { onClose: () => void }) {
  return (
    <View style={styles.warningBanner}>
      <MaterialCommunityIcons name="alert-outline" size={32} color="#fff" style={{ marginRight: 10 }} />
      <View style={{ flex: 1 }}>
        <Text style={styles.warningTitle}>Cuidado con el fraude</Text>
        <Text style={styles.warningText}>EVO nunca te va a llamar para hacer una Transferencia. Si te están llamando, no es EVO. Desconfía, cuelga y llama tú mismo.</Text>
      </View>
      <TouchableOpacity onPress={onClose} style={{ marginLeft: 8 }}>
        <Ionicons name="close" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

function TransferHeader({ onClose, onInfo }: { onClose: () => void; onInfo: () => void }) {
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Transferencia</Text>
      <View style={styles.headerIcons}>
        <MaterialCommunityIcons name="currency-eur" size={36} color="#fff" style={styles.headerIcon} />
        <TouchableOpacity onPress={onInfo}>
          <Ionicons name="information-circle-outline" size={32} color="#fff" style={styles.headerIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={onClose}>
          <Ionicons name="close" size={36} color="#fff" style={styles.headerIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

function TabBar({ activeTab, setActiveTab }: { activeTab: number; setActiveTab: (i: number) => void }) {
  return (
    <View style={styles.tabBar}>
      {TABS.map((tab, i) => (
        <TouchableOpacity
          key={tab}
          style={[styles.tab, activeTab === i && styles.tabActive]}
          onPress={() => setActiveTab(i)}
        >
          <Text style={[styles.tabText, activeTab === i && styles.tabTextActive]}>{tab}</Text>
          {activeTab === i && <View style={styles.tabUnderline} />}
        </TouchableOpacity>
      ))}
    </View>
  );
}

function formatAmount(amount: number) {
  // US/UK style: 1,000 € (no decimals, comma as thousands separator)
  return amount.toLocaleString('en-US', { maximumFractionDigits: 0 }) + ' €';
}

function OperationForm({
  account,
  onTransfer,
  loading,
}: {
  account: any;
  onTransfer: (data: any) => void;
  loading: boolean;
}) {
  const [beneficiary, setBeneficiary] = useState('');
  const [iban, setIban] = useState('');
  const [amount, setAmount] = useState('');
  const [concept, setConcept] = useState('');
  const [error, setError] = useState('');
  const handleContinue = () => {
    setError('');
    if (!beneficiary || !iban || !amount) {
      setError('Por favor, completa todos los campos obligatorios.');
      return;
    }
    const parsedAmount = parseFloat(amount.replace(',', '.'));
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Introduce un importe válido.');
      return;
    }
    if (parsedAmount > parseFloat(account.balance)) {
      setError('Saldo insuficiente para realizar la transferencia.');
      return;
    }
    onTransfer({ beneficiary, iban, amount: parsedAmount, concept });
    setBeneficiary('');
    setIban('');
    setAmount('');
    setConcept('');
  };
  return (
    <View style={styles.formSection}>
      <Text style={styles.sectionLabel}>DATOS DE LA OPERACIÓN</Text>
      <Text style={styles.sectionSubLabel}>CUENTA DE ORIGEN</Text>
      <Text style={styles.accountName}>{account?.name || ''}</Text>
      <Text style={styles.accountIban}><Text style={{ fontWeight: 'bold' }}>{account?.iban?.slice(0, 4) || ''}</Text> {account?.iban?.slice(4) || ''}</Text>
      <Text style={styles.accountBalance}>{formatAmount(Number(account?.balance || 0))}</Text>
      {/* Beneficiario */}
      <View style={styles.inputRow}>
        <MaterialCommunityIcons name="account-outline" size={28} color="#000" style={styles.inputIcon} />
        <View style={{ flex: 1 }}>
          <Text style={styles.inputLabel}>BENEFICIARIO</Text>
          <TextInput style={styles.input} placeholder="Nombre Apellido" placeholderTextColor="#bbb" value={beneficiary} onChangeText={setBeneficiary} />
        </View>
        <MaterialCommunityIcons name="account-box-outline" size={28} color="#000" style={styles.inputIconRight} />
      </View>
      {/* IBAN */}
      <View style={styles.inputRow}>
        <MaterialCommunityIcons name="wallet-outline" size={28} color="#000" style={styles.inputIcon} />
        <View style={{ flex: 1 }}>
          <Text style={styles.inputLabel}>IBAN</Text>
          <TextInput style={styles.input} placeholder="IBAN" placeholderTextColor="#bbb" value={iban} onChangeText={setIban} />
        </View>
      </View>
      {/* Importe */}
      <View style={styles.inputRow}>
        <MaterialCommunityIcons name="currency-eur" size={28} color="#000" style={styles.inputIcon} />
        <View style={{ flex: 1 }}>
          <Text style={styles.inputLabel}>IMPORTE</Text>
          <TextInput style={styles.input} placeholder="0,00 €" placeholderTextColor="#bbb" keyboardType="numeric" value={amount} onChangeText={setAmount} />
        </View>
      </View>
      {/* Concepto */}
      <View style={styles.inputRow}>
        <MaterialCommunityIcons name="file-document-outline" size={28} color="#000" style={styles.inputIcon} />
        <View style={{ flex: 1 }}>
          <Text style={styles.inputLabel}>CONCEPTO</Text>
          <TextInput style={styles.input} placeholder="Opcional" placeholderTextColor="#bbb" value={concept} onChangeText={setConcept} />
        </View>
      </View>
      {error ? <Text style={{ color: 'red', marginTop: 8 }}>{error}</Text> : null}
      <TouchableOpacity style={styles.continueBtn} onPress={handleContinue} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.continueBtnText}>CONTINUAR</Text>}
      </TouchableOpacity>
    </View>
  );
}

function RecentList({ transfers }: { transfers: any[] }) {
  if (!transfers.length) {
    return <EmptyFavorites emptyText="Aún no tienes transferencias recientes." icon="history" />;
  }
  // Group by date (YYYY-MM-DD)
  const grouped = transfers.reduce((acc: Record<string, any[]>, t: any) => {
    const date = t.date.split('T')[0];
    if (!acc[date]) acc[date] = [];
    acc[date].push(t);
    return acc;
  }, {} as Record<string, any[]>);
  return (
    <View style={styles.recentSection}>
      {Object.entries(grouped).map(([date, items]: [string, any[]]) => (
        <View key={date}>
          <Text style={styles.recentDate}>{new Date(date).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' }).toUpperCase()}</Text>
          {items.map((t: any, idx: number) => (
            <View style={styles.recentItem} key={idx}>
              <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                <MaterialCommunityIcons name="swap-horizontal" size={28} color="#000" style={{ marginRight: 10 }} />
                <View>
                  <Text style={styles.recentTime}>{t.time}</Text>
                  <Text style={styles.recentName}>{t.beneficiary}</Text>
                  <Text style={styles.recentDesc}>{t.concept || 'Transferencia'}</Text>
                  <Text style={styles.recentIban}>{t.iban}</Text>
                </View>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.recentStatus}>Enviado</Text>
                <Text style={styles.recentAmount}>-{formatAmount(t.amount)}</Text>
              </View>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}

function EmptyFavorites({ emptyText, icon }: { emptyText?: string; icon?: string }) {
  return (
    <View style={styles.emptyFavSection}>
      <MaterialCommunityIcons name={icon as any || 'currency-eur-off'} size={64} color="#bbb" style={{ marginBottom: 10 }} />
      <Text style={styles.emptyFavTitle}>LISTADO VACÍO</Text>
      <Text style={styles.emptyFavText}>{emptyText || 'Aún no tienes operaciones favoritas.'}</Text>
    </View>
  );
}

export default function TransferScreen() {
  const [activeTab, setActiveTab] = useState(0);
  const [showWarning, setShowWarning] = useState(true);
  const [account, setAccount] = useState<any>(null);
  const [recentTransfers, setRecentTransfers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [transferLoading, setTransferLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const acc = await AsyncStorage.getItem('accountData');
      setAccount(acc ? JSON.parse(acc) : null);
      const rec = await AsyncStorage.getItem('recentTransfers');
      setRecentTransfers(rec ? JSON.parse(rec) : []);
      setLoading(false);
    };
    load();
  }, []);

  const handleTransfer = async (data: any) => {
    setTransferLoading(true);
    const newBalance = parseFloat(account.balance) - data.amount;
    const updatedAccount = { ...account, balance: newBalance.toFixed(2) };
    await AsyncStorage.setItem('accountData', JSON.stringify(updatedAccount));
    setAccount(updatedAccount);
    const now = new Date();
    const transfer = {
      ...data,
      date: now.toISOString(),
      time: now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
    };
    const updatedTransfers = [transfer, ...recentTransfers].slice(0, 20);
    await AsyncStorage.setItem('recentTransfers', JSON.stringify(updatedTransfers));
    setRecentTransfers(updatedTransfers);
    setTransferLoading(false);
    Alert.alert('Transferencia realizada', 'La transferencia se ha realizado correctamente.');
    setActiveTab(1);
    setTimeout(() => router.replace('/SimulationScreen'), 500);
  };

  if (loading) {
    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><ActivityIndicator size="large" color="#e6007a" /></View>;
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        {showWarning && <WarningBanner onClose={() => setShowWarning(false)} />}
        <ScrollView contentContainerStyle={styles.scrollContent} style={{ flex: 1 }} keyboardShouldPersistTaps="handled">
          <TransferHeader onClose={() => router.back()} onInfo={() => {}} />
          <View style={styles.headerCenter}>
            <MaterialCommunityIcons name="currency-eur" size={48} color="#fff" style={styles.headerCenterIcon} />
            <Text style={styles.headerCenterTitle}>{activeTab === 0 ? 'Introduce los datos' : 'Repetir operación'}</Text>
            <Text style={styles.headerCenterDesc}>
              {activeTab === 0
                ? 'Selecciona la cuenta de origen e introduce los datos del beneficiario'
                : 'Selecciona una operación reciente o favorita para poder repetirla.'}
            </Text>
          </View>
          <TabBar activeTab={activeTab} setActiveTab={setActiveTab} />
          {activeTab === 0 && <OperationForm account={account} onTransfer={handleTransfer} loading={transferLoading} />}
          {activeTab === 1 && <RecentList transfers={recentTransfers} />}
          {activeTab === 2 && <EmptyFavorites />}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  scrollContent: { flexGrow: 1 },
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
    zIndex: 10,
  },
  warningTitle: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  warningText: { color: '#fff', fontSize: 13 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 0,
    paddingTop: 18,
    paddingBottom: 0,
    backgroundColor: 'transparent',
  },
  headerTitle: { flex: 1, color: '#fff', fontSize: 22, fontWeight: 'bold', textAlign: 'center' },
  headerIcons: { flexDirection: 'row', alignItems: 'center', position: 'absolute', right: 16, top: 18 },
  headerIcon: { marginLeft: 18 },
  headerCenter: { alignItems: 'center', marginTop: 10, marginBottom: 10 },
  headerCenterIcon: { marginBottom: 8 },
  headerCenterTitle: { color: '#fff', fontSize: 38, fontWeight: '300', textAlign: 'center', marginBottom: 2 },
  headerCenterDesc: { color: '#fff', fontSize: 16, textAlign: 'center', marginBottom: 10 },
  tabBar: { flexDirection: 'row', backgroundColor: 'transparent', marginBottom: 0 },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 12, backgroundColor: 'transparent' },
  tabActive: {},
  tabText: { color: '#222', fontWeight: 'bold', fontSize: 16, opacity: 0.7 },
  tabTextActive: { color: '#222', opacity: 1 },
  tabUnderline: { height: 3, backgroundColor: '#e6007a', width: '80%', borderRadius: 2, marginTop: 6 },
  formSection: { backgroundColor: '#fff', padding: 18, borderRadius: 0, marginTop: 0 },
  sectionLabel: { color: '#000', fontWeight: 'bold', fontSize: 15, marginBottom: 10 },
  sectionSubLabel: { color: '#e6007a', fontWeight: 'bold', fontSize: 13, marginBottom: 2 },
  accountName: { color: '#000', fontSize: 16, fontWeight: '500' },
  accountIban: { color: '#000', fontSize: 15, marginBottom: 2 },
  accountBalance: { color: '#000', fontSize: 22, fontWeight: '400', marginBottom: 16 },
  inputRow: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#eee', paddingVertical: 8 },
  inputIcon: { marginRight: 10 },
  inputIconRight: { marginLeft: 10 },
  inputLabel: { color: '#e6007a', fontWeight: 'bold', fontSize: 13 },
  input: { color: '#000', fontSize: 16, paddingVertical: 2, paddingHorizontal: 0, backgroundColor: 'transparent', borderWidth: 0 },
  continueBtn: { backgroundColor: '#e6007a', borderRadius: 6, marginTop: 28, paddingVertical: 16, alignItems: 'center' },
  continueBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  recentSection: { backgroundColor: '#fff', padding: 18, borderRadius: 0, marginTop: 0 },
  recentDate: { color: '#222', fontWeight: 'bold', fontSize: 15, marginBottom: 10, textAlign: 'center' },
  recentItem: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#eee', paddingVertical: 12 },
  recentTime: { color: '#888', fontSize: 13 },
  recentName: { color: '#000', fontWeight: 'bold', fontSize: 16 },
  recentDesc: { color: '#888', fontSize: 13 },
  recentIban: { color: '#888', fontSize: 12 },
  recentStatus: { color: '#888', fontSize: 13, textAlign: 'right' },
  recentAmount: { color: '#e6007a', fontWeight: 'bold', fontSize: 18, textAlign: 'right' },
  repeatBtn: { backgroundColor: '#e6007a', borderRadius: 6, marginTop: 6, paddingVertical: 6, paddingHorizontal: 18 },
  repeatBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  emptyFavSection: { flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 60 },
  emptyFavTitle: { color: '#222', fontWeight: 'bold', fontSize: 18, marginBottom: 6 },
  emptyFavText: { color: '#888', fontSize: 15, textAlign: 'center' },
}); 
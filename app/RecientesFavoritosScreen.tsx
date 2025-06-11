import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const TABS = ['RECIENTES', 'FAVORITOS'];

function formatAmount(amount: number) {
  return amount.toLocaleString('en-US', { maximumFractionDigits: 0 }) + ' €';
}

function Header({ onClose }: { onClose: () => void }) {
  return (
    <View style={styles.headerWrap}>
      <TouchableOpacity style={styles.headerIconLeft}>
        <MaterialCommunityIcons name="tune-variant" size={32} color="#fff" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Recientes y favoritos</Text>
      <TouchableOpacity style={styles.headerIconRight} onPress={onClose}>
        <Ionicons name="close" size={36} color="#fff" />
      </TouchableOpacity>
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

function EmptyState({ text }: { text: string }) {
  return (
    <View style={styles.emptyWrap}>
      <MaterialCommunityIcons name="currency-eur-off" size={64} color="#bbb" style={{ marginBottom: 10 }} />
      <Text style={styles.emptyTitle}>LISTADO VACÍO</Text>
      <Text style={styles.emptyText}>{text}</Text>
    </View>
  );
}

function RecentList({ transfers, onRepeat }: { transfers: any[]; onRepeat: (t: any) => void }) {
  if (!transfers.length) {
    return <EmptyState text="Aún no tienes operaciones recientes." />;
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
                <TouchableOpacity style={styles.repeatBtn} onPress={() => onRepeat(t)}>
                  <Text style={styles.repeatBtnText}>Repetir</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}

export default function RecientesFavoritosScreen() {
  const [activeTab, setActiveTab] = useState(0);
  const [recentTransfers, setRecentTransfers] = useState<any[]>([]);
  const [account, setAccount] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      const acc = await AsyncStorage.getItem('accountData');
      setAccount(acc ? JSON.parse(acc) : null);
      const rec = await AsyncStorage.getItem('recentTransfers');
      setRecentTransfers(rec ? JSON.parse(rec) : []);
    };
    load();
  }, []);

  const handleRepeat = async (t: any) => {
    if (!account) return;
    if (parseFloat(account.balance) < t.amount) {
      Alert.alert('Saldo insuficiente', 'No tienes saldo suficiente para repetir esta operación.');
      return;
    }
    Alert.alert(
      'Repetir operación',
      `¿Quieres repetir la transferencia de ${formatAmount(t.amount)} a ${t.beneficiary}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Repetir',
          style: 'default',
          onPress: async () => {
            const newBalance = parseFloat(account.balance) - t.amount;
            const updatedAccount = { ...account, balance: newBalance.toFixed(2) };
            await AsyncStorage.setItem('accountData', JSON.stringify(updatedAccount));
            setAccount(updatedAccount);
            const now = new Date();
            const transfer = {
              ...t,
              date: now.toISOString(),
              time: now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
            };
            const updatedTransfers = [transfer, ...recentTransfers].slice(0, 20);
            await AsyncStorage.setItem('recentTransfers', JSON.stringify(updatedTransfers));
            setRecentTransfers(updatedTransfers);
            Alert.alert('Transferencia realizada', 'La transferencia se ha realizado correctamente.');
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerBg}>
        <Header onClose={() => router.back()} />
        <View style={styles.heartWrap}>
          <MaterialCommunityIcons name="heart-outline" size={48} color="#fff" />
        </View>
        <Text style={styles.bigTitle}>Repetir operación</Text>
        <Text style={styles.bigDesc}>Consulta, edita o repite tus operaciones recientes y favoritas.</Text>
        <TabBar activeTab={activeTab} setActiveTab={setActiveTab} />
      </View>
      <ScrollView style={styles.scroll} contentContainerStyle={{ flexGrow: 1 }}>
        {activeTab === 0 && <RecentList transfers={recentTransfers} onRepeat={handleRepeat} />}
        {activeTab === 1 && <EmptyState text="Aún no tienes operaciones favoritas." />}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f7f7' },
  headerBg: { backgroundColor: '#222', paddingTop: 36, paddingBottom: 18, paddingHorizontal: 0, borderBottomLeftRadius: 32, borderBottomRightRadius: 32 },
  headerWrap: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, marginBottom: 0 },
  headerIconLeft: { padding: 4 },
  headerIconRight: { padding: 4 },
  headerTitle: { color: '#fff', fontSize: 22, fontWeight: 'bold', flex: 1, textAlign: 'center', marginLeft: -32 },
  heartWrap: { alignItems: 'center', marginTop: 10 },
  bigTitle: { color: '#fff', fontSize: 38, fontWeight: '300', textAlign: 'center', marginTop: 8 },
  bigDesc: { color: '#fff', fontSize: 16, textAlign: 'center', marginBottom: 10 },
  tabBar: { flexDirection: 'row', backgroundColor: 'transparent', marginBottom: 0, marginTop: 10 },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 12, backgroundColor: 'transparent' },
  tabActive: {},
  tabText: { color: '#fff', fontWeight: 'bold', fontSize: 16, opacity: 0.7 },
  tabTextActive: { color: '#fff', opacity: 1 },
  tabUnderline: { height: 3, backgroundColor: '#e6007a', width: '80%', borderRadius: 2, marginTop: 6 },
  scroll: { flex: 1 },
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
  emptyWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 60 },
  emptyTitle: { color: '#222', fontWeight: 'bold', fontSize: 18, marginBottom: 6 },
  emptyText: { color: '#888', fontSize: 15, textAlign: 'center' },
}); 
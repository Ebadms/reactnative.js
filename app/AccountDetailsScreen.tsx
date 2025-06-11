import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

function formatAmount(amount: number) {
  // 1,000 € or -1,000 €
  const abs = Math.abs(amount);
  const formatted = abs.toLocaleString('en-US', { maximumFractionDigits: 0 });
  return (amount < 0 ? '-' : '') + formatted + ' €';
}

function AccountHeader({ account, onClose }: { account: any; onClose: () => void }) {
  return (
    <View style={styles.headerBg}>
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>{account?.name || 'Cuenta Joven'}</Text>
        <TouchableOpacity onPress={onClose} style={styles.headerClose}>
          <Ionicons name="close" size={36} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

function AccountCard({ account }: { account: any }) {
  return (
    <View style={styles.accountCardGlass}>
      <View style={styles.accountCardRow}>
        <MaterialCommunityIcons name="file-document-outline" size={32} color="#fff" />
        <Text style={styles.accountCardTitle}>EVO **** {account?.iban?.slice(-4) || '----'}</Text>
        <TouchableOpacity>
          <MaterialIcons name="content-copy" size={28} color="#fff" style={{ marginHorizontal: 8 }} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="information-circle-outline" size={28} color="#fff" />
        </TouchableOpacity>
      </View>
      <Text style={styles.accountCardLabel}>SALDO DISPONIBLE</Text>
      <Text style={styles.accountCardBalance}>{formatAmount(Number(account?.balance || 0))}</Text>
      <Text style={styles.accountCardLabel2}>CUENTA CORRIENTE</Text>
      <Text style={styles.accountCardBalance2}>{formatAmount(Number(account?.balance || 0))}</Text>
    </View>
  );
}

function MovementItem({ movement }: { movement: any }) {
  const isPositive = movement.amount > 0;
  const router = useRouter();
  return (
    <TouchableOpacity onPress={() => router.push({ pathname: '/TransferDetailScreen', params: { transfer: JSON.stringify(movement) } })}>
      <View style={styles.movementItem}>
        <View style={{ flex: 1 }}>
          <Text style={styles.movementTitle}>{movement.title}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
            <MaterialCommunityIcons name={movement.icon || 'swap-horizontal'} size={18} color="#888" style={{ marginRight: 4 }} />
            <Text style={styles.movementType}>{movement.type}</Text>
          </View>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={[styles.movementAmount, { color: isPositive ? '#00c29a' : '#222' }]}>{formatAmount(movement.amount)}</Text>
          {movement.extra && <Text style={styles.movementExtra}>{movement.extra}</Text>}
        </View>
      </View>
    </TouchableOpacity>
  );
}

function MovementList({ movements }: { movements: any[] }) {
  if (!movements.length) return null;
  // Group by date (YYYY-MM-DD)
  const grouped = movements.reduce((acc: Record<string, any[]>, m: any) => {
    // Extract date part only (YYYY-MM-DD) for grouping
    const dateObj = new Date(m.date);
    const dateKey = dateObj.toLocaleDateString('es-ES', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(m);
    return acc;
  }, {} as Record<string, any[]>);
  return (
    <View style={styles.movementList}>
      {Object.entries(grouped).map(([date, items]) => (
        <View key={date}>
          <View style={styles.movementDateWrap}>
            <Text style={styles.movementDate}>{date.toUpperCase()}</Text>
          </View>
          {items.map((m, idx) => <MovementItem key={idx} movement={m} />)}
        </View>
      ))}
    </View>
  );
}

export default function AccountDetailsScreen() {
  const [account, setAccount] = useState<any>(null);
  const [movements, setMovements] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      const acc = await AsyncStorage.getItem('accountData');
      setAccount(acc ? JSON.parse(acc) : null);
      // For demo, use recentTransfers as movements. In real app, use a separate key.
      const rec = await AsyncStorage.getItem('recentTransfers');
      const parsed = rec ? JSON.parse(rec) : [];
      // Map to movement format
      const mapped = parsed.map((t: any) => ({
        date: new Date(t.date).toLocaleDateString('es-ES', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' }),
        title: t.beneficiary || t.destName || t.title || '',
        type: t.amount > 0 ? 'Transferencias De Entrada' : 'Transferencias De Salida',
        amount: t.amount,
        icon: 'swap-horizontal',
        extra: formatAmount(t.amount),
        ...t,
      }));
      setMovements(mapped);
    };
    load();
  }, []);

  return (
    <View style={styles.container}>
      <AccountHeader account={account} onClose={() => router.back()} />
      <ScrollView style={styles.scroll} contentContainerStyle={{ paddingBottom: 40 }}>
        <AccountCard account={account} />
        <View style={styles.searchRow}>
          <Text style={styles.searchLabel}>BUSCAR MOVIMIENTOS</Text>
          <TouchableOpacity>
            <Ionicons name="search" size={28} color="#222" />
          </TouchableOpacity>
        </View>
        <MovementList movements={movements} />
        <TouchableOpacity style={styles.moreBtn}>
          <Text style={styles.moreBtnText}>VER MÁS MOVIMIENTOS</Text>
        </TouchableOpacity>
      </ScrollView>
      <TouchableOpacity style={styles.fab}>
        <MaterialCommunityIcons name="apps" size={36} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  headerBg: { backgroundColor: 'rgba(0,0,0,0.45)', paddingTop: 36, paddingBottom: 0, paddingHorizontal: 0 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16 },
  headerTitle: { color: '#fff', fontSize: 22, fontWeight: 'bold', flex: 1, textAlign: 'center' },
  headerClose: { padding: 4 },
  scroll: { flex: 1 },
  accountCardGlass: { backgroundColor: 'rgba(30,30,40,0.55)', borderRadius: 18, margin: 18, padding: 18, shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 8, shadowOffset: { width: 0, height: 2 } },
  accountCardRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  accountCardTitle: { color: '#fff', fontWeight: 'bold', fontSize: 18, marginLeft: 8, flex: 1 },
  accountCardLabel: { color: '#fff', fontWeight: 'bold', fontSize: 13, marginTop: 8 },
  accountCardBalance: { color: '#fff', fontWeight: 'bold', fontSize: 32, marginVertical: 2 },
  accountCardLabel2: { color: '#fff', fontWeight: 'bold', fontSize: 13, marginTop: 8 },
  accountCardBalance2: { color: '#fff', fontWeight: 'bold', fontSize: 18, marginBottom: 4 },
  searchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: 18, marginTop: 8, marginBottom: 0 },
  searchLabel: { color: '#222', fontWeight: 'bold', fontSize: 16 },
  movementList: { marginTop: 10 },
  movementDateWrap: { backgroundColor: '#f3f3f3', borderRadius: 8, marginHorizontal: 18, marginTop: 18, marginBottom: 0, padding: 8, alignItems: 'center' },
  movementDate: { color: '#222', fontWeight: 'bold', fontSize: 15 },
  movementItem: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#eee', paddingVertical: 16, marginHorizontal: 18 },
  movementTitle: { color: '#222', fontWeight: 'bold', fontSize: 16 },
  movementType: { color: '#888', fontSize: 13 },
  movementAmount: { fontWeight: 'bold', fontSize: 20 },
  movementExtra: { color: '#888', fontSize: 13 },
  moreBtn: { backgroundColor: '#f3f3f3', borderRadius: 8, margin: 18, marginTop: 24, paddingVertical: 16, alignItems: 'center' },
  moreBtnText: { color: '#222', fontWeight: 'bold', fontSize: 16 },
  fab: { position: 'absolute', bottom: 24, alignSelf: 'center', backgroundColor: '#e6007a', width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center', elevation: 8, shadowColor: '#000', shadowOpacity: 0.18, shadowRadius: 8, shadowOffset: { width: 0, height: 2 } },
}); 
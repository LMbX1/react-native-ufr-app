// my-app/app/(tabs)/index.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  SafeAreaView,
  StatusBar,
  Alert,
  Dimensions,
  Button, // Adicionado para alternar papel do usuário
  Platform, // Adicionado para checagem de permissões
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Siren, AlertTriangle, Bell, Home, Map as MapIcon, User, Settings, Phone, LogOut, Clock, MessageCircleMore, ShieldCheck } from 'lucide-react-native';

// NOVO: Importar expo-location
import * as Location from 'expo-location';

// Importe o componente de chat separado
import ChatModal from '../components/ChatModal';
// Importe o componente de login separado
import LoginScreen from '../auth/login';

const { width, height } = Dimensions.get('window');

// Definições de tipos
interface Notification {
  id: number;
  type: 'alert' | 'info' | 'emergency';
  message: string;
  time: string;
}

interface RiskArea {
  name: string;
  risk: 'alto' | 'médio';
  incidents: number;
  latitude: number;
  longitude: number;
}

interface EmergencyAlert {
  id: string;
  latitude: number;
  longitude: number;
  timestamp: Date;
  userId?: string;
  message?: string;
}

type UserRole = 'student' | 'security';

const UFRSecurityApp = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [emergencyActive, setEmergencyActive] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: 1, type: 'alert', message: 'Incidente reportado próximo ao Bloco A - Área isolada temporariamente', time: '2h atrás' },
    { id: 2, type: 'info', message: 'Manutenção da iluminação no estacionamento concluída', time: '1 dia atrás' }
  ]);

  const [currentUserRole, setCurrentUserRole] = useState<UserRole>('student');
  const [activeEmergencyAlerts, setActiveEmergencyAlerts] = useState<EmergencyAlert[]>([]);

  const campusCenter = {
    latitude: -16.465762176133936,
    longitude: -54.579379280325995,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

const riskAreas: RiskArea[] = [
    { name: 'Estacionamento', risk: 'alto', incidents: 5, latitude: -16.466200, longitude: -54.579800 },
    { name: 'Bloco A - Saída Lateral', risk: 'alto', incidents: 3, latitude: -16.465106393548908, longitude: -54.57806331367457 },
    { name: 'Centro de Vivências', risk: 'médio', incidents: 2, latitude: -16.462710732805537, longitude: -54.57837747852901 },
    { name: 'Área do NEATI', risk: 'médio', incidents: 2, latitude: -16.463595792194788, longitude: -54.57844694669665 },
    { name: 'Blocos E e F', risk: 'médio', incidents: 1, latitude: -16.46679100272079, longitude: -54.57910270215579 }
  ];

  // Efeito para solicitar permissão de localização ao montar o componente (opcional, mas bom para UX)
  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') { // expo-location funciona melhor em mobile
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permissão de Localização', 'Para usar todas as funcionalidades de segurança, por favor, habilite a permissão de localização nas configurações do seu dispositivo.');
          return;
        }
      }
    })();
  }, []);


  const handleLoginSuccess = (roleFromLogin: UserRole = 'student') => {
    setIsLoggedIn(true);
    setCurrentUserRole(roleFromLogin);
    setActiveEmergencyAlerts([]);
    setActiveTab('home');
  };

  const handleLogout = () => {
    Alert.alert(
      'Sair',
      'Tem certeza que deseja sair do aplicativo?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: () => {
            setIsLoggedIn(false);
            setActiveTab('home');
            setCurrentUserRole('student');
            setActiveEmergencyAlerts([]);
          }
        }
      ]
    );
  };

  const handleEmergencyPress = async () => { // MODIFICADO para async
    if (currentUserRole === 'security') {
        Alert.alert("Ação não permitida", "Usuários de segurança visualizam emergências, não as criam por este botão.");
        return;
    }

    setEmergencyActive(true);

    let userLatitude = campusCenter.latitude + (Math.random() - 0.5) * 0.003; // Fallback
    let userLongitude = campusCenter.longitude + (Math.random() - 0.5) * 0.003; // Fallback

    try {
      // Solicitar permissão novamente caso não tenha sido dada ou tenha sido revogada
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão Necessária', 'A permissão de localização é necessária para reportar uma emergência com sua localização atual.');
        setEmergencyActive(false);
        return;
      }

      // Obter localização atual
      // Location.Accuracy.High pode consumir mais bateria mas é mais preciso.
      // Para emergências, precisão alta é geralmente preferível.
      let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      userLatitude = location.coords.latitude;
      userLongitude = location.coords.longitude;

    } catch (error) {
      console.error("Erro ao obter localização:", error);
      Alert.alert("Erro de Localização", "Não foi possível obter sua localização precisa. Usando uma localização aproximada.");
      // A emergência continuará com a localização de fallback (simulada/centro do campus)
      // ou você pode optar por não prosseguir se a localização for crucial.
    }


    const newEmergencyAlert: EmergencyAlert = {
      id: `emergency_${Date.now()}`,
      latitude: userLatitude,
      longitude: userLongitude,
      timestamp: new Date(),
      userId: `aluno_${Math.floor(Math.random() * 1000)}`,
      message: "Preciso de ajuda urgente!"
    };

    setActiveEmergencyAlerts(prevAlerts => [...prevAlerts, newEmergencyAlert]);

    Alert.alert(
      'Emergência Acionada!',
      `Sua localização (${userLatitude.toFixed(5)}, ${userLongitude.toFixed(5)}) foi registrada. A segurança foi notificada e está a caminho.`,
      [{ text: 'OK' }]
    );

    setTimeout(() => {
      setNotifications(prev => [{
        id: Date.now(),
        type: 'emergency',
        message: `Sua emergência foi reportada. Localização: (${userLatitude.toFixed(4)}, ${userLongitude.toFixed(4)})`,
        time: 'agora'
      }, ...prev]);
      setEmergencyActive(false);
    }, 3000);
  };

  const toggleUserRole = () => {
    const newRole = currentUserRole === 'student' ? 'security' : 'student';
    setCurrentUserRole(newRole);
    Alert.alert("Papel Alterado", `Agora você está visualizando como: ${newRole}`);
  };


  // Componente HomeTab
  const HomeTab = () => (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>UFR Security</Text>
        <Text style={styles.subtitle}>Sua segurança no campus é nossa prioridade ({currentUserRole})</Text>
      </View>

      {currentUserRole === 'student' && (
        <View style={styles.emergencyContainer}>
          <TouchableOpacity
            style={[styles.emergencyButton, emergencyActive && styles.emergencyButtonActive]}
            onPress={handleEmergencyPress}
            disabled={emergencyActive}
          >
            {emergencyActive ? (
              <Clock color='white' size={46} />
            ) : (
              <Siren color='white' size={46} />
            )}
          </TouchableOpacity>
          <Text style={styles.emergencyTitle}>Botão de Emergência</Text>
          <Text style={styles.emergencySubtitle}>Pressione em caso de perigo imediato</Text>
          {emergencyActive && (
            <Text style={styles.emergencyStatus}>Obtendo localização e conectando com a segurança...</Text>
          )}
        </View>
      )}
      {currentUserRole === 'security' && (
        <View style={styles.securityHomeMessage}>
          <ShieldCheck size={48} color="#10B981" />
          <Text style={styles.securityHomeTitle}>Painel de Segurança</Text>
          <Text style={styles.securityHomeSubtitle}>Monitore alertas de emergência na aba "Mapa".</Text>
           <Text style={styles.securityHomeSubtitle}>Alertas ativos: {activeEmergencyAlerts.length}</Text>
        </View>
      )}


      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#3B82F6' }]}
          onPress={() => setChatOpen(true)}
        >
          <MessageCircleMore color='white' size={32} style={styles.iconStyle} />
          <Text style={styles.actionText}>Chat Segurança</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#F97316' }]}
          onPress={() => setActiveTab('map')}
        >
          <MapIcon color='white' size={32} style={styles.iconStyle} />
          <Text style={styles.actionText}>
            {currentUserRole === 'security' ? 'Mapa de Emergências' : 'Áreas de Risco'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statusContainer}>
        <View style={styles.statusHeader}>
          <View style={styles.statusIndicator} />
          <Text style={styles.statusTitle}>Segurança Online</Text>
        </View>
        <Text style={styles.statusText}>4 seguranças ativos no campus</Text>
        <Text style={styles.statusText}>Tempo médio de resposta: 3-5 minutos</Text>
      </View>
    </ScrollView>
  );

  // Componente MapTab
  const MapTab = () => (
    <View style={styles.container}>
      <View style={styles.mapHeader}>
        <Text style={styles.mapTitle}>
            {currentUserRole === 'security' ? 'Mapa de Emergências Ativas' : 'Mapa de Áreas de Risco'}
        </Text>
        {currentUserRole === 'security' && (
            <Text style={styles.mapSubtitle}>Visualizando alertas em tempo real. ({activeEmergencyAlerts.length} ativo(s))</Text>
        )}
      </View>

      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={campusCenter}
        showsUserLocation={true} // Mostra a bolinha azul da localização do usuário atual
        showsMyLocationButton={true}
        toolbarEnabled={false}
      >
        {riskAreas.map((area, index) => (
          <Marker
            key={`risk-${index}`}
            coordinate={{
              latitude: area.latitude,
              longitude: area.longitude,
            }}
            title={area.name}
            description={`${area.incidents} incident${area.incidents !== 1 ? 'es' : 'e'} - Risco ${area.risk}`}
            pinColor={area.risk === 'alto' ? '#EF4444' : '#F59E0B'}
          />
        ))}

        {currentUserRole === 'security' && activeEmergencyAlerts.map(alert => (
          <Marker
            key={alert.id}
            coordinate={{ latitude: alert.latitude, longitude: alert.longitude }}
            title="ALERTA DE EMERGÊNCIA!"
            description={`ID: ${alert.userId}\nHorário: ${alert.timestamp.toLocaleTimeString()}\n${alert.message || ''}`}
          >
            <View style={styles.emergencyMarker}>
              <Siren color="white" size={24} />
            </View>
          </Marker>
        ))}
      </MapView>

      {currentUserRole === 'student' && (
         <ScrollView style={styles.areasList} contentContainerStyle={styles.areasListContent}>
            <Text style={styles.subsectionTitle}>Áreas Monitoradas</Text>
            {riskAreas.map((area, index) => (
            <View key={index} style={styles.areaItem}>
                 <View style={styles.areaHeader}>
              <View style={styles.areaInfo}>
                <View style={[
                  styles.riskIndicator,
                  { backgroundColor: area.risk === 'alto' ? '#EF4444' : '#F59E0B' }
                ]} />
                <View>
                  <Text style={styles.areaName}>{area.name}</Text>
                  <Text style={styles.areaIncidents}>
                    {area.incidents} incident{area.incidents !== 1 ? 'es' : 'e'} reportado{area.incidents !== 1 ? 's' : ''}
                  </Text>
                </View>
              </View>
              <View style={[
                styles.riskBadge,
                { backgroundColor: area.risk === 'alto' ? '#FEF2F2' : '#FFFBEB' }
              ]}>
                <Text style={[
                  styles.riskBadgeText,
                  { color: area.risk === 'alto' ? '#991B1B' : '#92400E' }
                ]}>
                  {area.risk.toUpperCase()}
                </Text>
              </View>
            </View>
            </View>
            ))}
        </ScrollView>
      )}
      {currentUserRole === 'security' && activeEmergencyAlerts.length > 0 && (
        <ScrollView style={styles.areasList} contentContainerStyle={styles.areasListContent}>
            <Text style={styles.subsectionTitle}>Lista de Emergências Ativas</Text>
            {activeEmergencyAlerts.map(alert => (
                 <View key={alert.id} style={[styles.areaItem, styles.emergencyListItem]}>
                     <Siren color="#D32F2F" size={20} style={{marginRight: 10}}/>
                     <View>
                        <Text style={styles.areaName}>Emergência: {alert.userId}</Text>
                        <Text style={styles.areaIncidents}>
                            Lat: {alert.latitude.toFixed(4)}, Lon: {alert.longitude.toFixed(4)}
                        </Text>
                        <Text style={styles.areaIncidents}>
                            Horário: {alert.timestamp.toLocaleTimeString()}
                        </Text>
                     </View>
                 </View>
            ))}
        </ScrollView>
      )}
    </View>
  );

  const NotificationsTab = () => {
    // Conteúdo original da NotificationsTab
    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <Text style={styles.sectionTitle}>Notificações</Text>
  
        {notifications.map(notification => (
          <View key={notification.id} style={[
            styles.notificationItem,
            {
              backgroundColor: notification.type === 'emergency'
                ? '#FEF2F2'
                : notification.type === 'alert'
                  ? '#FFFBEB'
                  : '#EFF6FF',
              borderLeftColor: notification.type === 'emergency'
                ? '#EF4444'
                : notification.type === 'alert'
                  ? '#F59E0B'
                  : '#3B82F6'
            }
          ]}>
            <View style={styles.notificationHeader}>
              <View style={styles.notificationIcon}>
                {notification.type === 'emergency' ? (
                  <Siren color="#EF4444" size={24} />
                ) : notification.type === 'alert' ? (
                  <AlertTriangle color="#F59E0B" size={24} />
                ) : (
                  <Bell color="#3B82F6" size={24} />
                )}
              </View>
              <View style={styles.notificationContent}>
                <Text style={styles.notificationMessage}>{notification.message}</Text>
                <Text style={styles.notificationTime}>{notification.time}</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    );
  };
  
  const ProfileTab = () => {
    // Conteúdo original da ProfileTab
    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <Text style={styles.sectionTitle}>Perfil ({currentUserRole})</Text>
  
         <View style={styles.profileContainer}>
          <View style={styles.profileHeader}>
            <View style={styles.profileAvatar}>
              {currentUserRole === 'security' ? 
                  <ShieldCheck color="white" size={38} /> : 
                  <Text style={styles.profileAvatarText}>👤</Text>
              }
            </View>
            <View>
              <Text style={styles.profileName}>
                  {currentUserRole === 'security' ? 'Equipe Segurança' : 'Usuário UFR'}
              </Text>
              <Text style={styles.profileRole}>
                  {currentUserRole === 'security' ? 'Monitoramento' : 'Estudante'}
              </Text>
            </View>
          </View>
          {currentUserRole === 'student' && (
            <View style={styles.profileInfo}>
            <View style={styles.profileInfoItem}>
              <Text style={styles.profileInfoLabel}>RGA</Text>
              <Text style={styles.profileInfoValue}>20241234 (Exemplo)</Text>
            </View>
            <View style={styles.profileInfoItem}>
              <Text style={styles.profileInfoLabel}>Período</Text>
              <Text style={styles.profileInfoValue}>Noturno</Text>
            </View>
            <View style={styles.profileInfoItem}>
              <Text style={styles.profileInfoLabel}>Status</Text>
              <Text style={[styles.profileInfoValue, { color: '#059669' }]}>Ativo</Text>
            </View>
          </View>
          )}
          </View>
  
        <View style={{ paddingHorizontal: 24, marginVertical: 10 }}>
          <Button
            title={`Mudar para Visão: ${currentUserRole === 'student' ? 'Segurança' : 'Estudante'}`}
            onPress={toggleUserRole}
            color={currentUserRole === 'student' ? '#22C55E' : '#3B82F6'}
          />
        </View>
        <View style={styles.profileActions}>
          <TouchableOpacity style={styles.profileAction}>
            <Settings color='#6B7280' size={24} style={styles.profileActionIcon} />
            <Text style={styles.profileActionText}>Configurações de Privacidade</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.profileAction}>
            <Phone color='#059669' size={24} style={styles.profileActionIcon} />
            <Text style={styles.profileActionText}>Contatos de Emergência</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.profileAction} onPress={handleLogout}>
            <LogOut color='#EF4444' size={24} style={styles.profileActionIcon} />
            <Text style={styles.profileActionText}>Sair do Aplicativo</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  };


  if (!isLoggedIn) {
    return <LoginScreen onLoginSuccess={() => handleLoginSuccess('student')} />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#1E40AF" />
      <View style={styles.appHeader}>
         <View style={styles.appHeaderContent}>
          <View style={styles.appHeaderLeft}>
            <Image source={require('../../assets/images/ufr-logo.png')} style={styles.appHeaderImage} />
            <View>
              <Text style={styles.appHeaderTitle}>UFR Security</Text>
              <Text style={styles.appHeaderSubtitle}>Campus Seguro ({currentUserRole})</Text>
            </View>
          </View>
          <View style={styles.appHeaderRight}>
            <View style={styles.onlineIndicator} />
            <Text style={styles.onlineText}>Online</Text>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        {activeTab === 'home' && <HomeTab />}
        {activeTab === 'map' && <MapTab />}
        {activeTab === 'notifications' && <NotificationsTab />}
        {activeTab === 'profile' && <ProfileTab />}
      </View>

      <View style={styles.bottomNav}>
         {[
          {
            id: 'home',
            icon: currentUserRole === 'security' ? 
                  <ShieldCheck color={activeTab === 'home' ? '#3B82F6' : '#6B7280'} size={24} /> 
                  : <Home color={activeTab === 'home' ? '#3B82F6' : '#6B7280'} size={24} />,
            label: currentUserRole === 'security' ? 'Painel Sec.' : 'Início'
          },
          { id: 'map', icon: <MapIcon color={activeTab === 'map' ? '#3B82F6' : '#6B7280'} size={24} />, label: 'Mapa' },
          { id: 'notifications', icon: <Bell color={activeTab === 'notifications' ? '#3B82F6' : '#6B7280'} size={24} />, label: 'Avisos' },
          { id: 'profile', icon: <User color={activeTab === 'profile' ? '#3B82F6' : '#6B7280'} size={24} />, label: 'Perfil' }
        ].map(tab => (
          <TouchableOpacity
            key={tab.id}
            style={styles.bottomNavItem}
            onPress={() => setActiveTab(tab.id)}
          >
            <View style={styles.bottomNavIcon}>
              {tab.icon}
            </View>
            <Text style={[ styles.bottomNavLabel, activeTab === tab.id && styles.bottomNavLabelActive ]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <ChatModal
        visible={chatOpen}
        onClose={() => setChatOpen(false)}
        initialMessages={[{ id: 1, sender: 'security', message: 'Olá! Como podemos ajudá-lo?', time: '14:30' }]}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mapSubtitle: { fontSize: 14, color: '#6B7280', paddingHorizontal: 24, paddingBottom: 8,},
  emergencyMarker: { backgroundColor: '#DC2626', padding: 8, borderRadius: 20, borderColor: 'white', borderWidth: 2, },
  securityHomeMessage: { backgroundColor: '#E0F2FE', marginHorizontal: 24, borderRadius: 16, padding: 24, alignItems: 'center', marginBottom: 24, borderWidth: 1, borderColor: '#7DD3FC'},
  securityHomeTitle: { fontSize: 20, fontWeight: 'bold', color: '#0C4A6E', marginTop: 12, marginBottom: 4, },
  securityHomeSubtitle: { fontSize: 14, color: '#075985', textAlign: 'center', },
  emergencyListItem: { borderColor: '#D32F2F', borderLeftWidth: 4, backgroundColor: '#FFEBEE'},
  safeArea: { flex: 1, backgroundColor: '#F9FAFB' },
  iconStyle: { marginBottom: 5 },
  appHeader: { backgroundColor: '#ffffff', paddingHorizontal: 16, paddingVertical: 12 },
  appHeaderImage: { width: 30, height: 30, marginRight: 10 },
  appHeaderContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  appHeaderLeft: { flexDirection: 'row', alignItems: 'center' },
  appHeaderTitle: { fontSize: 18, fontWeight: 'bold', color: '#3B82F6' },
  appHeaderSubtitle: { fontSize: 12, color: '#3B82F6' },
  appHeaderRight: { flexDirection: 'row', alignItems: 'center' },
  onlineIndicator: { width: 8, height: 8, backgroundColor: '#10B981', borderRadius: 4, marginRight: 8 },
  onlineText: { fontSize: 12, color: '#1F2937' },
  content: { flex: 1 },
  container: { flex: 1 },
  contentContainer: { paddingBottom: 100 },
  header: { alignItems: 'center', marginBottom: 32, paddingHorizontal: 24, paddingTop: 24 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1F2937', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#6B7280', textAlign: 'center' },
  emergencyContainer: { backgroundColor: '#EF4444', marginHorizontal: 24, borderRadius: 16, padding: 24, alignItems: 'center', marginBottom: 24 },
  emergencyButton: { width: 96, height: 96, backgroundColor: '#DC2626', borderRadius: 48, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  emergencyButtonActive: { backgroundColor: '#991B1B' },
  emergencyTitle: { fontSize: 20, fontWeight: 'bold', color: 'white', marginBottom: 8 },
  emergencySubtitle: { fontSize: 14, color: '#FCA5A5', textAlign: 'center' },
  emergencyStatus: { fontSize: 14, color: '#FCA5A5', marginTop: 8, textAlign: 'center' },
  actionsContainer: { flexDirection: 'row', paddingHorizontal: 24, marginBottom: 24, gap: 16 },
  actionButton: { flex: 1, padding: 16, borderRadius: 12, alignItems: 'center' },
  actionText: { fontSize: 14, fontWeight: '600', color: 'white' },
  statusContainer: { backgroundColor: '#F0FDF4', marginHorizontal: 24, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#BBF7D0' },
  statusHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  statusIndicator: { width: 12, height: 12, backgroundColor: '#10B981', borderRadius: 6, marginRight: 12 },
  statusTitle: { fontSize: 16, fontWeight: '600', color: '#065F46' },
  statusText: { fontSize: 14, color: '#047857', marginBottom: 4 },
  sectionTitle: { fontSize: 24, fontWeight: 'bold', color: '#1F2937', marginBottom: 24, paddingHorizontal: 24, paddingTop: 24 },
  mapHeader: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 16, backgroundColor: '#F9FAFB' },
  mapTitle: { fontSize: 24, fontWeight: 'bold', color: '#1F2937' },
  map: { height: height * 0.4, marginHorizontal:16, marginBottom: 16, borderRadius: 12 },
  areasList: { flex: 1, backgroundColor: '#F9FAFB' },
  areasListContent: { paddingBottom: 20 },
  subsectionTitle: { fontSize: 18, fontWeight: '600', color: '#1F2937', marginBottom: 16, paddingHorizontal: 24 },
  areaItem: { backgroundColor: 'white', marginHorizontal: 24, marginBottom: 12, borderRadius: 8, padding: 16, borderWidth: 1, borderColor: '#E5E7EB', flexDirection: 'row', alignItems: 'center' },
  areaHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flex:1 },
  areaInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  riskIndicator: { width: 12, height: 12, borderRadius: 6, marginRight: 12 },
  areaName: { fontSize: 16, fontWeight: '600', color: '#1F2937' },
  areaIncidents: { fontSize: 14, color: '#6B7280' },
  riskBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  riskBadgeText: { fontSize: 12, fontWeight: '600' },
  notificationItem: { marginHorizontal: 24, marginBottom: 16, borderRadius: 8, padding: 16, borderLeftWidth: 4 },
  notificationHeader: { flexDirection: 'row', alignItems: 'flex-start' },
  notificationIcon: { marginRight: 12, marginTop: 2 },
  notificationContent: { flex: 1 },
  notificationMessage: { fontSize: 14, color: '#1F2937', marginBottom: 4 },
  notificationTime: { fontSize: 12, color: '#6B7280' },
  profileContainer: { backgroundColor: 'white', marginHorizontal: 24, borderRadius: 12, padding: 24, marginBottom: 24, borderWidth: 1, borderColor: '#E5E7EB' },
  profileHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  profileAvatar: { width: 64, height: 64, backgroundColor: '#3B82F6', borderRadius: 32, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  profileAvatarText: { fontSize: 32, color: 'white' },
  profileName: { fontSize: 20, fontWeight: '600', color: '#1F2937' },
  profileRole: { fontSize: 16, color: '#6B7280' },
  profileInfo: { gap: 16 },
  profileInfoItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  profileInfoLabel: { fontSize: 16, color: '#374151' },
  profileInfoValue: { fontSize: 16, fontWeight: '600', color: '#1F2937' },
  profileActions: { gap: 12, paddingHorizontal: 24 },
  profileAction: { backgroundColor: '#F9FAFB', padding: 16, borderRadius: 8, flexDirection: 'row', alignItems: 'center' },
  profileActionIcon: { marginRight: 12 },
  profileActionText: { fontSize: 16, color: '#1F2937' },
  bottomNav: { flexDirection: 'row', backgroundColor: 'white', borderTopWidth: 1, borderTopColor: '#E5E7EB', paddingVertical: 8, paddingHorizontal: 16 },
  bottomNavItem: { flex: 1, alignItems: 'center', paddingVertical: 8 },
  bottomNavIcon: { marginBottom: 4 },
  bottomNavLabel: { fontSize: 12, color: '#6B7280' },
  bottomNavLabelActive: { color: '#3B82F6', fontWeight: '600' },
});

export default UFRSecurityApp;
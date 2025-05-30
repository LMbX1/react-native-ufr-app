// my-app/app/(tabs)/index.tsx
import React, { useState } from 'react';
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
} from 'react-native';

// Importe o componente de chat separado
import ChatModal from '../components/ChatModal';
// Importe o componente de login separado
import LoginScreen from '../auth/login';

const { width } = Dimensions.get('window');

// Definições de tipos (você pode movê-las para um arquivo types.ts separado)
interface Notification { id: number; type: 'alert' | 'info' | 'emergency'; message: string; time: string; }
interface RiskArea { name: string; risk: 'alto' | 'médio'; incidents: number; }

const UFRSecurityApp = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [emergencyActive, setEmergencyActive] = useState(false);
  const [chatOpen, setChatOpen] = useState(false); // Estado para controlar a visibilidade do ChatModal
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: 1, type: 'alert', message: 'Incidente reportado próximo ao Bloco A - Área isolada temporariamente', time: '2h atrás' },
    { id: 2, type: 'info', message: 'Manutenção da iluminação no estacionamento concluída', time: '1 dia atrás' }
  ]);

  const riskAreas: RiskArea[] = [
    { name: 'Estacionamento', risk: 'alto', incidents: 5 },
    { name: 'Bloco A - Saída Lateral', risk: 'alto', incidents: 3 },
    { name: 'Centro de Vivências', risk: 'médio', incidents: 2 },
    { name: 'Área do NEATI', risk: 'médio', incidents: 2 },
    { name: 'Blocos E e F', risk: 'médio', incidents: 1 }
  ];

  // Callback para quando o login for bem-sucedido na LoginScreen
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    // Em um app real, aqui você salvaria tokens de autenticação, informações do usuário, etc.
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
            setActiveTab('home'); // Redireciona para a tela inicial ou login após sair
          }
        }
      ]
    );
  };

  const handleEmergencyPress = () => {
    setEmergencyActive(true);
    Alert.alert(
      'Emergência Acionada!',
      'A segurança foi notificada e está a caminho da sua localização.',
      [{ text: 'OK' }]
    );

    setTimeout(() => {
      setNotifications(prev => [{
        id: Date.now(),
        type: 'emergency',
        message: 'Emergência acionada! Segurança a caminho da sua localização.',
        time: 'agora'
      }, ...prev]);
      setEmergencyActive(false);
    }, 3000);
  };

  // --- Componentes das Abas (mantidos aqui para simplicidade, mas idealmente separados) ---
  const HomeTab = () => (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>UFR Security</Text>
        <Text style={styles.subtitle}>Sua segurança no campus é nossa prioridade</Text>
      </View>

      {/* Botão de Emergência */}
      <View style={styles.emergencyContainer}>
        <TouchableOpacity
          style={[styles.emergencyButton, emergencyActive && styles.emergencyButtonActive]}
          onPress={handleEmergencyPress}
          disabled={emergencyActive}
        >
          <Text style={styles.emergencyButtonText}>
            {emergencyActive ? '⏳' : 'SOS'}
          </Text>
        </TouchableOpacity>
        <Text style={styles.emergencyTitle}>Botão de Emergência</Text>
        <Text style={styles.emergencySubtitle}>Pressione em caso de perigo imediato</Text>
        {emergencyActive && (
          <Text style={styles.emergencyStatus}>Conectando com a segurança...</Text>
        )}
      </View>

      {/* Ações Rápidas */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#3B82F6' }]}
          onPress={() => setChatOpen(true)} // Abre o modal de chat
        >
          <Text style={styles.actionIcon}>💬</Text>
          <Text style={styles.actionText}>Chat Segurança</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#F97316' }]}
          onPress={() => setActiveTab('map')}
        >
          <Text style={styles.actionIcon}>🗺️</Text>
          <Text style={styles.actionText}>Áreas de Risco</Text>
        </TouchableOpacity>
      </View>

      {/* Status da Segurança */}
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

  const MapTab = () => (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.sectionTitle}>Mapa de Áreas de Risco</Text>

      {/* Mapa Simulado */}
      <View style={styles.mapContainer}>
        <Text style={styles.mapIcon}>🗺️</Text>
        <Text style={styles.mapText}>Campus UFR - Vista Geral</Text>

        {/* Pontos de Risco Simulados */}
        <View style={[styles.riskPoint, { top: 20, left: 20, backgroundColor: '#EF4444' }]} />
        <View style={[styles.riskPoint, { top: 40, right: 30, backgroundColor: '#F59E0B' }]} />
        <View style={[styles.riskPoint, { bottom: 20, left: 40, backgroundColor: '#EF4444' }]} />
        <View style={[styles.riskPoint, { bottom: 30, right: 20, backgroundColor: '#F59E0B' }]} />
      </View>

      {/* Lista de Áreas */}
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
  );

  const NotificationsTab = () => (
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
            <Text style={styles.notificationIcon}>
              {notification.type === 'emergency' ? '🚨' :
               notification.type === 'alert' ? '⚠️' : '🔔'}
            </Text>
            <View style={styles.notificationContent}>
              <Text style={styles.notificationMessage}>{notification.message}</Text>
              <Text style={styles.notificationTime}>{notification.time}</Text>
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );

  const ProfileTab = () => (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.sectionTitle}>Perfil</Text>

      <View style={styles.profileContainer}>
        <View style={styles.profileHeader}>
          <View style={styles.profileAvatar}>
            <Text style={styles.profileAvatarText}>👤</Text>
          </View>
          <View>
            <Text style={styles.profileName}>Usuário UFR</Text>
            <Text style={styles.profileRole}>Estudante</Text>
          </View>
        </View>

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
      </View>

      <View style={styles.profileActions}>
        <TouchableOpacity style={styles.profileAction}>
          <Text style={styles.profileActionIcon}>⚙️</Text>
          <Text style={styles.profileActionText}>Configurações de Privacidade</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.profileAction}>
          <Text style={styles.profileActionIcon}>📞</Text>
          <Text style={styles.profileActionText}>Contatos de Emergência</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.profileAction} onPress={handleLogout}>
          <Text style={styles.profileActionIcon}>🚪</Text>
          <Text style={styles.profileActionText}>Sair do Aplicativo</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
  // --- Fim dos Componentes das Abas ---

  // Se não estiver logado, mostra a tela de login
  if (!isLoggedIn) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  // Se estiver logado, mostra o app principal
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#1E40AF" />

      {/* Header do App */}
      <View style={styles.appHeader}>
        <View style={styles.appHeaderContent}>
          <View style={styles.appHeaderLeft}>
            <Image source={require('../../assets/images/ufr-logo.png')} style={styles.appHeaderImage} />
            <View>
              <Text style={styles.appHeaderTitle}>UFR Security</Text>
              <Text style={styles.appHeaderSubtitle}>Campus Seguro</Text>
            </View>
          </View>
          <View style={styles.appHeaderRight}>
            <View style={styles.onlineIndicator} />
            <Text style={styles.onlineText}>Online</Text>
          </View>
        </View>
      </View>

      {/* Conteúdo Principal (abas) */}
      <View style={styles.content}>
        {activeTab === 'home' && <HomeTab />}
        {activeTab === 'map' && <MapTab />}
        {activeTab === 'notifications' && <NotificationsTab />}
        {activeTab === 'profile' && <ProfileTab />}
      </View>

      {/* Navegação Inferior (Bottom Navigation) */}
      <View style={styles.bottomNav}>
        {[
          { id: 'home', icon: '🏠', label: 'Início' },
          { id: 'map', icon: '🗺️', label: 'Mapa' },
          { id: 'notifications', icon: '🔔', label: 'Avisos' },
          { id: 'profile', icon: '👤', label: 'Perfil' }
        ].map(tab => (
          <TouchableOpacity
            key={tab.id}
            style={styles.bottomNavItem}
            onPress={() => setActiveTab(tab.id)}
          >
            <Text style={[
              styles.bottomNavIcon,
              activeTab === tab.id && styles.bottomNavIconActive
            ]}>
              {tab.icon}
            </Text>
            <Text style={[
              styles.bottomNavLabel,
              activeTab === tab.id && styles.bottomNavLabelActive
            ]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Renderiza o ChatModal como um componente separado */}
      <ChatModal
        visible={chatOpen}
        onClose={() => setChatOpen(false)}
        initialMessages={[{ id: 1, sender: 'security', message: 'Olá! Como podemos ajudá-lo?', time: '14:30' }]}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // Estilos do LoginScreen DEVE ser removido daqui ou importado se desejar ter styles em um arquivo separado
  // Como o LoginScreen é um componente separado, ele deve gerenciar seus próprios estilos.
  // REMOVA OS ESTILOS DO LOGINSCREEN DAQUI:
  /*
  loginContainer: { ... },
  loginKeyboardView: { ... },
  ...
  helpLinkText: { ... },
  */

  // Estilos existentes do app (mantidos aqui)
  safeArea: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  appHeader: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  appHeaderImage: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  appHeaderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  appHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appHeaderIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  appHeaderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'blue',
  },
  appHeaderSubtitle: {
    fontSize: 12,
    color: 'blue',
  },
  appHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  onlineIndicator: {
    width: 8,
    height: 8,
    backgroundColor: '#10B981',
    borderRadius: 4,
    marginRight: 8,
  },
  onlineText: {
    fontSize: 12,
    color: 'black',
  },
  content: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 100,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  emergencyContainer: {
    backgroundColor: '#EF4444',
    marginHorizontal: 24,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
  },
  emergencyButton: {
    width: 96,
    height: 96,
    backgroundColor: '#DC2626',
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emergencyButtonActive: {
    backgroundColor: '#991B1B',
  },
  emergencyButtonText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  emergencyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  emergencySubtitle: {
    fontSize: 14,
    color: '#FCA5A5',
    textAlign: 'center',
  },
  emergencyStatus: {
    fontSize: 14,
    color: '#FCA5A5',
    marginTop: 8,
    textAlign: 'center',
  },
  actionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 24,
    gap: 16,
  },
  actionButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  actionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  statusContainer: {
    backgroundColor: '#F0FDF4',
    marginHorizontal: 24,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    backgroundColor: '#10B981',
    borderRadius: 6,
    marginRight: 12,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#065F46',
  },
  statusText: {
    fontSize: 14,
    color: '#047857',
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 24,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  mapContainer: {
    backgroundColor: '#DCFCE7',
    marginHorizontal: 24,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    position: 'relative',
    minHeight: 150,
  },
  mapIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  mapText: {
    fontSize: 16,
    color: '#6B7280',
  },
  riskPoint: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  subsectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
    paddingHorizontal: 24,
  },
  areaItem: {
    backgroundColor: 'white',
    marginHorizontal: 24,
    marginBottom: 12,
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  areaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  areaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  riskIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  areaName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  areaIncidents: {
    fontSize: 14,
    color: '#6B7280',
  },
  riskBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  riskBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  notificationItem: {
    marginHorizontal: 24,
    marginBottom: 16,
    borderRadius: 8,
    padding: 16,
    borderLeftWidth: 4,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  notificationIcon: {
    fontSize: 20,
    marginRight: 12,
    marginTop: 2,
  },
  notificationContent: {
    flex: 1,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#1F2937',
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 12,
    color: '#6B7280',
  },
  profileContainer: {
    backgroundColor: 'white',
    marginHorizontal: 24,
    borderRadius: 12,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  profileAvatar: {
    width: 64,
    height: 64,
    backgroundColor: '#3B82F6',
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileAvatarText: {
    fontSize: 32,
    color: 'white',
  },
  profileName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
  },
  profileRole: {
    fontSize: 16,
    color: '#6B7280',
  },
  profileInfo: {
    gap: 16,
  },
  profileInfoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  profileInfoLabel: {
    fontSize: 16,
    color: '#374151',
  },
  profileInfoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  profileActions: {
    gap: 12,
    paddingHorizontal: 24,
  },
  profileAction: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileActionIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  profileActionText: {
    fontSize: 16,
    color: '#1F2937',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  bottomNavItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  bottomNavIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  bottomNavIconActive: {
    opacity: 1,
  },
  bottomNavLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  bottomNavLabelActive: {
    color: '#3B82F6',
    fontWeight: '600',
  },
  // REMOVA ESTES ESTILOS DE CHAT TAMBÉM, pois eles agora pertencem ao ChatModal.tsx
  /*
  chatContainer: { ... },
  chatHeader: { ... },
  ...
  chatSendText: { ... },
  */
});

export default UFRSecurityApp;
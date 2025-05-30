// my-app/app/auth/login.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  SafeAreaView,
  StatusBar,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

// Você pode mover os estilos para um arquivo separado para melhor organização,
// mas para manter a correção no mesmo arquivo, vamos mantê-los aqui por enquanto.
const styles = StyleSheet.create({
  loginContainer: {
    flex: 1,
    backgroundColor: '#1E40AF',
  },
  loginKeyboardView: {
    flex: 1,
  },
  loginScrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  loginHeader: {
    alignItems: 'center',
    marginBottom: 48,
  },
  loginLogo: {
    width: 80,
    height: 80,
    marginBottom: 24,
    tintColor: 'white',
  },
  loginTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  loginSubtitle: {
    fontSize: 16,
    color: '#DBEAFE',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  loginForm: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#F9FAFB',
  },
  loginButton: {
    backgroundColor: '#1E40AF',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  loginButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  testInfo: {
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
    padding: 16,
    marginTop: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  testInfoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E40AF',
    marginBottom: 8,
  },
  testInfoText: {
    fontSize: 14,
    color: '#374151',
    fontFamily: 'monospace',
  },
  loginFooter: {
    alignItems: 'center',
    gap: 16,
  },
  helpLink: {
    paddingVertical: 8,
  },
  helpLinkText: {
    color: '#DBEAFE',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});

interface LoginData {
  rga: string;
  password: string;
}

interface LoginScreenProps {
  onLoginSuccess: () => void; // Callback para quando o login for bem-sucedido
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [loginData, setLoginData] = useState<LoginData>({ rga: '', password: '' });
  const [loginLoading, setLoginLoading] = useState<boolean>(false);

  const handleLogin = async () => {
    if (!loginData.rga.trim() || !loginData.password.trim()) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    if (loginData.rga.length < 8) {
      Alert.alert('Erro', 'RGA deve ter pelo menos 8 dígitos');
      return;
    }

    setLoginLoading(true);

    setTimeout(() => {
      setLoginLoading(false);
      if (loginData.rga === '20241234' && loginData.password === '123456') {
      //  Alert.alert('Sucesso', 'Login realizado com sucesso!');
        onLoginSuccess(); // Chama o callback para indicar sucesso
      } else {
        Alert.alert('Erro', 'RGA ou senha inválidos');
      }
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.loginContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#1E40AF" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.loginKeyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.loginScrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo e Header */}
          <View style={styles.loginHeader}>
            <Image
              source={require('../../assets/images/ufr-logo.png')} // Ajuste o caminho da imagem se necessário
              style={styles.loginLogo}
            />
            <Text style={styles.loginTitle}>UFR Security</Text>
            <Text style={styles.loginSubtitle}>Sua segurança no campus é nossa prioridade</Text>
          </View>

          {/* Formulário de Login */}
          <View style={styles.loginForm}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>RGA</Text>
              <TextInput
                style={styles.textInput}
                value={loginData.rga}
                onChangeText={text => setLoginData(prev => ({ ...prev, rga: text }))}
                placeholder="Digite seu RGA"
                keyboardType="numeric"
                maxLength={12}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Senha</Text>
              <TextInput
                style={styles.textInput}
                value={loginData.password}
                onChangeText={text => setLoginData(prev => ({ ...prev, password: text }))}
                placeholder="Digite sua senha"
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <TouchableOpacity
              style={[styles.loginButton, loginLoading && styles.loginButtonDisabled]}
              onPress={handleLogin}
              disabled={loginLoading}
            >
              <Text style={styles.loginButtonText}>
                {loginLoading ? 'Entrando...' : 'Entrar'}
              </Text>
            </TouchableOpacity>

            {/* Informações de teste */}
            <View style={styles.testInfo}>
              <Text style={styles.testInfoTitle}>🔍 Para testar o app:</Text>
              <Text style={styles.testInfoText}>RGA: 20241234</Text>
              <Text style={styles.testInfoText}>Senha: 123456</Text>
            </View>
          </View>

          {/* Links de ajuda */}
          <View style={styles.loginFooter}>
            <TouchableOpacity style={styles.helpLink}>
              <Text style={styles.helpLinkText}>Esqueceu sua senha?</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.helpLink}>
              <Text style={styles.helpLinkText}>Problemas com o RGA?</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;
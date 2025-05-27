// my-app/app/components/ChatModal.tsx
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

// Definições de tipos (idealmente em um arquivo separado como my-app/app/types.ts)
interface ChatMessage {
  id: number;
  sender: 'user' | 'security';
  message: string;
  time: string;
}

interface ChatModalProps {
  visible: boolean;
  onClose: () => void;
  // Opcional: para passar mensagens iniciais se o chat tiver histórico
  initialMessages?: ChatMessage[];
}

const ChatModal: React.FC<ChatModalProps> = ({ visible, onClose, initialMessages = [] }) => {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(initialMessages);
  const [newMessage, setNewMessage] = useState('');
  const scrollViewRef = useRef<ScrollView>(null); // Ref para rolar o chat

  // Efeito para rolar automaticamente para o final quando novas mensagens chegam
  useEffect(() => {
    if (visible) { // Só rola se o modal estiver visível
      setTimeout(() => { // Pequeno atraso para garantir que o layout foi atualizado
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [chatMessages, visible]); // Depende de chatMessages e da visibilidade do modal

  const sendMessage = () => {
    if (newMessage.trim()) {
      const userMessage: ChatMessage = {
        id: Date.now(),
        sender: 'user',
        message: newMessage.trim(),
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      };
      setChatMessages(prev => [...prev, userMessage]);
      setNewMessage('');

      // Simulação de resposta da segurança
      setTimeout(() => {
        const securityResponse: ChatMessage = {
          id: Date.now() + 1, // Garante ID único
          sender: 'security',
          message: 'Recebido! Estamos verificando a situação.',
          time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        };
        setChatMessages(prev => [...prev, securityResponse]);
      }, 1500); // Resposta simulada após 1.5 segundos
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaView style={styles.chatContainer}>
        <View style={styles.chatHeader}>
          <Text style={styles.chatTitle}>Chat com Segurança</Text>
          <TouchableOpacity onPress={onClose} style={styles.chatCloseButton}>
            <Text style={styles.chatCloseText}>✕</Text>
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingView}
          // Ajuste este offset para Android se o teclado ainda cobrir o input
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -200}
        >
          <ScrollView
            ref={scrollViewRef}
            style={styles.chatMessages}
            contentContainerStyle={styles.chatMessagesContent}
          >
            {chatMessages.map(message => (
              <View
                key={message.id}
                style={[
                  styles.messageContainer,
                  message.sender === 'user' ? styles.userMessage : styles.securityMessage,
                ]}
              >
                <View
                  style={[
                    styles.messageBubble,
                    message.sender === 'user' ? styles.userBubble : styles.securityBubble,
                  ]}
                >
                  <Text
                    style={[
                      styles.messageText,
                      message.sender === 'user' ? styles.userMessageText : styles.securityMessageText,
                    ]}
                  >
                    {message.message}
                  </Text>
                  <Text
                    style={[
                      styles.messageTime,
                      message.sender === 'user' ? styles.userMessageTime : styles.securityMessageTime,
                    ]}
                  >
                    {message.time}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>

          <View style={styles.chatInput}>
            <TextInput
              style={styles.chatTextInput}
              value={newMessage}
              onChangeText={setNewMessage}
              placeholder="Digite sua mensagem..."
              multiline
              // Importante para evitar desfoque e garantir que o teclado não desapareça
              blurOnSubmit={false}
              returnKeyType="send"
              onSubmitEditing={sendMessage}
            />
            <TouchableOpacity style={styles.chatSendButton} onPress={sendMessage}>
              <Text style={styles.chatSendText}>➤</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  chatContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  chatTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  chatCloseButton: {
    padding: 8,
  },
  chatCloseText: {
    fontSize: 20,
    color: '#6B7280',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  chatMessages: {
    flex: 1,
  },
  chatMessagesContent: {
    padding: 16,
  },
  messageContainer: {
    marginBottom: 16,
  },
  userMessage: {
    alignItems: 'flex-end',
  },
  securityMessage: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 12,
  },
  userBubble: {
    backgroundColor: '#3B82F6', // Azul UFR
  },
  securityBubble: {
    backgroundColor: '#F3F4F6', // Cinza claro
  },
  messageText: {
    fontSize: 14,
    marginBottom: 4,
  },
  userMessageText: {
    color: 'white',
  },
  securityMessageText: {
    color: '#1F2937',
  },
  messageTime: {
    fontSize: 12,
  },
  userMessageTime: {
    color: '#DBEAFE', // Azul mais claro
  },
  securityMessageTime: {
    color: '#6B7280', // Cinza escuro
  },
  chatInput: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    alignItems: 'flex-end',
  },
  chatTextInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    maxHeight: 100, // Limita a altura do TextInput
  },
  chatSendButton: {
    backgroundColor: '#3B82F6',
    padding: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatSendText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ChatModal;
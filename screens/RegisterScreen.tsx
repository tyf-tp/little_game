import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuthStore } from '../store/authStore';
import { RootStackParamList } from '../App';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function RegisterScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { register } = useAuthStore();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !username || !password || !confirmPassword) {
      Alert.alert('错误', '请填写所有字段');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('错误', '两次密码不一致');
      return;
    }

    if (password.length < 6) {
      Alert.alert('错误', '密码至少6位');
      return;
    }

    setLoading(true);
    const success = await register(email, password, username);
    setLoading(false);

    if (success) {
      navigation.replace('MainMenu');
    } else {
      Alert.alert('注册失败', '请稍后重试');
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.content}>
        <Text style={styles.title}>创建账号</Text>
        <Text style={styles.subtitle}>开始你的冒险</Text>

        <View style={styles.form}>
          <TextInput style={styles.input} placeholder="邮箱" placeholderTextColor="#666" value={email}
            onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
          <TextInput style={styles.input} placeholder="用户名" placeholderTextColor="#666" value={username}
            onChangeText={setUsername} />
          <TextInput style={styles.input} placeholder="密码" placeholderTextColor="#666" value={password}
            onChangeText={setPassword} secureTextEntry />
          <TextInput style={styles.input} placeholder="确认密码" placeholderTextColor="#666" value={confirmPassword}
            onChangeText={setConfirmPassword} secureTextEntry />

          <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>注册</Text>}
          </TouchableOpacity>

          <TouchableOpacity style={styles.linkButton} onPress={() => navigation.goBack()}>
            <Text style={styles.linkText}>已有账号? 登录</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e' },
  content: { flex: 1, justifyContent: 'center', paddingHorizontal: 40 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#e94560', textAlign: 'center', marginBottom: 10 },
  subtitle: { fontSize: 16, color: '#888', textAlign: 'center', marginBottom: 40 },
  form: { gap: 16 },
  input: { backgroundColor: '#16213e', borderRadius: 10, padding: 15, fontSize: 16, color: '#fff', borderWidth: 1, borderColor: '#333' },
  button: { backgroundColor: '#e94560', borderRadius: 10, padding: 15, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  linkButton: { alignItems: 'center', marginTop: 20 },
  linkText: { color: '#4a9eff', fontSize: 14 },
});

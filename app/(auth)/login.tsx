import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { authService } from '../../services/api';
import { useAuth } from '../../contexts/auth.context';
import Toast from 'react-native-toast-message';
import { fonts } from '~/styles';
import useValidate, { ValidationRules } from '~/hooks/useValidate';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({ username: '', password: '' });
  const { login } = useAuth();
  const { validate } = useValidate();

  const validationSchema: ValidationRules = {
    username: {
      type: "email",
      required: true,
      message: "Please enter a valid email address"
    },
    password: {
      type: "string",
      required: true,
      minLength: 6,
      message: "Password must be at least 6 characters"
    }
  };

  const validateField = (name: string, value: string) => {
    const fieldSchema = { [name]: validationSchema[name] };
    const fieldData = { [name]: value };
    const { errors } = validate(fieldData, fieldSchema);
    setErrors(prev => ({
      ...prev,
      [name]: errors[name] || ""
    }));
  };

  const handleLogin = async () => {
    const { isValid, errors } = validate({ username, password }, validationSchema);
    setErrors({
      username: errors.username || '',
      password: errors.password || ''
    });

    if (!isValid) {
      return;
    }

    setIsLoading(true);
    try {
      // const user = await authService.login({ username, password });
      const user = {
          id: '1',
          username: 'nathan',
          password: '1234',
          name: 'nathan'
      }
      await login(user);
      router.replace('/(tabs)');
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Login failed',
        text2: error instanceof Error ? error.message : 'Login failed',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white px-6">
      {/* Logo */}
      <View className="items-center mt-16 mb-8">
        <View className="bg-blue-500 w-20 h-20 rounded-2xl items-center justify-center mb-4">
          <Text style={fonts.textBold} className="text-white text-lg leading-5">smile</Text>
          <Text style={fonts.textBold} className="text-white text-lg leading-5">care</Text>
          <View className="w-12 h-1.5 bg-white rounded-full mt-1" />
        </View>
      </View>

      {/* Heading */}
      <View className="mb-8">
        <Text style={fonts.textBold} className="text-3xl text-black">Logando</Text>
        <Text style={fonts.textLight} className="text-3xl text-black">no SmileCare</Text>
      </View>

      {/* Email Input */}
      <View className="mb-4">
        <Text style={fonts.textSemiBold} className="text-lg text-black mb-3">E-mail</Text>
        <View className="flex-row items-center border border-gray-300 rounded-lg px-4 py-4">
          <Text className="text-gray-400 mr-3 text-lg">✉️</Text>
          <TextInput
            style={fonts.text}
            className="flex-1 text-base text-gray-700"
            placeholder="nome@dominio.com"
            placeholderTextColor="#9CA3AF"
            value={username}
            onChangeText={(text) => {
              setUsername(text);
              validateField('username', text);
            }}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        {errors.username ? (
          <Text style={fonts.text} className="text-red-500 text-sm mt-1">{errors.username}</Text>
        ) : null}
      </View>

      {/* Password Input */}
      <View className="mb-3">
        <Text style={fonts.textSemiBold} className="text-lg text-black mb-3">Senha</Text>
        <View className="flex-row items-center border border-gray-300 rounded-lg px-4 py-4">
          <Text className="text-gray-400 mr-3 text-lg">🔒</Text>
          <TextInput
            style={fonts.text}
            className="flex-1 text-base text-gray-700"
            placeholder="Senha"
            placeholderTextColor="#9CA3AF"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              validateField('password', text);
            }}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Text className="text-gray-400 text-lg">{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
          </TouchableOpacity>
        </View>
        {errors.password ? (
          <Text style={fonts.text} className="text-red-500 text-sm mt-1">{errors.password}</Text>
        ) : null}
      </View>

      {/* Forgot Password */}
      <View className="items-end mb-8">
        <TouchableOpacity>
          <Text style={fonts.textSemiBold} className="text-blue-500">Esqueceu a senha?</Text>
        </TouchableOpacity>
      </View>

      {/* Login Button */}
      <TouchableOpacity 
        className="bg-blue-500 rounded-lg py-4 items-center mb-8"
        onPress={handleLogin}
        disabled={isLoading}
      >
        <Text style={fonts.textSemiBold} className="text-white text-lg">
          {isLoading ? 'Entrando...' : 'Entrar na conta'}
        </Text>
      </TouchableOpacity>

      {/* Sign Up */}
      <View className="flex-row justify-center">
        <Text style={fonts.text} className="text-gray-500">Ainda não tem uma conta? </Text>
        <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
          <Text style={fonts.textSemiBold} className="text-blue-500">Crie uma</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
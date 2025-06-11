import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image  } from 'react-native';
import { router } from 'expo-router';
import { authService } from '../../services/api';
import { useAuth } from '../../contexts/auth.context';
import Toast from 'react-native-toast-message';
import { fonts } from '~/styles';
import useValidate, { ValidationRules } from '~/hooks/useValidate';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';


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
      const user = await authService.login({ username, password });
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
    <View className="flex-1 bg-white">
      <View className="flex-1 px-6 pt-24 ">
        {/* Logo */}
        <View className="items-start mb-12">
          <View className="w-20 h-20 rounded-2xl items-center justify-center">
            <Image 
              source={require('../../assets/logo-smilecare.png')} 
              className="w-20 h-20"
              resizeMode="contain"
            />
          </View>
        </View>

        {/* Title */}
        <View className="mb-12 flex-row">
          <Text style={fonts.textBold} className="text-3xl text-black">Logando </Text>
          <Text style={fonts.text} className="text-3xl text-black">no SmileCare</Text>
        </View>


        {/* Email Field */}
        <View className="mb-6">
          <Text style={fonts.textSemiBold} className="text-lg text-black mb-4">E-mail</Text>
          <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-4">
            <Feather name="mail" size={20} color="#9CA3AF" className="mr-3" />
            <TextInput
              style={fonts.text}
              className="flex-1 text-base text-gray-800"
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
            <Text style={fonts.text} className="text-red-500 text-sm mt-2">{errors.username}</Text>
          ) : null}
        </View>

        {/* Password Field */}
        <View className="mb-4">
          <Text style={fonts.textSemiBold} className="text-lg text-black mb-4">Senha</Text>
          <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-4">
            <MaterialCommunityIcons name="lock-outline" size={20} color="#9CA3AF" className="mr-3"/>
            <TextInput
              style={fonts.text}
              className="flex-1 text-base text-gray-800"
              placeholder="Senha"
              placeholderTextColor="#9CA3AF"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                validateField('password', text);
              }}
              secureTextEntry={!showPassword}
            />
         <TouchableOpacity 
              onPress={() => setShowPassword(!showPassword)}
              className="ml-3"
            >
              <Feather 
                name={showPassword ? "eye" : "eye-off"} 
                size={20} 
                color="#9CA3AF" 
              />
          </TouchableOpacity>
          </View>
          {errors.password ? (
            <Text style={fonts.text} className="text-red-500 text-sm mt-2">{errors.password}</Text>
          ) : null}
        </View>

        {/* Forgot Password */}
        <View className="items-end mb-12">
          <TouchableOpacity>
            <Text style={fonts.textSemiBold} className="text-blue-500 text-base">Esqueceu a senha?</Text>
          </TouchableOpacity>
        </View>

        {/* Login Button */}
        <TouchableOpacity 
          className="bg-blue-500 rounded-xl py-4 items-center mb-8"
          onPress={handleLogin}
          disabled={isLoading}
        >
          <Text style={fonts.textSemiBold} className="text-white text-lg">
            {isLoading ? 'Entrando...' : 'Entrar na conta'}
          </Text>
        </TouchableOpacity>

        {/* Sign Up Link */}
        <View className="flex-row justify-center">
          <Text style={fonts.text} className="text-gray-500 text-base">Ainda não tem uma conta? </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
            <Text style={fonts.textSemiBold} className="text-blue-500 text-base">Crie uma</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom Home Indicator */}
      <View className="items-center pb-2">
        <View className="w-32 h-1 bg-black rounded-full" />
      </View>
    </View>
  );
}
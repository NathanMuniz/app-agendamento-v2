import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { authService } from '../../services/api';
import Toast from 'react-native-toast-message';
import { fonts } from '~/styles';
import useValidate, { ValidationRules } from '~/hooks/useValidate';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    whatsapp: '',
    password: '',
    confirmPassword: '',
  });
  const { validate } = useValidate();

  const step1ValidationSchema: ValidationRules = {
    name: {
      type: "string",
      required: true,
      message: "Please enter your name"
    },
    email: {
      type: "email",
      required: true,
      message: "Please enter a valid email address"
    },
    whatsapp: {
      type: "string",
      required: true,
      message: "Please enter your WhatsApp number"
    }
  };

  const step2ValidationSchema: ValidationRules = {
    password: {
      type: "string",
      required: true,
      minLength: 6,
      message: "Password must be at least 6 characters"
    },
    confirmPassword: {
      type: "string",
      required: true,
      message: "Please confirm your password"
    }
  };

  const validateField = (name: string, value: string, schema: ValidationRules) => {
    const fieldSchema = { [name]: schema[name] };
    const fieldData = { [name]: value };
    const { errors } = validate(fieldData, fieldSchema);
    setErrors(prev => ({
      ...prev,
      [name]: errors[name] || ""
    }));
  };

  const handleStep1Continue = () => {
    const { isValid, errors } = validate(
      { name, email, whatsapp },
      step1ValidationSchema
    );
    setErrors(prev => ({
      ...prev,
      name: errors.name || '',
      email: errors.email || '',
      whatsapp: errors.whatsapp || '',
    }));

    if (isValid) {
      setCurrentStep(2);
    }
  };

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setErrors(prev => ({
        ...prev,
        confirmPassword: "Passwords do not match"
      }));
      return;
    }

    const { isValid, errors } = validate(
      { password, confirmPassword },
      step2ValidationSchema
    );
    setErrors(prev => ({
      ...prev,
      password: errors.password || '',
      confirmPassword: errors.confirmPassword || '',
    }));

    if (!isValid) {
      return;
    }

    setIsLoading(true);
    try {
      await authService.register({ name, email, whatsapp, password });
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Registration successful! Please login.'
      });
      router.replace('/(auth)/login');
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Registration failed',
        text2: error instanceof Error ? error.message : 'Registration failed',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep1 = () => (
    <>
      {/* Name Field */}
      <View className="mb-6">
        <Text style={fonts.textSemiBold} className="text-lg text-black mb-4">Seu nome</Text>
        <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-4">
          <View className="w-6 h-6 mr-3 items-center justify-center">
            <Text className="text-gray-400 text-base">👤</Text>
          </View>
          <TextInput
            style={fonts.text}
            className="flex-1 text-base text-gray-800"
            placeholder="ex: Luiz Andrade"
            placeholderTextColor="#9CA3AF"
            value={name}
            onChangeText={(text) => {
              setName(text);
              validateField('name', text, step1ValidationSchema);
            }}
          />
        </View>
        {errors.name ? (
          <Text style={fonts.text} className="text-red-500 text-sm mt-2">{errors.name}</Text>
        ) : null}
      </View>

      {/* Email Field */}
      <View className="mb-6">
        <Text style={fonts.textSemiBold} className="text-lg text-black mb-4">E-mail</Text>
        <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-4">
          <View className="w-6 h-6 mr-3 items-center justify-center">
            <Text className="text-gray-400 text-base">✉</Text>
          </View>
          <TextInput
            style={fonts.text}
            className="flex-1 text-base text-gray-800"
            placeholder="nome@dominio.com"
            placeholderTextColor="#9CA3AF"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              validateField('email', text, step1ValidationSchema);
            }}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        {errors.email ? (
          <Text style={fonts.text} className="text-red-500 text-sm mt-2">{errors.email}</Text>
        ) : null}
      </View>

      {/* WhatsApp Field */}
      <View className="mb-12">
        <Text style={fonts.textSemiBold} className="text-lg text-black mb-4">WhatsApp</Text>
        <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-4">
          <View className="w-6 h-6 mr-3 items-center justify-center">
            <Text className="text-gray-400 text-base">📱</Text>
          </View>
          <TextInput
            style={fonts.text}
            className="flex-1 text-base text-gray-800"
            placeholder="(00) 0 0000-0000"
            placeholderTextColor="#9CA3AF"
            value={whatsapp}
            onChangeText={(text) => {
              setWhatsapp(text);
              validateField('whatsapp', text, step1ValidationSchema);
            }}
            keyboardType="phone-pad"
          />
        </View>
        {errors.whatsapp ? (
          <Text style={fonts.text} className="text-red-500 text-sm mt-2">{errors.whatsapp}</Text>
        ) : null}
      </View>

      {/* Continue Button */}
      <TouchableOpacity 
        className="bg-blue-500 rounded-xl py-4 items-center mb-8"
        onPress={handleStep1Continue}
      >
        <Text style={fonts.textSemiBold} className="text-white text-lg">Continuar</Text>
      </TouchableOpacity>
    </>
  );

  const renderStep2 = () => (
    <>
      {/* Password Field */}
      <View className="mb-6">
        <Text style={fonts.textSemiBold} className="text-lg text-black mb-4">Senha</Text>
        <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-4">
          <View className="w-6 h-6 mr-3 items-center justify-center">
            <Text className="text-gray-400 text-base">🔒</Text>
          </View>
          <TextInput
            style={fonts.text}
            className="flex-1 text-base text-gray-800"
            placeholder="Senha"
            placeholderTextColor="#9CA3AF"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              validateField('password', text, step2ValidationSchema);
            }}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity 
            onPress={() => setShowPassword(!showPassword)}
            className="w-6 h-6 items-center justify-center"
          >
            <Text className="text-gray-400 text-base">{showPassword ? '👁' : '👁'}</Text>
          </TouchableOpacity>
        </View>
        {errors.password ? (
          <Text style={fonts.text} className="text-red-500 text-sm mt-2">{errors.password}</Text>
        ) : null}
      </View>

      {/* Confirm Password Field */}
      <View className="mb-12">
        <Text style={fonts.textSemiBold} className="text-lg text-black mb-4">Confirmar senha</Text>
        <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-4">
          <View className="w-6 h-6 mr-3 items-center justify-center">
            <Text className="text-gray-400 text-base">🔒</Text>
          </View>
          <TextInput
            style={fonts.text}
            className="flex-1 text-base text-gray-800"
            placeholder="Senha"
            placeholderTextColor="#9CA3AF"
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text);
              if (text !== password) {
                setErrors(prev => ({
                  ...prev,
                  confirmPassword: "Passwords do not match"
                }));
              } else {
                setErrors(prev => ({
                  ...prev,
                  confirmPassword: ""
                }));
              }
            }}
            secureTextEntry={!showConfirmPassword}
          />
          <TouchableOpacity 
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            className="w-6 h-6 items-center justify-center"
          >
            <Text className="text-gray-400 text-base">{showConfirmPassword ? '👁' : '👁'}</Text>
          </TouchableOpacity>
        </View>
        {errors.confirmPassword ? (
          <Text style={fonts.text} className="text-red-500 text-sm mt-2">{errors.confirmPassword}</Text>
        ) : null}
      </View>

      {/* Continue Button */}
      <TouchableOpacity 
        className="bg-blue-500 rounded-xl py-4 items-center mb-8"
        onPress={handleRegister}
        disabled={isLoading}
      >
        <Text style={fonts.textSemiBold} className="text-white text-lg">
          {isLoading ? 'Criando conta...' : 'Continuar'}
        </Text>
      </TouchableOpacity>
    </>
  );

  return (
    <View className="flex-1 bg-white">
      <View className="flex-1 px-6 pt-16">
        {/* Header */}
        <View className="flex-row items-center mb-12">
          <TouchableOpacity 
            onPress={() => currentStep === 1 ? router.back() : setCurrentStep(1)}
            className="mr-4"
          >
            <Text className="text-2xl">←</Text>
          </TouchableOpacity>
          <Text style={fonts.textSemiBold} className="text-xl text-black">Criando sua conta</Text>
        </View>

        {/* Form Content */}
        {currentStep === 1 ? renderStep1() : renderStep2()}
      </View>

      {/* Bottom Home Indicator */}
      <View className="items-center pb-2">
        <View className="w-32 h-1 bg-black rounded-full" />
      </View>
    </View>
  );
}
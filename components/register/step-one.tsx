import { View, Text, TextInput, TouchableOpacity } from "react-native"
import { fonts } from "~/styles"
import type { ValidationRules } from "~/hooks/useValidate"
import { Feather } from '@expo/vector-icons'

interface StepOneProps {
  name: string
  email: string
  whatsapp: string
  errors: {
    name: string
    email: string
    whatsapp: string
  }
  step1ValidationSchema: ValidationRules
  setName: (text: string) => void
  setEmail: (text: string) => void
  setWhatsapp: (text: string) => void
  validateField: (name: string, value: string, schema: ValidationRules) => void
  handleStep1Continue: () => void
}

export default function StepOne({
  name,
  email,
  whatsapp,
  errors,
  step1ValidationSchema,
  setName,
  setEmail,
  setWhatsapp,
  validateField,
  handleStep1Continue,
}: StepOneProps) {
  return (
    <>
      {/* Name Field */}
      <View className="mb-6">
        <Text style={fonts.textSemiBold} className="text-lg text-black mb-4">
          Seu nome
        </Text>
        <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-4">
          <View className="w-6 h-6 mr-3 items-center justify-center">
            <Feather name="user" size={20} color="#9CA3AF" />
          </View>
          <TextInput
            style={fonts.text}
            className="flex-1 text-base text-gray-800"
            placeholder="ex: Luiz Andrade"
            placeholderTextColor="#9CA3AF"
            value={name}
            onChangeText={(text) => {
              setName(text)
              validateField("name", text, step1ValidationSchema)
            }}
          />
        </View>
        {errors.name ? (
          <Text style={fonts.text} className="text-red-500 text-sm mt-2">
            {errors.name}
          </Text>
        ) : null}
      </View>

      {/* Email Field */}
      <View className="mb-6">
        <Text style={fonts.textSemiBold} className="text-lg text-black mb-4">
          E-mail
        </Text>
        <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-4">
          <View className="w-6 h-6 mr-3 items-center justify-center">
            <Feather name="mail" size={20} color="#9CA3AF" />
          </View>
          <TextInput
            style={fonts.text}
            className="flex-1 text-base text-gray-800"
            placeholder="nome@dominio.com"
            placeholderTextColor="#9CA3AF"
            value={email}
            onChangeText={(text) => {
              setEmail(text)
              validateField("email", text, step1ValidationSchema)
            }}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        {errors.email ? (
          <Text style={fonts.text} className="text-red-500 text-sm mt-2">
            {errors.email}
          </Text>
        ) : null}
      </View>

      {/* WhatsApp Field */}
      <View className="mb-12">
        <Text style={fonts.textSemiBold} className="text-lg text-black mb-4">
          WhatsApp
        </Text>
        <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-4">
          <View className="w-6 h-6 mr-3 items-center justify-center">
            <Feather name="smartphone" size={20} color="#9CA3AF" />
          </View>
          <TextInput
            style={fonts.text}
            className="flex-1 text-base text-gray-800"
            placeholder="(00) 0 0000-0000"
            placeholderTextColor="#9CA3AF"
            value={whatsapp}
            onChangeText={(text) => {
              setWhatsapp(text)
              validateField("whatsapp", text, step1ValidationSchema)
            }}
            keyboardType="phone-pad"
          />
        </View>
        {errors.whatsapp ? (
          <Text style={fonts.text} className="text-red-500 text-sm mt-2">
            {errors.whatsapp}
          </Text>
        ) : null}
      </View>

      {/* Continue Button */}
      <TouchableOpacity className="bg-blue-500 rounded-xl py-4 items-center mb-8" onPress={handleStep1Continue}>
        <Text style={fonts.textSemiBold} className="text-white text-lg">
          Continuar
        </Text>
      </TouchableOpacity>
    </>
  )
}

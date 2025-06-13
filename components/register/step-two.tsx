import { View, Text, TextInput, TouchableOpacity } from "react-native"
import { fonts } from "~/styles"
import type { ValidationRules } from "~/hooks/useValidate"

interface StepTwoProps {
  clinicName: string
  cnpj: string
  address: string
  errors: {
    clinicName: string
    cnpj: string
    address: string
  }
  step2ValidationSchema: ValidationRules
  setClinicName: (text: string) => void
  setCnpj: (text: string) => void
  setAddress: (text: string) => void
  validateField: (name: string, value: string, schema: ValidationRules) => void
  handleStep2Continue: () => void
}

export default function StepTwo({
  clinicName,
  cnpj,
  address,
  errors,
  step2ValidationSchema,
  setClinicName,
  setCnpj,
  setAddress,
  validateField,
  handleStep2Continue,
}: StepTwoProps) {
  return (
    <>
      {/* Clinic Name Field */}
      <View className="mb-6">
        <Text style={fonts.textSemiBold} className="text-lg text-black mb-4">
          Nome da clínica
        </Text>
        <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-4">
          <View className="w-6 h-6 mr-3 items-center justify-center">
            <Text className="text-gray-400 text-base">🏥</Text>
          </View>
          <TextInput
            style={fonts.text}
            className="flex-1 text-base text-gray-800"
            placeholder="ex: Clínica Odontológica"
            placeholderTextColor="#9CA3AF"
            value={clinicName}
            onChangeText={(text) => {
              setClinicName(text)
              validateField("clinicName", text, step2ValidationSchema)
            }}
          />
        </View>
        {errors.clinicName ? (
          <Text style={fonts.text} className="text-red-500 text-sm mt-2">
            {errors.clinicName}
          </Text>
        ) : null}
      </View>

      {/* CNPJ Field */}
      <View className="mb-6">
        <Text style={fonts.textSemiBold} className="text-lg text-black mb-4">
          CNPJ
        </Text>
        <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-4">
          <View className="w-6 h-6 mr-3 items-center justify-center">
            <Text className="text-gray-400 text-base">📄</Text>
          </View>
          <TextInput
            style={fonts.text}
            className="flex-1 text-base text-gray-800"
            placeholder="00.000.000/0001-00"
            placeholderTextColor="#9CA3AF"
            value={cnpj}
            onChangeText={(text) => {
              setCnpj(text)
              validateField("cnpj", text, step2ValidationSchema)
            }}
            keyboardType="numeric"
          />
        </View>
        {errors.cnpj ? (
          <Text style={fonts.text} className="text-red-500 text-sm mt-2">
            {errors.cnpj}
          </Text>
        ) : null}
      </View>

      {/* Address Field */}
      <View className="mb-12">
        <Text style={fonts.textSemiBold} className="text-lg text-black mb-4">
          Endereço
        </Text>
        <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-4">
          <View className="w-6 h-6 mr-3 items-center justify-center">
            <Text className="text-gray-400 text-base">📍</Text>
          </View>
          <TextInput
            style={fonts.text}
            className="flex-1 text-base text-gray-800"
            placeholder="ex: Rua dos Dentes Felizes"
            placeholderTextColor="#9CA3AF"
            value={address}
            onChangeText={(text) => {
              setAddress(text)
              validateField("address", text, step2ValidationSchema)
            }}
          />
        </View>
        {errors.address ? (
          <Text style={fonts.text} className="text-red-500 text-sm mt-2">
            {errors.address}
          </Text>
        ) : null}
      </View>

      {/* Continue Button */}
      <TouchableOpacity className="bg-blue-500 rounded-xl py-4 items-center mb-8" onPress={handleStep2Continue}>
        <Text style={fonts.textSemiBold} className="text-white text-lg">
          Continuar
        </Text>
      </TouchableOpacity>
    </>
  )
}

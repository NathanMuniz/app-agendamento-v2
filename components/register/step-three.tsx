import { View, Text, TextInput, TouchableOpacity } from "react-native"
import { fonts } from "~/styles"
import type { ValidationRules } from "~/hooks/useValidate"

interface StepThreeProps {
  password: string
  confirmPassword: string
  errors: {
    password: string
    confirmPassword: string
  }
  showPassword: boolean
  showConfirmPassword: boolean
  step3ValidationSchema: ValidationRules
  setPassword: (text: string) => void
  setConfirmPassword: (text: string) => void
  setShowPassword: (show: boolean) => void
  setShowConfirmPassword: (show: boolean) => void
  validateField: (name: string, value: string, schema: ValidationRules) => void
  handleRegister: () => void
  isLoading: boolean
}

export default function StepThree({
  password,
  confirmPassword,
  errors,
  showPassword,
  showConfirmPassword,
  step3ValidationSchema,
  setPassword,
  setConfirmPassword,
  setShowPassword,
  setShowConfirmPassword,
  validateField,
  handleRegister,
  isLoading,
}: StepThreeProps) {
  return (
    <>
      {/* Password Field */}
      <View className="mb-6">
        <Text style={fonts.textSemiBold} className="text-lg text-black mb-4">
          Senha
        </Text>
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
              setPassword(text)
              validateField("password", text, step3ValidationSchema)
            }}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            className="w-6 h-6 items-center justify-center"
          >
            <Text className="text-gray-400 text-base">{showPassword ? "👁" : "👁"}</Text>
          </TouchableOpacity>
        </View>
        {errors.password ? (
          <Text style={fonts.text} className="text-red-500 text-sm mt-2">
            {errors.password}
          </Text>
        ) : null}
      </View>

      {/* Confirm Password Field */}
      <View className="mb-12">
        <Text style={fonts.textSemiBold} className="text-lg text-black mb-4">
          Confirmar senha
        </Text>
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
              setConfirmPassword(text)
              if (text !== password) {
                validateField("confirmPassword", text, step3ValidationSchema)
              }
            }}
            secureTextEntry={!showConfirmPassword}
          />
          <TouchableOpacity
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            className="w-6 h-6 items-center justify-center"
          >
            <Text className="text-gray-400 text-base">{showConfirmPassword ? "👁" : "👁"}</Text>
          </TouchableOpacity>
        </View>
        {errors.confirmPassword ? (
          <Text style={fonts.text} className="text-red-500 text-sm mt-2">
            {errors.confirmPassword}
          </Text>
        ) : null}
      </View>

      {/* Register Button */}
      <TouchableOpacity
        className="bg-blue-500 rounded-xl py-4 items-center mb-8"
        onPress={handleRegister}
        disabled={isLoading}
      >
        <Text style={fonts.textSemiBold} className="text-white text-lg">
          {isLoading ? "Criando conta..." : "Continuar"}
        </Text>
      </TouchableOpacity>
    </>
  )
}

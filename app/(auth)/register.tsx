"use client"

import { useState } from "react"
import { View, Text, TouchableOpacity } from "react-native"
import { router } from "expo-router"
import { authService } from "../../services/api"
import Toast from "react-native-toast-message"
import { fonts } from "~/styles"
import useValidate, { type ValidationRules } from "~/hooks/useValidate"
import StepOne from "~/components/register/step-one"
import StepTwo from "~/components/register/step-two"
import StepThree from "~/components/register/step-three"

// Componentes das etapas

export default function RegisterScreen() {
  // Dados pessoais (Step 1)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [whatsapp, setWhatsapp] = useState("")

  // Dados da clínica (Step 2)
  const [clinicName, setClinicName] = useState("")
  const [cnpj, setCnpj] = useState("")
  const [address, setAddress] = useState("")

  // Dados de senha (Step 3)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Controle de UI
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  // Erros de validação
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    whatsapp: "",
    clinicName: "",
    cnpj: "",
    address: "",
    password: "",
    confirmPassword: "",
  })

  const { validate } = useValidate()

  // Esquemas de validação para cada etapa
  const step1ValidationSchema: ValidationRules = {
    name: {
      type: "string",
      required: true,
      message: "Por favor, informe seu nome",
    },
    email: {
      type: "email",
      required: true,
      message: "Por favor, informe um e-mail válido",
    },
    whatsapp: {
      type: "string",
      required: true,
      message: "Por favor, informe seu número de WhatsApp",
    },
  }

  const step2ValidationSchema: ValidationRules = {
    clinicName: {
      type: "string",
      required: true,
      message: "Por favor, informe o nome da clínica",
    },
    cnpj: {
      type: "string",
      required: true,
      message: "Por favor, informe o CNPJ da clínica",
    },
    address: {
      type: "string",
      required: true,
      message: "Por favor, informe o endereço da clínica",
    },
  }

  const step3ValidationSchema: ValidationRules = {
    password: {
      type: "string",
      required: true,
      minLength: 6,
      message: "A senha deve ter pelo menos 6 caracteres",
    },
    confirmPassword: {
      type: "string",
      required: true,
      message: "Por favor, confirme sua senha",
    },
  }

  // Função para validar um campo específico
  const validateField = (name: string, value: string, schema: ValidationRules) => {
    const fieldSchema = { [name]: schema[name as keyof typeof schema] }
    const fieldData = { [name]: value }
    const { errors: validationErrors } = validate(fieldData, fieldSchema)
    setErrors((prev) => ({
      ...prev,
      [name]: validationErrors[name as keyof typeof validationErrors] || "",
    }))
  }

  // Funções para navegação entre etapas
  const handleStep1Continue = () => {
    const { isValid, errors: validationErrors } = validate({ name, email, whatsapp }, step1ValidationSchema)
    setErrors((prev) => ({
      ...prev,
      name: validationErrors.name || "",
      email: validationErrors.email || "",
      whatsapp: validationErrors.whatsapp || "",
    }))

    if (isValid) {
      setCurrentStep(2)
    }
  }

  const handleStep2Continue = () => {
    const { isValid, errors: validationErrors } = validate({ clinicName, cnpj, address }, step2ValidationSchema)
    setErrors((prev) => ({
      ...prev,
      clinicName: validationErrors.clinicName || "",
      cnpj: validationErrors.cnpj || "",
      address: validationErrors.address || "",
    }))

    if (isValid) {
      setCurrentStep(3)
    }
  }

  // Função para registrar o usuário
  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "As senhas não coincidem",
      }))
      return
    }

    const { isValid, errors: validationErrors } = validate({ password, confirmPassword }, step3ValidationSchema)
    setErrors((prev) => ({
      ...prev,
      password: validationErrors.password || "",
      confirmPassword: validationErrors.confirmPassword || "",
    }))

    if (!isValid) {
      return
    }

    setIsLoading(true)
    try {
      await authService.register({
        name,
        email,
        whatsapp,
        password,
        clinicName,
        cnpj,
        address,
      })

      Toast.show({
        type: "success",
        text1: "Sucesso",
        text2: "Registro realizado com sucesso! Por favor, faça login.",
      })
      router.replace("/(auth)/login")
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Falha no registro",
        text2: error instanceof Error ? error.message : "Falha no registro",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Renderização do conteúdo conforme a etapa atual
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <StepOne
            name={name}
            email={email}
            whatsapp={whatsapp}
            errors={{
              name: errors.name,
              email: errors.email,
              whatsapp: errors.whatsapp,
            }}
            step1ValidationSchema={step1ValidationSchema}
            setName={(text: string) => setName(text)}
            setEmail={(text: string) => setEmail(text)}
            setWhatsapp={(text: string) => setWhatsapp(text)}
            validateField={(name, value, schema) => validateField(name, value, schema)}
            handleStep1Continue={handleStep1Continue}
          />
        )
      case 2:
        return (
          <StepTwo
            clinicName={clinicName}
            cnpj={cnpj}
            address={address}
            errors={{
              clinicName: errors.clinicName,
              cnpj: errors.cnpj,
              address: errors.address,
            }}
            step2ValidationSchema={step2ValidationSchema}
            setClinicName={(text: string) => setClinicName(text)}
            setCnpj={(text: string) => setCnpj(text)}
            setAddress={(text: string) => setAddress(text)}
            validateField={(name, value, schema) => validateField(name, value, schema)}
            handleStep2Continue={handleStep2Continue}
          />
        )
      case 3:
        return (
          <StepThree
            password={password}
            confirmPassword={confirmPassword}
            errors={{
              password: errors.password,
              confirmPassword: errors.confirmPassword,
            }}
            showPassword={showPassword}
            showConfirmPassword={showConfirmPassword}
            step3ValidationSchema={step3ValidationSchema}
            setPassword={(text: string) => setPassword(text)}
            setConfirmPassword={(text: string) => setConfirmPassword(text)}
            setShowPassword={(show: boolean) => setShowPassword(show)}
            setShowConfirmPassword={(show: boolean) => setShowConfirmPassword(show)}
            validateField={(name, value, schema) => validateField(name, value, schema)}
            handleRegister={handleRegister}
            isLoading={isLoading}
          />
        )
      default:
        return null
    }
  }

  // Função para lidar com o botão de voltar
  const handleBackButton = () => {
    if (currentStep === 1) {
      router.back()
    } else {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <View className="flex-1 bg-white">
      <View className="flex-1 px-6 pt-16">
        {/* Header */}
        <View className="flex-row items-center mb-12">
          <TouchableOpacity onPress={handleBackButton} className="mr-4">
            <Text className="text-2xl">←</Text>
          </TouchableOpacity>
          <Text style={fonts.textSemiBold} className="text-xl text-black">
            Criando sua conta
          </Text>
        </View>

        {/* Form Content */}
        {renderStepContent()}
      </View>

      {/* Bottom Home Indicator */}
      <View className="items-center pb-2">
        <View className="w-32 h-1 bg-black rounded-full" />
      </View>
    </View>
  )
}

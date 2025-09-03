import * as yup from 'yup'

export const schema = yup.object().shape({
    email: yup.string().email("E-mail inválido.").required("O e-mail é obrigatório."),
    name: yup.string().required("O nome é obrigatório."),
    password: yup.string().min(6, "A senha deve ter no mínimo 6 caracteres.").required("A senha é obrigatória."),
    confirmPassword: yup.string().oneOf([yup.ref("password")], "As senhas devem ser iguais.").required("A confirmação da senha é obrigatória.")
})
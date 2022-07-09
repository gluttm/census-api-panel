import { Messages } from "src/types/SystemMessages";

export const messages: Messages = {
    validation: {
        required: 'Este campo é obrigatório.',
        email: 'Formato de email incorrecto.',
        mustMatch: 'As senhas devem ser iguais.',
        strongPassword: 'A senha deve conter no minimo 8 caracteres uma letra Maisc., uma Min., um numero e um caracter especial. Ex. T!tm9900.',
        selectOneRole: 'Selecione pelo menos 1 cargo.'
    },
    status: {
        created: 'Criado com sucesso.',
        updated: 'Actualizado com sucesso.',
        wrongLogin: 'Nome ou senha incorrectos.',
        signingIn: 'Iniciando sessão.'
    },
    prompt: {
        delete: 'Deseja realmente apagar este item?',
        yes: 'Sim',
        no: 'Não'
    },
    buttons: {
        save: 'Gravar',
        update: 'Actualizar',
        login: 'Entrar'
    }
}



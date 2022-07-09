export type Messages = {
    validation: {
        required: string,
        email: string,
        mustMatch: string,
        selectOneRole: string,
        strongPassword: string
    },
    status: {
        created: string,
        updated: string,
        wrongLogin: string,
        signingIn: string
    },
    prompt: {
        delete: string,
        yes: string,
        no: string
    },
    buttons: {
        save: string,
        update: string,
        login: string
    }
}
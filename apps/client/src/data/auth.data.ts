import type { RegistrationSteps } from "../types"

const registrationSteps: readonly RegistrationSteps[] = [
    { name: "username", label: "Choose a username", placeholder: "Username", type: "text" },
    { name: "email", label: "What's your email?", placeholder: "Email address", type: "email" },
    { name: "displayName", label: "What should we call you?", placeholder: "Display name", type: "text" },
    { name: "password", label: "Create a password", placeholder: "Password", type: "password", autoComplete: "new-password" }
]


export { registrationSteps }
type AuthMode = "login" | "register";
type InputType = "text" | "email" | "password"

interface RegistrationSteps {
    name: string;
    label: string;
    placeholder: string;
    type: InputType;
    autoComplete?: React.HTMLInputAutoCompleteAttribute;
}

export type { AuthMode, RegistrationSteps }
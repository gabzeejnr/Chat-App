import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registrationSteps } from "../data";
import ThemeButton from "../components/Buttons";
import { AUTH } from "../apis/axios";

export default function Register() {
    const navigate = useNavigate();
    const [step, setStep] = useState(0);
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        displayName: "",
        password: "",
    });

    type FormField = keyof typeof formData;

    async function handleNext() {
        if (step < registrationSteps.length - 1) {
            setStep((currentStep) => currentStep + 1);
        } else {
            try {
                await AUTH.post("/register", formData)
                navigate("/auth/login", { replace: true })
            } catch (err) {
                console.log(err)
            }
        }
    }

    return (
        <div className="w-full overflow-hidden">
            <div style={{ transform: `translateX(-${step * 100}%)` }}
                className="flex transition-transform duration-500 ease-in-out"
            >
                {registrationSteps.map((item, index) => {
                    const fieldName = item.name as FormField;

                    return (
                        <form key={item.name} className="w-full shrink-0 p-8 flex flex-col gap-6"
                            onSubmit={(e) => { e.preventDefault(); if (index === step) handleNext(); }}
                        >
                            <div>
                                <p className="text-sm text-muted">Create your account · {index + 1}/{registrationSteps.length}</p>
                                <h3 className="text-2xl font-semibold mt-2 text-foreground">{item.label}</h3>
                            </div>

                            <input autoComplete={item.autoComplete} autoFocus={index === step} type={item.type} placeholder={item.placeholder}
                                value={formData[fieldName]} onChange={e => setFormData(p => ({ ...p, [fieldName]: e.target.value, }))}
                                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground outline-none focus:border-accent"
                            />

                            <ThemeButton type="submit">
                                {index === registrationSteps.length - 1 ? "Create account" : "Continue"}
                            </ThemeButton>

                            {index === 0 && (
                                <p className="text-sm text-center text-muted">
                                    Already have an account?{" "}
                                    <Link to="/auth/login" className="font-semibold text-accent">
                                        Sign in
                                    </Link>
                                </p>
                            )}

                            {index > 0 && <button type="button" onClick={() => setStep(index - 1)} className="text-sm text-muted">Go back</button>}
                        </form>
                    )
                })}
            </div>
        </div>
    )
}

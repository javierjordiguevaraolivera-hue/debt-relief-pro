"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { forgetApplyStatus } from "@/lib/applyStatus";
import { usStateOptions } from "@/lib/usStates";

type EnglishApplication = {
  address1: string;
  city: string;
  dob: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  ssn: string;
  state: string;
  totalDebtAmount: string;
  zipcode: string;
};

type DebtOption = {
  label: string;
  value: string;
};

const debtOptions: DebtOption[] = [
  { label: "$0 - $14,999", value: "0" },
  { label: "$15,000 - $24,999", value: "15000" },
  { label: "$25,000 - $49,999", value: "25000" },
  { label: "$50,000+", value: "50000" },
];

const initialApplication: EnglishApplication = {
  address1: "",
  city: "",
  dob: "",
  email: "",
  firstName: "",
  lastName: "",
  phone: "",
  ssn: "",
  state: "",
  totalDebtAmount: "",
  zipcode: "",
};

const totalSteps = 5;

export function EnglishApplyFunnel({ initialState }: { initialState?: string }) {
  const [application, setApplication] = useState<EnglishApplication>(() => ({
    ...initialApplication,
    state: normalizeState(initialState),
  }));
  const [consent, setConsent] = useState(false);
  const [isPrequalifying, setIsPrequalifying] = useState(false);
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const prequalifyingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    forgetApplyStatus();

    return () => {
      if (prequalifyingTimeout.current) {
        clearTimeout(prequalifyingTimeout.current);
      }
    };
  }, []);

  function updateApplication(field: keyof EnglishApplication, value: string) {
    setApplication((current) => ({ ...current, [field]: value }));
  }

  function selectDebtAmount(value: string) {
    updateApplication("totalDebtAmount", value);
    setStep(2);
    window.scrollTo({ behavior: "smooth", top: 0 });
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (step < totalSteps) {
      if (step === 4) {
        setIsPrequalifying(true);
        prequalifyingTimeout.current = setTimeout(() => {
          setIsPrequalifying(false);
          setStep(5);
          window.scrollTo({ behavior: "smooth", top: 0 });
        }, 850);
        return;
      }

      setStep((current) => current + 1);
      window.scrollTo({ behavior: "smooth", top: 0 });
      return;
    }

    // API persistence will replace this temporary frontend-only completion.
    setApplication((current) => ({ ...current, ssn: "" }));
    setSubmitted(true);
    window.scrollTo({ behavior: "smooth", top: 0 });
  }

  if (submitted) {
    return <ThankYou firstName={application.firstName} />;
  }

  return (
    <section className="mx-auto w-full max-w-xl">
      <div className="mb-7">
        <div className="mb-3 flex items-center justify-between text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
          <span>Step {step} of {totalSteps}</span>
          <span>{Math.round((step / totalSteps) * 100)}% complete</span>
        </div>
        <div
          aria-label={`Step ${step} of ${totalSteps}`}
          aria-valuemax={totalSteps}
          aria-valuemin={1}
          aria-valuenow={step}
          className="h-2 overflow-hidden rounded-full bg-slate-200"
          role="progressbar"
        >
          <div
            className="h-full rounded-full bg-emerald-600 transition-[width] duration-300"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      <form className="grid gap-7 py-2 sm:py-4" onSubmit={handleSubmit}>
        {step === 1 ? (
          <DebtStep
            value={application.totalDebtAmount}
            onChange={selectDebtAmount}
          />
        ) : null}

        {step === 2 ? (
          <NameStep
            firstName={application.firstName}
            lastName={application.lastName}
            onChange={updateApplication}
          />
        ) : null}

        {step === 3 ? (
          <AddressStep application={application} onChange={updateApplication} />
        ) : null}

        {step === 4 ? (
          <ContactStep
            consent={consent}
            email={application.email}
            phone={application.phone}
            onConsentChange={setConsent}
            onChange={updateApplication}
          />
        ) : null}

        {step === 5 ? (
          <SsnStep
            value={application.ssn}
            onChange={(value) => updateApplication("ssn", value)}
          />
        ) : null}

        {step > 1 ? (
          <div className="flex items-stretch gap-3 pt-1">
            <button
              type="button"
              aria-label="Go back"
              onClick={() => setStep((current) => current - 1)}
              className="flex w-14 shrink-0 items-center justify-center rounded-md border border-slate-300 bg-white text-[#02163a] hover:border-slate-400 hover:bg-slate-50"
            >
              <BackIcon />
            </button>
            <button
              type="submit"
              className="flex-1 rounded-md bg-emerald-600 px-5 py-4 text-sm font-bold uppercase text-white shadow-sm hover:bg-emerald-700"
            >
              {step === totalSteps ? "Submit My Application" : "Continue"}
            </button>
          </div>
        ) : null}
      </form>

      <p className="mt-5 text-center text-xs leading-5 text-slate-500">
        Your information is used to review your debt relief options.
      </p>

      {isPrequalifying ? <PrequalifyingDialog /> : null}
    </section>
  );
}

function StepHeading({ description, title }: { description: string; title: string }) {
  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold leading-tight text-[#02163a]">{title}</h1>
      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-600">{description}</p>
    </div>
  );
}

function DebtStep({
  onChange,
  value,
}: {
  onChange: (value: string) => void;
  value: string;
}) {
  return (
    <fieldset className="grid gap-5">
      <StepHeading
        title="How much debt do you have?"
        description="Select the approximate total of your unsecured debt."
      />
      <div className="grid gap-3">
        {debtOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            aria-pressed={value === option.value}
            onClick={() => onChange(option.value)}
            className={`flex min-h-16 items-center justify-center gap-3 rounded-2xl border px-5 py-4 text-base font-bold text-[#02163a] transition ${
              value === option.value
                ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500"
                : "border-slate-300 bg-white hover:border-blue-300"
            }`}
          >
            <ChoiceIcon />
            <span>{option.label}</span>
          </button>
        ))}
      </div>
    </fieldset>
  );
}

function NameStep({
  firstName,
  lastName,
  onChange,
}: {
  firstName: string;
  lastName: string;
  onChange: (field: keyof EnglishApplication, value: string) => void;
}) {
  return (
    <div className="grid gap-5">
      <StepHeading
        title="Tell us about yourself"
        description="Enter your legal name as it appears on your identification."
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          autoComplete="given-name"
          label="First name"
          name="firstName"
          value={firstName}
          onChange={(value) => onChange("firstName", value)}
        />
        <TextField
          autoComplete="family-name"
          label="Last name"
          name="lastName"
          value={lastName}
          onChange={(value) => onChange("lastName", value)}
        />
      </div>
    </div>
  );
}

function AddressStep({
  application,
  onChange,
}: {
  application: EnglishApplication;
  onChange: (field: keyof EnglishApplication, value: string) => void;
}) {
  return (
    <div className="grid gap-5">
      <StepHeading
        title="Where do you live?"
        description="We use your address and date of birth to complete your application."
      />
      <div className="grid gap-4">
        <TextField
          autoComplete="street-address"
          label="Address"
          name="address1"
          placeholder="Start typing your address"
          value={application.address1}
          onChange={(value) => onChange("address1", value)}
        />
        <TextField
          autoComplete="bday"
          label="Date of birth"
          max={getMinimumAdultBirthDate()}
          name="dob"
          type="date"
          value={application.dob}
          onChange={(value) => onChange("dob", value)}
        />
      </div>
    </div>
  );
}

function ContactStep({
  consent,
  email,
  phone,
  onChange,
  onConsentChange,
}: {
  consent: boolean;
  email: string;
  phone: string;
  onChange: (field: keyof EnglishApplication, value: string) => void;
  onConsentChange: (value: boolean) => void;
}) {
  return (
    <div className="grid gap-5">
      <StepHeading
        title="How can we reach you?"
        description="Provide the best phone number and email for your application."
      />
      <div className="grid gap-4">
        <TextField
          autoComplete="tel"
          inputMode="tel"
          label="Phone number"
          maxLength={14}
          name="phone"
          pattern="\(\d{3}\) \d{3}-\d{4}"
          placeholder="(555) 555-1234"
          type="tel"
          value={phone}
          onChange={(value) => onChange("phone", formatPhone(value))}
        />
        <TextField
          autoComplete="email"
          inputMode="email"
          label="Email address"
          name="email"
          placeholder="you@example.com"
          type="email"
          value={email}
          onChange={(value) => onChange("email", value)}
        />
        <label className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <input
            required
            checked={consent}
            name="consent"
            type="checkbox"
            onChange={(event) => onConsentChange(event.target.checked)}
            className="mt-1 h-4 w-4 rounded border-slate-300 accent-emerald-600"
          />
          <span className="text-xs leading-5 text-slate-600">
            I agree to be contacted about debt relief options by phone, text message, and email.
            Consent is not a condition of purchase.
          </span>
        </label>
      </div>
    </div>
  );
}

function SsnStep({ onChange, value }: { onChange: (value: string) => void; value: string }) {
  return (
    <div className="grid gap-5">
      <StepHeading
        title="One last step"
        description="Enter your Social Security number to complete your application."
      />
      <div className="mx-auto grid w-full max-w-sm gap-3">
        <TextField
          autoComplete="off"
          inputMode="numeric"
          label="Social Security number"
          maxLength={11}
          name="ssn"
          pattern="\d{3}-\d{2}-\d{4}"
          placeholder="XXX-XX-XXXX"
          type="password"
          value={value}
          onChange={(nextValue) => onChange(formatSsn(nextValue))}
        />
        <p className="flex items-start gap-2 text-xs leading-5 text-slate-500">
          <LockIcon />
          This frontend preview does not store or transmit your information yet.
        </p>
      </div>
    </div>
  );
}

function TextField({
  label,
  onChange,
  ...inputProps
}: {
  label: string;
  onChange: (value: string) => void;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "className" | "onChange" | "required">) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-bold text-slate-900">{label}</span>
      <input
        {...inputProps}
        required
        onChange={(event) => onChange(event.target.value)}
        className={fieldClassName}
      />
    </label>
  );
}

function ThankYou({ firstName }: { firstName: string }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center shadow-sm sm:px-10">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
        <CheckIcon />
      </div>
      <p className="mt-6 text-sm font-bold uppercase tracking-[0.14em] text-emerald-700">
        Application complete
      </p>
      <h1 className="mt-3 text-3xl font-bold leading-tight text-[#02163a]">
        Thank you{firstName ? `, ${firstName}` : ""}
      </h1>
      <p className="mx-auto mt-4 max-w-md text-base leading-7 text-slate-600">
        Your application details are ready. Secure submission to our review team will be connected
        in the next implementation step.
      </p>
    </section>
  );
}

function PrequalifyingDialog() {
  return (
    <div
      aria-labelledby="prequalifying-title"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#02163a]/45 px-5 backdrop-blur-sm"
      role="dialog"
    >
      <div className="w-full max-w-sm rounded-2xl bg-white px-7 py-9 text-center shadow-2xl">
        <Image
          src="/media/debt%20relief%20pro%20logo%20-%20v2.png"
          alt="Debt Relief Pro"
          width={2400}
          height={600}
          className="mx-auto h-10 w-auto"
          priority
        />
        <div
          aria-hidden="true"
          className="mx-auto mt-7 h-10 w-10 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-600"
        />
        <h2 id="prequalifying-title" className="mt-5 text-xl font-bold text-[#02163a]">
          Pre-qualifying your application...
        </h2>
        <p className="mt-2 text-sm text-slate-600">This will only take a moment.</p>
      </div>
    </div>
  );
}

const fieldClassName =
  "h-12 w-full rounded-md border border-slate-300 bg-white px-3 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100";

function digitsOnly(value: string, maxLength: number): string {
  return value.replace(/\D/g, "").slice(0, maxLength);
}

function formatPhone(value: string): string {
  const digits = digitsOnly(value, 10);

  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;

  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

function formatSsn(value: string): string {
  const digits = digitsOnly(value, 9);

  if (digits.length <= 3) return digits;
  if (digits.length <= 5) return `${digits.slice(0, 3)}-${digits.slice(3)}`;

  return `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5)}`;
}

function normalizeState(state?: string): string {
  if (!state) return "";

  const normalized = state.trim().toUpperCase();
  const match = usStateOptions.find(
    (option) => option.abbreviation === normalized || option.name.toUpperCase() === normalized,
  );

  return match?.abbreviation || "";
}

function getMinimumAdultBirthDate(): string {
  const date = new Date();
  date.setFullYear(date.getFullYear() - 18);
  return date.toISOString().slice(0, 10);
}

function ChoiceIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-7 w-7 text-slate-500"
      fill="none"
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.5 9.5h19a2.5 2.5 0 0 1 2.5 2.5v11a2.5 2.5 0 0 1-2.5 2.5h-19A2.5 2.5 0 0 1 4 23V12a2.5 2.5 0 0 1 2.5-2.5Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path
        d="M4 15h24M8.5 21.5h5M17 21.5h2.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      aria-hidden="true"
      className="mt-0.5 h-4 w-4 shrink-0"
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7 10V7a5 5 0 0 1 10 0v3m-9 0h8a2 2 0 0 1 2 2v7H6v-7a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function BackIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="m15 6-6 6 6 6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.25"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-9 w-9"
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="m6 12.5 4 4L18.5 8"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.2"
      />
    </svg>
  );
}

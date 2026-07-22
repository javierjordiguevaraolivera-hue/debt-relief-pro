"use client";

import Image from "next/image";
import Link from "next/link";
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

export function Apply2Funnel({ initialState }: { initialState?: string }) {
  const [application, setApplication] = useState<EnglishApplication>(() => ({
    ...initialApplication,
    state: normalizeState(initialState),
  }));
  const [consent, setConsent] = useState(true);
  const [consentError, setConsentError] = useState("");
  const [dobError, setDobError] = useState("");
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
      if (step === 3 && !isValidDob(application.dob)) {
        setDobError("Enter a valid date of birth (MM/DD/YYYY). You must be 18 or older.");
        return;
      }

      if (step === 4) {
        if (!consent) {
          setConsentError("You must agree to the terms and conditions to continue.");
          return;
        }

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
      <style>{`
        @keyframes apply2-question-in {
          from {
            opacity: 0;
            transform: translateX(5px);
          }

          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>

      <div className="mb-7 flex w-full items-center justify-between gap-3 md:gap-4">
        <button
          type="button"
          aria-label="Go back"
          onClick={() => setStep((current) => current - 1)}
          className={`inline-flex h-9 w-9 shrink-0 items-center justify-center text-slate-500 transition hover:text-[#02163a] ${
            step > 1 ? "" : "invisible"
          }`}
        >
          <BackArrowIcon />
        </button>
        <div
          aria-label={`Step ${step} of ${totalSteps}`}
          aria-valuemax={totalSteps}
          aria-valuemin={1}
          aria-valuenow={step}
          className="relative w-full max-w-[300px] overflow-hidden rounded-full bg-[#d9d9d9]"
          role="progressbar"
        >
          <div
            className="h-[8px] rounded-full bg-emerald-600 transition-[width] duration-300"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
          {Array.from({ length: totalSteps - 1 }).map((_, index) => (
            <span
              key={index}
              aria-hidden="true"
              className="absolute top-0 h-full w-px bg-white/55"
              style={{ left: `${((index + 1) / totalSteps) * 100}%` }}
            />
          ))}
        </div>
        <div className="flex w-[58px] shrink-0 justify-end md:w-[70px]">
          <span className="whitespace-nowrap text-[12px] font-black tracking-[-0.02em] text-[#02163a] md:text-[13px]">
            {step} of {totalSteps}
          </span>
        </div>
      </div>

      <form
        key={`step-${step}`}
        className="grid animate-[apply2-question-in_0.42s_cubic-bezier(0.22,0.61,0.36,1)] gap-7 py-2 sm:py-4"
        onSubmit={handleSubmit}
      >
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
          <AddressStep
            application={application}
            dobError={dobError}
            onChange={(field, value) => {
              updateApplication(field, value);
              if (field === "dob") {
                setDobError("");
              }
            }}
          />
        ) : null}

        {step === 4 ? (
          <ContactStep
            consent={consent}
            consentError={consentError}
            email={application.email}
            phone={application.phone}
            onConsentChange={(value) => {
              setConsent(value);
              if (value) {
                setConsentError("");
              }
            }}
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
          <button
            type="submit"
            className="inline-flex h-[54px] items-center justify-center gap-2 rounded-full bg-emerald-600 px-6 text-[18px] font-semibold text-white shadow-sm transition hover:bg-emerald-700"
          >
            <span>{step === totalSteps ? "Submit My Application" : "Continue"}</span>
            <NextArrowIcon />
          </button>
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
      <h1 className="mx-auto max-w-[720px] text-[30px] font-bold leading-[1.16] tracking-[-0.04em] text-[#02163a] md:text-[40px]">
        {title}
      </h1>
      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-600">{description}</p>
    </div>
  );
}

function optionButtonClass(isSelected: boolean) {
  return [
    "flex min-h-[62px] w-full items-center justify-center gap-3 rounded-[16px] border bg-white px-5 py-3 text-[17px] font-bold tracking-[-0.02em] text-[#02163a] shadow-[0_4px_10px_rgba(16,24,32,0.08)] transition",
    isSelected
      ? "border-blue-500 bg-blue-50 shadow-[0_0_0_1px_#3b82f6,0_8px_18px_rgba(59,130,246,0.12)]"
      : "border-[#9c9c9c] hover:border-[#6f6f6f]",
  ].join(" ");
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
      <div className="mx-auto grid w-full max-w-[460px] gap-4">
        {debtOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            aria-pressed={value === option.value}
            onClick={() => onChange(option.value)}
            className={optionButtonClass(value === option.value)}
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
      <div className="mx-auto grid w-full max-w-[460px] gap-4 sm:grid-cols-2">
        <TextField
          autoComplete="given-name"
          label="First name"
          name="firstName"
          placeholder="First name"
          value={firstName}
          onChange={(value) => onChange("firstName", value)}
        />
        <TextField
          autoComplete="family-name"
          label="Last name"
          name="lastName"
          placeholder="Last name"
          value={lastName}
          onChange={(value) => onChange("lastName", value)}
        />
      </div>
    </div>
  );
}

function AddressStep({
  application,
  dobError,
  onChange,
}: {
  application: EnglishApplication;
  dobError: string;
  onChange: (field: keyof EnglishApplication, value: string) => void;
}) {
  return (
    <div className="grid gap-5">
      <StepHeading
        title="Where do you live?"
        description="We use your address and date of birth to complete your application."
      />
      <div className="mx-auto grid w-full max-w-[460px] gap-4">
        <TextField
          autoComplete="street-address"
          label="Address"
          name="address1"
          placeholder="Start typing your address"
          value={application.address1}
          onChange={(value) => onChange("address1", value)}
        />
        <div className="grid gap-2">
          <TextField
            autoComplete="bday"
            inputMode="numeric"
            label="Date of birth"
            maxLength={10}
            name="dob"
            pattern="(0[1-9]|1[0-2])/(0[1-9]|[12][0-9]|3[01])/[0-9]{4}"
            placeholder="MM/DD/YYYY"
            value={application.dob}
            onChange={(value) => onChange("dob", formatDob(value))}
          />
          {dobError ? (
            <p className="text-xs font-bold text-red-600" role="alert">
              {dobError}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function ContactStep({
  consent,
  consentError,
  email,
  phone,
  onChange,
  onConsentChange,
}: {
  consent: boolean;
  consentError: string;
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
      <div className="mx-auto grid w-full max-w-[460px] gap-4">
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
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <label className="flex items-start gap-2">
            <input
              checked={consent}
              name="consent"
              type="checkbox"
              onChange={(event) => onConsentChange(event.target.checked)}
              className="mt-1 h-3 w-3 shrink-0 rounded border-slate-300 accent-emerald-600"
            />
            <span className="text-xs leading-5 text-slate-600">
              By clicking &ldquo;Submit&rdquo; or providing my information above, I give my prior
              express written consent for Ecomfy Lead LLC. and its{" "}
              <Link
                href="/en/partners"
                target="_blank"
                className="font-bold text-emerald-700 underline underline-offset-2"
              >
                partners
              </Link>
              , including National
              Debt Relief, LLC, to contact me at the phone number I provided regarding debt relief
              programs and related services. This includes calls and text messages using an
              automatic telephone dialing system, artificial or prerecorded voice, or AI-generated
              voice technology. Message and data rates may apply. My consent is not required to
              receive a consultation or enroll in any services. I can revoke consent at any time by
              replying &ldquo;STOP&rdquo; to any text or by any other reasonable method.
            </span>
          </label>
          {consentError ? (
            <p className="mt-2 text-xs font-bold text-red-600" role="alert">
              {consentError}
            </p>
          ) : null}
        </div>
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
  "h-[58px] w-full rounded-[16px] border border-[#9c9c9c] bg-white px-5 text-[17px] text-[#101820] outline-none transition placeholder:text-slate-400 focus:border-emerald-600";

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

function formatDob(value: string): string {
  const digits = digitsOnly(value, 8);

  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;

  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

function isValidDob(value: string): boolean {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);
  if (!match) return false;

  const month = Number(match[1]);
  const day = Number(match[2]);
  const year = Number(match[3]);
  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return false;
  }

  const minimumAdultBirthDate = new Date();
  minimumAdultBirthDate.setFullYear(minimumAdultBirthDate.getFullYear() - 18);

  return date <= minimumAdultBirthDate;
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

function BackArrowIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-[18px] w-[18px]"
    >
      <path
        d="M15.632 22.577l-9.225-9.562a1.439 1.439 0 01-.301-.466 1.48 1.48 0 01.301-1.566l9.225-9.562c.26-.27.613-.421.98-.421.368 0 .72.151.98.42.26.27.407.636.407 1.017 0 .38-.146.746-.406 1.016L9.346 12l8.248 8.547c.26.27.406.635.406 1.016s-.146.747-.406 1.016c-.26.27-.613.421-.98.421-.368 0-.72-.151-.98-.42l-.002-.003z"
        fill="currentColor"
      />
    </svg>
  );
}

function NextArrowIcon() {
  return (
    <svg
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      fill="none"
      className="h-[18px] w-[18px]"
    >
      <line
        x1="40"
        y1="128"
        x2="216"
        y2="128"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="24"
      />
      <polyline
        points="144 56 216 128 144 200"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="24"
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

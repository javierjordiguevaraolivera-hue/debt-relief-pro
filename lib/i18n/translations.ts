import type { Locale } from "./locales";

export const translations = {
  en: {
    nav: {
      benefits: "Benefits",
      process: "How it works",
      testimonials: "Testimonials",
      blog: "Blog",
      apply: "Apply for Relief",
    },
    home: {
      eyebrow: "Debt relief guidance for U.S. consumers",
      heroTitle: "Find a clearer path out of unsecured debt.",
      heroText:
        "Compare your options, understand what may fit your situation, and start a short pre-qualification flow with a trusted affiliate partner.",
      primaryCta: "Start pre-qualification",
      secondaryCta: "Read debt guides",
      trustNote: "No obligation. No impact to your credit score to check.",
      benefitsTitle: "Built for decisions that feel less rushed",
      benefits: [
        {
          title: "Simple eligibility check",
          text: "Answer a few questions about your debt amount, hardship, and goals.",
        },
        {
          title: "Bilingual support",
          text: "Browse the site in English or Spanish with localized education and CTAs.",
        },
        {
          title: "Affiliate-ready handoff",
          text: "Qualified visitors are sent to the correct partner destination by language.",
        },
      ],
      processTitle: "How the pre-qualification works",
      steps: [
        "Review debt relief basics and common program considerations.",
        "Complete the short eligibility form on the apply page.",
        "Continue to the affiliate partner if your answers match the next step.",
      ],
      testimonialsTitle: "What people value",
      testimonials: [
        {
          quote:
            "The process made the choices easier to understand before I spoke with anyone.",
          name: "Verified visitor",
        },
        {
          quote:
            "I liked seeing the basics in plain language and knowing what would happen next.",
          name: "Pre-qualified consumer",
        },
      ],
      ctaTitle: "Ready to see what may be available?",
      ctaText:
        "Start with a few questions, then continue to the affiliate partner when you are ready.",
      blogTitle: "Debt relief articles",
      blogEmpty: "Blog posts will appear here after they are published in Sanity.",
    },
    apply: {
      title: "Check your debt relief eligibility",
      description:
        "This short pre-qualification is informational and routes eligible visitors to an affiliate partner.",
      amountLabel: "Estimated unsecured debt",
      stateLabel: "State",
      hardshipLabel: "Current hardship",
      hardshipPlaceholder: "Job loss, reduced income, medical bills, or another reason",
      button: "Continue to partner",
      disclosure:
        "By continuing, you understand you may be redirected to an external affiliate partner. This site does not provide legal, tax, or credit advice.",
    },
    blog: {
      title: "Debt relief blog",
      description:
        "Educational guides about debt relief options, qualification, and next steps.",
      readMore: "Read article",
      back: "Back to blog",
      empty: "No posts are published yet.",
    },
    footer: {
      disclosure:
        "This website is an affiliate publisher. Information is educational and does not guarantee approval, savings, or program availability.",
      privacy: "Privacy",
      terms: "Terms",
    },
  },
  es: {
    nav: {
      benefits: "Beneficios",
      process: "Cómo funciona",
      testimonials: "Historias de clientes",
      blog: "Blog",
      apply: "Reducir mi Deuda",
    },
    home: {
      eyebrow: "Orientación de alivio de deuda para consumidores en EE. UU.",
      heroTitle: "Encuentra un camino más claro para salir de deudas sin garantía.",
      heroText:
        "Compara tus opciones, entiende qué puede encajar con tu situación y empieza una pre-calificación breve con un socio afiliado confiable.",
      primaryCta: "Iniciar pre-calificación",
      secondaryCta: "Leer guías de deuda",
      trustNote: "Sin obligación. Revisar no afecta tu puntaje de crédito.",
      benefitsTitle: "Pensado para decidir con menos presión",
      benefits: [
        {
          title: "Revisión simple de elegibilidad",
          text: "Responde algunas preguntas sobre tu deuda, dificultad económica y objetivos.",
        },
        {
          title: "Soporte bilingüe",
          text: "Navega el sitio en español o inglés con educación y llamadas a la acción localizadas.",
        },
        {
          title: "Redirección afiliada lista",
          text: "Los visitantes calificados pasan al destino correcto del socio según el idioma.",
        },
      ],
      processTitle: "Cómo funciona la pre-calificación",
      steps: [
        "Revisa conceptos básicos y consideraciones comunes sobre alivio de deuda.",
        "Completa el formulario corto de elegibilidad en la página de aplicación.",
        "Continúa con el socio afiliado si tus respuestas coinciden con el siguiente paso.",
      ],
      testimonialsTitle: "Lo que valoran las personas",
      testimonials: [
        {
          quote:
            "El proceso hizo que las opciones fueran más fáciles de entender antes de hablar con alguien.",
          name: "Visitante verificado",
        },
        {
          quote:
            "Me gustó ver lo básico en lenguaje claro y saber qué pasaría después.",
          name: "Consumidor pre-calificado",
        },
      ],
      ctaTitle: "¿Listo para ver qué puede estar disponible?",
      ctaText:
        "Empieza con unas pocas preguntas y continúa con el socio afiliado cuando estés listo.",
      blogTitle: "Artículos sobre alivio de deuda",
      blogEmpty: "Los posts aparecerán aquí cuando se publiquen en Sanity.",
    },
    apply: {
      title: "Revisa tu elegibilidad para alivio de deuda",
      description:
        "Esta pre-calificación breve es informativa y dirige a visitantes elegibles a un socio afiliado.",
      amountLabel: "Deuda no garantizada estimada",
      stateLabel: "Estado",
      hardshipLabel: "Dificultad actual",
      hardshipPlaceholder: "Pérdida de empleo, ingresos reducidos, gastos médicos u otra razón",
      button: "Continuar con el socio",
      disclosure:
        "Al continuar, entiendes que puedes ser redirigido a un socio afiliado externo. Este sitio no ofrece asesoría legal, fiscal ni crediticia.",
    },
    blog: {
      title: "Blog de alivio de deuda",
      description:
        "Guías educativas sobre opciones de alivio de deuda, requisitos y próximos pasos.",
      readMore: "Leer artículo",
      back: "Volver al blog",
      empty: "Aún no hay posts publicados.",
    },
    footer: {
      disclosure:
        "Este sitio web es un publicador afiliado. La información es educativa y no garantiza aprobación, ahorros ni disponibilidad de programas.",
      privacy: "Privacidad",
      terms: "Términos",
    },
  },
} as const;

export function getTranslations(locale: Locale) {
  return translations[locale];
}

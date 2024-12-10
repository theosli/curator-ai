import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';  // English translations
import fr from './locales/fr.json';  // French translations
import enTestimonials from './locales/testimonials/en.json';  // English testimonials
import frTestimonials from './locales/testimonials/fr.json';  // French testimonials

i18n
    .use(initReactI18next) // Integrate with React
    .init({
        resources: {
            en: { translation: {
                ...en,
                ...enTestimonials} },
            fr: { translation: {
                ...fr,
                ...frTestimonials} }
        
        },
        lng: 'en',  // Default language
        fallbackLng: 'en',  // Language fallback
        interpolation: {
            escapeValue: false,  // React already does escaping
        },
    });

export default i18n;

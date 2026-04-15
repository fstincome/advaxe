import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Lang = 'fr' | 'rn' | 'en' | 'es' | 'de' | 'sw';

export const LANGUAGES: { code: Lang; label: string; flag: string }[] = [
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'rn', label: 'Kirundi', flag: '🇧🇮' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'sw', label: 'Kiswahili', flag: '🇹🇿' },
];

type Translations = Record<string, Record<Lang, string>>;

export const UI_TRANSLATIONS: Translations = {
  about_me: { fr: 'À propos', rn: 'Inyigisho', en: 'About Me', es: 'Sobre mí', de: 'Über mich', sw: 'Kuhusu Mimi' },
  skills: { fr: 'Compétences', rn: 'Ubushobozi', en: 'Skills', es: 'Habilidades', de: 'Fähigkeiten', sw: 'Ujuzi' },
  experience: { fr: 'Expérience', rn: 'Uburambe', en: 'Experience', es: 'Experiencia', de: 'Erfahrung', sw: 'Uzoefu' },
  services: { fr: 'Services', rn: 'Serivisi', en: 'Services', es: 'Servicios', de: 'Dienstleistungen', sw: 'Huduma' },
  projects: { fr: 'Projets', rn: 'Imigambi', en: 'Projects', es: 'Proyectos', de: 'Projekte', sw: 'Miradi' },
  contact: { fr: 'Contact', rn: 'Tuvugishe', en: 'Contact', es: 'Contacto', de: 'Kontakt', sw: 'Wasiliana' },
  send_message: { fr: 'Envoyer', rn: 'Rungika', en: 'Send Message', es: 'Enviar', de: 'Nachricht senden', sw: 'Tuma Ujumbe' },
  name_label: { fr: 'Nom', rn: 'Izina', en: 'Name', es: 'Nombre', de: 'Name', sw: 'Jina' },
  birthday: { fr: 'Naissance', rn: 'Itariki y\'amavuko', en: 'Birthday', es: 'Cumpleaños', de: 'Geburtstag', sw: 'Siku ya kuzaliwa' },
  degree: { fr: 'Diplôme', rn: 'Dipulome', en: 'Degree', es: 'Título', de: 'Abschluss', sw: 'Shahada' },
  experience_label: { fr: 'Expérience', rn: 'Uburambe', en: 'Experience', es: 'Experiencia', de: 'Erfahrung', sw: 'Uzoefu' },
  phone: { fr: 'Téléphone', rn: 'Telefoni', en: 'Phone', es: 'Teléfono', de: 'Telefon', sw: 'Simu' },
  email: { fr: 'Email', rn: 'Imeyili', en: 'Email', es: 'Correo', de: 'E-Mail', sw: 'Barua pepe' },
  address: { fr: 'Adresse', rn: 'Aderesi', en: 'Address', es: 'Dirección', de: 'Adresse', sw: 'Anwani' },
  freelance: { fr: 'Freelance', rn: 'Akazi k\'umwidegemvya', en: 'Freelance', es: 'Freelance', de: 'Freiberuflich', sw: 'Kazi huru' },
  whatsapp: { fr: 'WhatsApp', rn: 'WhatsApp', en: 'WhatsApp', es: 'WhatsApp', de: 'WhatsApp', sw: 'WhatsApp' },
  contact_me: { fr: 'Me contacter', rn: 'Mfasha', en: 'Contact Me', es: 'Contáctame', de: 'Kontaktiere mich', sw: 'Wasiliana nami' },
  available: { fr: 'Disponible', rn: 'Arahari', en: 'Available', es: 'Disponible', de: 'Verfügbar', sw: 'Inapatikana' },
  dashboard: { fr: 'Tableau de bord', rn: 'Ikibaho', en: 'Dashboard', es: 'Panel', de: 'Dashboard', sw: 'Dashibodi' },
  visitors: { fr: 'Visiteurs', rn: 'Abashyitsi', en: 'Visitors', es: 'Visitantes', de: 'Besucher', sw: 'Wageni' },
  activity: { fr: 'Activité', rn: 'Ibikorwa', en: 'Activity', es: 'Actividad', de: 'Aktivität', sw: 'Shughuli' },
  clicks: { fr: 'Clics', rn: 'Gukanda', en: 'Clicks', es: 'Clics', de: 'Klicks', sw: 'Mibofyo' },
  all: { fr: 'Tous', rn: 'Vyose', en: 'All', es: 'Todos', de: 'Alle', sw: 'Zote' },
  recent_projects: { fr: 'Projets récents', rn: 'Imigambi mishasha', en: 'Recent Projects', es: 'Proyectos recientes', de: 'Neueste Projekte', sw: 'Miradi ya hivi karibuni' },
  login: { fr: 'Connexion', rn: 'Kwinjira', en: 'Login', es: 'Iniciar sesión', de: 'Anmelden', sw: 'Ingia' },
  logout: { fr: 'Déconnexion', rn: 'Gusohoka', en: 'Logout', es: 'Cerrar sesión', de: 'Abmelden', sw: 'Toka' },
  password: { fr: 'Mot de passe', rn: 'Ijambo ry\'ibanga', en: 'Password', es: 'Contraseña', de: 'Passwort', sw: 'Nenosiri' },
  content_mgmt: { fr: 'Gestion du contenu', rn: 'Gucunga ibikubiyemwo', en: 'Content Management', es: 'Gestión de contenido', de: 'Inhaltsverwaltung', sw: 'Usimamizi wa maudhui' },
  save: { fr: 'Enregistrer', rn: 'Kubika', en: 'Save', es: 'Guardar', de: 'Speichern', sw: 'Hifadhi' },
  add: { fr: 'Ajouter', rn: 'Ongeranya', en: 'Add', es: 'Añadir', de: 'Hinzufügen', sw: 'Ongeza' },
  delete: { fr: 'Supprimer', rn: 'Gukuraho', en: 'Delete', es: 'Eliminar', de: 'Löschen', sw: 'Futa' },
  edit: { fr: 'Modifier', rn: 'Guhindura', en: 'Edit', es: 'Editar', de: 'Bearbeiten', sw: 'Hariri' },
  newsletter: { fr: 'Abonnez-vous à ma newsletter', rn: 'Iyandikishe ku makuru yanje', en: 'Subscribe to my newsletter', es: 'Suscríbete a mi boletín', de: 'Newsletter abonnieren', sw: 'Jiandikishe kwa jarida langu' },
  subscribe: { fr: 'S\'abonner', rn: 'Kwiyandikisha', en: 'Subscribe', es: 'Suscribirse', de: 'Abonnieren', sw: 'Jiandikishe' },
};

const LanguageContext = createContext<{
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
}>({ lang: 'fr', setLang: () => {}, t: (k) => k });

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Lang>('fr');

  const t = (key: string): string => {
    return UI_TRANSLATIONS[key]?.[lang] || UI_TRANSLATIONS[key]?.['en'] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

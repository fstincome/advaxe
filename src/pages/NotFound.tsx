import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

const COPY: Record<string, { title: string; text: string; cta: string; explore: string }> = {
  en: {
    title: "Page not found",
    text: "The page you are looking for does not exist or has been moved.",
    cta: "Back to home",
    explore: "Explore my work",
  },
  fr: {
    title: "Page introuvable",
    text: "La page que vous cherchez n'existe pas ou a été déplacée.",
    cta: "Retour à l'accueil",
    explore: "Découvrir mes travaux",
  },
  sw: {
    title: "Ukurasa haupatikani",
    text: "Ukurasa unaoutafuta haupo au umehamishwa.",
    cta: "Rudi mwanzoni",
    explore: "Gundua kazi zangu",
  },
  rn: {
    title: "Urupapuro ntiruhari",
    text: "Urupapuro murondera ntiruhari canke rwimuriwe ahandi.",
    cta: "Subira ahabanza",
    explore: "Reba ibikorwa vyanje",
  },
};

const NotFound = () => {
  const location = useLocation();
  const lang = location.pathname.match(/^\/(en|fr|sw|rn)\b/)?.[1] ?? "en";
  const copy = COPY[lang] ?? COPY.en;

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">404</p>
      <h1 className="mt-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">{copy.title}</h1>
      <p className="mt-4 max-w-md text-lg text-muted-foreground">{copy.text}</p>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <Button asChild size="lg">
          <Link to={`/${lang}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {copy.cta}
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link to={`/${lang}/work`}>
            <Compass className="mr-2 h-4 w-4" />
            {copy.explore}
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;

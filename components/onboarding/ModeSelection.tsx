import ModeCard from "./ModeCard";

export default function ModeSelection({ onSelect }: { onSelect: (mode: "solo" | "company") => void }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
      <ModeCard
        title="Nur für mich"
        description="Ich möchte meine eigenen Arbeitszeiten und Lohnabrechnungen verwalten."
        color="blue"
        onClick={() => onSelect("solo")}
      />
      <ModeCard
        title="Firma erstellen oder beitreten"
        description="Ich möchte ein Team verwalten, Kollegen einladen und zentrale Regeln festlegen."
        color="green"
        onClick={() => onSelect("company")}
      />
    </div>
  );
}

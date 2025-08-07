import Card from "./components/ui/card";
import Button from "./components/ui/button";
import Select from "./components/ui/select";
import Slider from "./components/ui/slider";
import React, { useState } from "react";
import breathingGif from "./assets/breathing.gif";
import drawingGif from "./assets/drawing.gif";
import stretchingGif from "./assets/stretching.gif";
import visualisationGif from "./assets/visualisation.gif";

const activities = {
  stress: {
    low: ["Respiration en carré", "Mini-étirement du cou"],
    medium: ["Visualisation calme", "Écriture d'un mot-clé"],
    high: ["Respiration guidée intense", "Secouage de bras"]
  },
  fatigue: {
    low: ["Cligner des yeux volontairement", "Auto-massage des mains"],
    medium: ["Étirer les bras vers le haut", "Mobilisation des épaules"],
    high: ["Respiration profonde + étirement", "Bain sonore (mental)"]
  },
};

export default function App() {
  const [need, setNeed] = useState("");
  const [intensity, setIntensity] = useState(5);
  const [suggestion, setSuggestion] = useState("");
  const [suggestionUsed, setSuggestionUsed] = useState(false);

  const handleGenerate = () => {
    if (!need || !activities[need]) return;

    const level = intensity <= 3 ? "low" : intensity <= 7 ? "medium" : "high";
    const options = activities[need][level];

    if (!options || options.length === 0) return;

    const random = Math.floor(Math.random() * options.length);
    setSuggestion(options[random]);
    setSuggestionUsed(false);
  };

  const handleReshuffle = () => {
    if (suggestionUsed) return;
    handleGenerate();
    setSuggestionUsed(true);
  };

  return (
    <div className="max-w-md mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold text-center mb-4">Pause Cerveau</h1>

      <Card className="mb-4">
        <Select
          label="Quel est votre besoin aujourd'hui ?"
          options={Object.keys(activities)}
          value={need}
          onChange={(e) => setNeed(e.target.value)}
        />

        <Slider
          label="À combien estimez-vous ce besoin ? (0-10)"
          min={0}
          max={10}
          value={intensity}
          onChange={(e) => setIntensity(Number(e.target.value))}
        />

        <Button onClick={handleGenerate} className="mt-4">
          Me proposer une pause
        </Button>
      </Card>

      {suggestion && (
        <Card className="mt-4">
          <p className="text-lg text-center font-semibold mb-2">Suggestion :</p>
          <p className="text-center">{suggestion}</p>

          {!suggestionUsed && (
            <Button onClick={handleReshuffle} className="mt-4">
              Proposer une autre suggestion
            </Button>
          )}
          {suggestionUsed && (
            <p className="text-sm text-center text-gray-500 mt-2">
              Une seule alternative possible par jour
            </p>
          )}
        </Card>
      )}
    </div>
  );
}

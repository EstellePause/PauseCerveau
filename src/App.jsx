import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Select, SelectItem } from "@/components/ui/select";
import { CheckCircle, Send, Flame, Sparkles, Bell } from "lucide-react";

const EXERCISES = JSON.parse(localStorage.getItem("exercisesData")) || {};

const ALL_BADGES = [
  "Assidu(e)",
  "Régulier(ère)",
  "Fidèle au rendez-vous",
  "Maîtrise du souffle",
  "Focus retrouvé",
  "Héros du calme",
  "Esprit clair",
  "Endurant(e)"
];

export default function App() {
  const [userId, setUserId] = useState(() => localStorage.getItem("pauseUserId") || "");
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [visitedBefore, setVisitedBefore] = useState(true);
  const [besoin, setBesoin] = useState("stress");
  const [intensite, setIntensite] = useState(5);
  const [showExercice, setShowExercice] = useState(false);
  const [suggestionDuJour, setSuggestionDuJour] = useState(null);
  const [autreSuggestionAutorisee, setAutreSuggestionAutorisee] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [streak, setStreak] = useState(0);
  const [badges, setBadges] = useState([]);

  useEffect(() => {
    if (!userId) {
      const generatedId = "user-" + Math.random().toString(36).substring(2, 10);
      setUserId(generatedId);
      localStorage.setItem("pauseUserId", generatedId);
    }
    const hasVisited = localStorage.getItem("hasVisitedPauseCerveau");
    if (!hasVisited) {
      setShowOnboarding(true);
      setVisitedBefore(false);
      localStorage.setItem("hasVisitedPauseCerveau", "true");
    }
    const savedStreak = localStorage.getItem("pauseStreak");
    const savedBadges = JSON.parse(localStorage.getItem("pauseBadges") || "[]");
    if (savedStreak) setStreak(parseInt(savedStreak));
    setBadges(savedBadges);

    const now = new Date();
    const reminderTime = new Date();
    reminderTime.setHours(10, 0, 0, 0);
    if (now.getHours() === 10 && now.getMinutes() < 3) {
      alert("\u2600\ufe0f Il est temps de prendre votre Pause Cerveau du jour \u2728");
    }
  }, []);

  const handleValidation = async () => {
    setShowExercice(true);
    setSuggestionDuJour(exerciceList[Math.floor(Math.random() * exerciceList.length)]);
    setAutreSuggestionAutorisee(true);
    const newStreak = streak + 1;
    setStreak(newStreak);
    localStorage.setItem("pauseStreak", newStreak.toString());

    const newBadges = [...badges];
    if (newStreak === 5 && !newBadges.includes("Assidu(e)")) newBadges.push("Assidu(e)");
    if (newStreak === 10 && !newBadges.includes("Régulier(ère)")) newBadges.push("Régulier(ère)");
    if (newStreak === 15 && !newBadges.includes("Fidèle au rendez-vous")) newBadges.push("Fidèle au rendez-vous");
    if (newStreak === 20 && !newBadges.includes("Maîtrise du souffle")) newBadges.push("Maîtrise du souffle");
    if (newStreak === 30 && !newBadges.includes("Focus retrouvé")) newBadges.push("Focus retrouvé");
    if (newStreak === 45 && !newBadges.includes("Héros du calme")) newBadges.push("Héros du calme");
    if (newStreak === 60 && !newBadges.includes("Esprit clair")) newBadges.push("Esprit clair");
    if (newStreak === 90 && !newBadges.includes("Endurant(e)")) newBadges.push("Endurant(e)");

    setBadges(newBadges);
    if (newBadges.length > badges.length) {
      alert("\ud83c\udf89 Nouveau badge débloqué : " + newBadges[newBadges.length - 1]);
    }
    localStorage.setItem("pauseBadges", JSON.stringify(newBadges));

    try {
      await fetch("https://hook.eu2.make.com/esexbman8wes4zkbr8egr5o2d67gb9na", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          besoin,
          intensite,
          date: new Date().toISOString().split("T")[0],
          badge: newBadges[newBadges.length - 1] || ""
        })
      });
    } catch (error) {
      console.error("Erreur d'envoi des données RH :", error);
    }
  };

  const getIntensityLevel = (value) => {
    if (value <= 3) return "low";
    if (value <= 7) return "medium";
    return "high";
  };

  const exerciceList = (EXERCISES[besoin] && EXERCISES[besoin][getIntensityLevel(intensite)]) || [];
  const exercice = suggestionDuJour || exerciceList[Math.floor(Math.random() * exerciceList.length)];

  return (
    <div className="max-w-md mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold text-center mb-4">Pause Cerveau</h1>
      <p className="text-center text-gray-600 mb-8">Un rituel de 3 minutes par jour pour souffler, relâcher et se reconnecter à soi.</p>

      <Card className="mb-6">
        <CardContent className="pt-4">
          <label className="block mb-2 font-semibold">Quel est votre besoin aujourd’hui ?</label>
          <Select value={besoin} onValueChange={setBesoin}>
            <SelectItem value="stress">Stress</SelectItem>
            <SelectItem value="fatigue">Fatigue</SelectItem>
            <SelectItem value="motivation">Manque de motivation</SelectItem>
            <SelectItem value="surcharge">Surcharge mentale</SelectItem>
            <SelectItem value="saturation">Saturation émotionnelle</SelectItem>
          </Select>

          <label className="block mt-6 mb-2 font-semibold">Sur une échelle de 0 à 10, à combien estimez-vous ce besoin ?</label>
          <Slider min={0} max={10} step={1} value={[intensite]} onValueChange={([val]) => setIntensite(val)} />

          <Button className="mt-6 w-full" onClick={handleValidation}>
            Voir ma pause de 3 minutes
          </Button>
        </CardContent>
      </Card>

      {showExercice && (
        <Card className="mb-6 animate-fade-in">
          <CardContent className="pt-4">
            <p className="text-lg italic mb-4">{exercice}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

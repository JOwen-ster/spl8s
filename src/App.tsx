import { useState, useEffect } from "react";
import type { ReactElement } from "react";
import { Users, Shuffle, Target, Shield, Sword } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import "./App.css";
import { shuffleArray, shuffleSupports, areSlayersEqual } from "./helpers";
import type {
  InputGroup,
  PlayerField,
  Players,
  PreviousSlayers,
  SupportMode,
  SupportModeOption,
  Team,
  TeamCardProps,
} from "./types";

const MAX_SHUFFLE_ATTEMPTS = 100;

const supportModes: SupportModeOption[] = [
  {
    value: "random",
    label: "Random",
    description: "Give each support a 50/50 chance of either team.",
  },
  {
    value: "swap",
    label: "Swap",
    description: "Switch supports between teams on every shuffle.",
  },
  {
    value: "static",
    label: "Static with backlines",
    description:
      "Keep Support 1 with Backline 1 and Support 2 with Backline 2.",
  },
];

function TeamCard(props: TeamCardProps): ReactElement {
  return (
    <div className="team-container">
      <h2 className="team-title">{props.teamName}</h2>
      <div className="team-content">
        <div className="team-role">
          <Target className="inline-icon" />
          <strong>Backline:</strong> {props.team.backline || "Not set"}
        </div>
        <div className="team-role">
          <Shield className="inline-icon" />
          <strong>Support:</strong> {props.team.support || "Not set"}
        </div>
        <div className="team-role">
          <Sword className="inline-icon" />
          <strong>Slayers:</strong>{" "}
          {props.team.slayers.length > 0
            ? props.team.slayers.join(", ")
            : "Not set"}
        </div>
      </div>
    </div>
  );
}

export default function App(): ReactElement {
  const [supportMode, setSupportMode] = useState<SupportMode>("random");
  const [players, setPlayers] = useState<Players>({
    backline1: "",
    backline2: "",
    support1: "",
    support2: "",
    slayer1: "",
    slayer2: "",
    slayer3: "",
    slayer4: "",
  });

  const [alphaTeam, setAlphaTeam] = useState<Team>({
    backline: "",
    support: "",
    slayers: [],
  });
  const [bravoTeam, setBravoTeam] = useState<Team>({
    backline: "",
    support: "",
    slayers: [],
  });
  const [prevSlayers, setPrevSlayers] = useState<PreviousSlayers>({
    alpha: [],
    bravo: [],
  });

  const updatePlayer = (field: PlayerField, value: string): void => {
    setPlayers((prev) => ({ ...prev, [field]: value }));
  };

  const generateTeams = (): void => {
    const slayers = [
      players.slayer1,
      players.slayer2,
      players.slayer3,
      players.slayer4,
    ].filter((s) => s.trim() !== "");

    if (
      slayers.length === 4 &&
      players.backline1 &&
      players.backline2 &&
      players.support1 &&
      players.support2
    ) {
      const shuffledSlayers: string[] = shuffleArray(slayers);

      const newAlpha: Team = {
        backline: players.backline1,
        support: players.support1,
        slayers: shuffledSlayers.slice(0, 2),
      };

      const newBravo: Team = {
        backline: players.backline2,
        support: players.support2,
        slayers: shuffledSlayers.slice(2),
      };

      setAlphaTeam(newAlpha);
      setBravoTeam(newBravo);
      setPrevSlayers({
        alpha: [...newAlpha.slayers],
        bravo: [...newBravo.slayers],
      });
    } else {
      setAlphaTeam((prev) => ({
        ...prev,
        backline: players.backline1,
        support: players.support1,
      }));
      setBravoTeam((prev) => ({
        ...prev,
        backline: players.backline2,
        support: players.support2,
      }));
    }
  };

  useEffect(generateTeams, [players]);

  const shuffleTeams = (): void => {
    const allPlayersHaveValues = Object.values(players).every(
      (value) => value.trim() !== "",
    );
    if (!allPlayersHaveValues) {
      toast.error("Please fill in all player names before shuffling!");
      return;
    }

    const [alphaSupport, bravoSupport] = shuffleSupports(
      supportMode,
      [alphaTeam.support, bravoTeam.support],
      [players.support1, players.support2],
    );
    const newAlpha: Team = { ...alphaTeam, support: alphaSupport };
    const newBravo: Team = { ...bravoTeam, support: bravoSupport };

    const allSlayers = [...alphaTeam.slayers, ...bravoTeam.slayers];
    let newAlphaSlayers: string[];
    let newBravoSlayers: string[];
    let attempts: number = 0;

    do {
      const shuffled: string[] = shuffleArray(allSlayers);
      newAlphaSlayers = shuffled.slice(0, 2);
      newBravoSlayers = shuffled.slice(2);
      attempts++;
    } while (
      (areSlayersEqual(newAlphaSlayers, prevSlayers.alpha) ||
        areSlayersEqual(newBravoSlayers, prevSlayers.bravo) ||
        areSlayersEqual(newAlphaSlayers, prevSlayers.bravo) ||
        areSlayersEqual(newBravoSlayers, prevSlayers.alpha)) &&
      attempts < MAX_SHUFFLE_ATTEMPTS
    );

    newAlpha.slayers = newAlphaSlayers;
    newBravo.slayers = newBravoSlayers;

    setAlphaTeam(newAlpha);
    setBravoTeam(newBravo);
    setPrevSlayers({
      alpha: [...newAlphaSlayers],
      bravo: [...newBravoSlayers],
    });
    toast.success("Re-shuffled teams!");
  };

  const inputGroups: InputGroup[] = [
    {
      legend: "Backlines",
      icon: Target,
      fields: ["backline1", "backline2"],
      placeholders: ["Backline 1", "Backline 2"],
    },
    {
      legend: "Supports",
      icon: Shield,
      fields: ["support1", "support2"],
      placeholders: ["Support 1", "Support 2"],
    },
    {
      legend: "Slayers",
      icon: Sword,
      fields: ["slayer1", "slayer2", "slayer3", "slayer4"],
      placeholders: ["Slayer 1", "Slayer 2", "Slayer 3", "Slayer 4"],
    },
  ];

  return (
    <div className="app">
      <Toaster position="bottom-right" />
      <a
        className="github-button"
        href="https://github.com/JOwen-ster/spl8s"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="View Eights Creator on GitHub"
      >
        <img src={`${import.meta.env.BASE_URL}github.svg`} alt="GitHub" />
      </a>
      <h1 className="title">8's Creator</h1>
      <h3 className="sub-title">Created By Typos (typos. on discord)</h3>

      <div className="setup-layout">
        <div className="input-container">
          <h3 className="input-title">
            <Users className="section-icon" />
            Enter Players:
          </h3>

          {inputGroups.map(({ legend, icon: Icon, fields, placeholders }) => (
            <fieldset key={legend} className="role-group">
              <legend>
                <Icon className="role-icon" />
                {legend}
              </legend>
              <div className="role-inputs">
                {fields.map((field, index) => (
                  <input
                    key={field}
                    type="text"
                    value={players[field]}
                    onChange={(e) => updatePlayer(field, e.target.value)}
                    placeholder={placeholders[index]}
                    className="player-input"
                  />
                ))}
              </div>
            </fieldset>
          ))}
        </div>

        <aside className="shuffle-settings" aria-label="Shuffle settings">
          <fieldset className="support-options">
            <legend>
              <Shield className="role-icon" /> Support behavior
            </legend>
            <p className="settings-hint">
              Applies when you click Shuffle Teams.
            </p>
            {supportModes.map(({ value, label, description }) => (
              <label key={value} className="support-option">
                <input
                  type="radio"
                  name="support-mode"
                  value={value}
                  checked={supportMode === value}
                  onChange={() => setSupportMode(value)}
                />
                <span>
                  <strong>{label}</strong>
                  <span className="option-description">{description}</span>
                </span>
              </label>
            ))}
          </fieldset>
        </aside>
      </div>

      <div className="teams-section">
        <TeamCard team={alphaTeam} teamName="Team Alpha" />
        <TeamCard team={bravoTeam} teamName="Team Bravo" />
      </div>

      <button className="shuffle-button" onClick={shuffleTeams}>
        <Shuffle className="button-icon" />
        Shuffle Teams
      </button>
    </div>
  );
}

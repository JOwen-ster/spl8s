import type { LucideIcon } from "lucide-react";

export type SupportMode = "swap" | "random" | "static";
export type SupportPair = [alpha: string, bravo: string];

export interface SupportModeOption {
  value: SupportMode;
  label: string;
  description: string;
}

export interface Players {
  backline1: string;
  backline2: string;
  support1: string;
  support2: string;
  slayer1: string;
  slayer2: string;
  slayer3: string;
  slayer4: string;
}

export type PlayerField = keyof Players;

export interface InputGroup {
  legend: string;
  icon: LucideIcon;
  fields: PlayerField[];
  placeholders: string[];
}

export interface PreviousSlayers {
  alpha: string[];
  bravo: string[];
}

export interface Team {
  backline: string;
  support: string;
  slayers: string[];
}

export interface TeamCardProps {
  team: Team;
  teamName: string;
}

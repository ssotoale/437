export interface Mural {
  name: string;
  artist: string;
  description: string;
  address: string;
  featuredImage?: string;
  yearMade: number;
  condition: MuralCondition;
  politicalInfluence?: PoliticalInfluence;
}

export type MuralCondition =
  | "pristine"
  | "good"
  | "faded"
  | "restored"
  | "damaged";

export type PoliticalInfluence =
  | "chicano-movement"
  | "labor-rights"
  | "immigration"
  | "indigenous-rights"
  | "gentrification"
  | "womens-rights"
  | "other";
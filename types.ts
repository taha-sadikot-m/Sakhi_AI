
export interface GroundingChunkWeb {
  uri: string;
  title: string;
}

export interface GroundingChunk {
  web?: GroundingChunkWeb;
  // Add other potential grounding chunk types if needed
}

export interface AIResponse {
  text: string;
  sources?: GroundingChunk[];
}

export enum Feature {
  QnA = 'QnA',
  SchemeFinder = 'SchemeFinder',
}

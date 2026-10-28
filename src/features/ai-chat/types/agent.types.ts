export interface AgentToolResult {
  success: boolean;
  text: string;
  codeSnippet?: string;
  followUpPrompts?: string[];
  toolName: string;
}

export interface StructuredAgentResponse {
  response: string;
  followUpPrompts?: string[];
  codeSnippet?: string;
  toolUsed?: string;
  groundedFacts?: string[];
}

export interface AgentContext {
  userName?: string;
  localTime: string;
  localDate: string;
  timeZone: string;
  currentTrack?: string;
}

export interface AgentTool {
  name: string;
  description: string;
  canHandle(prompt: string): boolean;
  execute(prompt: string, context: AgentContext): AgentToolResult;
}

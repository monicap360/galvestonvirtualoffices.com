export type AgentFieldType =
  | "text"
  | "textarea"
  | "url"
  | "number"
  | "select"
  | "multiselect"
  | "toggle"
  | "time";

export type ConnectionState = "not_connected" | "needs_setup" | "connected";

export type AgentFieldOption = {
  label: string;
  value: string;
};

export type AgentField = {
  key: string;
  label: string;
  type: AgentFieldType;
  description?: string;
  placeholder?: string;
  options?: AgentFieldOption[];
  required?: boolean;
  readinessWeight?: number;
  maxLength?: number;
};

export type AgentSection = {
  id: string;
  title: string;
  description: string;
  fields: AgentField[];
};

export type ConnectionRequirement = {
  key: string;
  label: string;
  description: string;
  blocking: boolean;
};

export type AgentTemplate = {
  slug: string;
  vertical: string;
  defaultDisplayName: string;
  sections: AgentSection[];
  connections: ConnectionRequirement[];
  samplePrompts: string[];
  complianceNote?: string;
};

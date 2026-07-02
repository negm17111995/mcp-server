export const MAQAMI_MCP_URL: string;

export function getServerUrl(): string;

export interface MCPClientConfig {
  mcpServers: {
    "maqami-travel": {
      url: string;
    };
  };
}

export function getClientConfig(): MCPClientConfig;

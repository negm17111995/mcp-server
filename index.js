/**
 * MAQAMI Travel MCP Server Configuration
 * 
 * This package provides configuration helpers for connecting AI agents to the 
 * MAQAMI Travel MCP Server.
 * 
 * Endpoint: https://mcp.maqami.co/
 * No authentication required.
 */

const MAQAMI_MCP_URL = "https://mcp.maqami.co/";

/**
 * Returns the raw URL of the MAQAMI MCP Server
 * @returns {string} The endpoint URL
 */
function getServerUrl() {
  return MAQAMI_MCP_URL;
}

/**
 * Returns the standard MCP client configuration block
 * @returns {Object} JSON configuration object for MCP clients
 */
function getClientConfig() {
  return {
    mcpServers: {
      "maqami-travel": {
        url: MAQAMI_MCP_URL
      }
    }
  };
}

module.exports = {
  MAQAMI_MCP_URL,
  getServerUrl,
  getClientConfig
};

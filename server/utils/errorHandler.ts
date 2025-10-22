import type { Response } from 'express';

/**
 * Centralized error handling for service errors
 */
export function handleServiceError(error: unknown, res: Response) {
  console.error("Service error:", error);
  
  if (error instanceof Error) {
    const message = error.message;
    
    // Handle specific error types
    switch (message) {
      case "missing initData":
        return res.status(400).json({ ok: false, error: "missing initData" });
      case "invalid_signature":
        return res.status(401).json({ ok: false, error: "invalid_signature" });
      case "invalid_user":
        return res.status(400).json({ ok: false, error: "invalid_user" });
      case "missing token":
        return res.status(400).json({ ok: false, error: "missing token" });
      default:
        return res.status(500).json({ ok: false, error: "internal_server_error" });
    }
  }
  
  // Fallback for unknown error types
  return res.status(500).json({ ok: false, error: "internal_server_error" });
}


import { Request, Response } from 'express';

export interface EmailRequest {
  to: string;
  subject: string;
  message?: string;
}

export interface HealthCheckResponse {
  uptime: number;
  message: string;
  timestamp: number;
  environment: string;
  sendgrid: {
    configured: boolean;
    from_email: string;
  };
  sample_images: {
    directory_exists: boolean;
    count: number;
  };
}

export interface EmailResponse {
  success: boolean;
  message: string;
  messageId?: string;
  error?: string;
  details?: string;
}

export interface Attachment {
  filename: string;
  path: string;
  cid: string;
}

export type RequestHandler = (req: Request, res: Response) => Promise<Response | void>; 
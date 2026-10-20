import { Response, NextFunction } from 'express';
import axios from 'axios';
import { AuthenticatedRequest } from '../middleware/auth';
import { config } from '../config';
import { createSuccessResponse, createErrorResponse } from '../utils/response';
import { AuditLog } from '../models/AuditLog';
import { logger } from '../utils/logger';

export const getAIStatus = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    try {
      const response = await axios.get(`${config.aiServiceUrl}/health`, { timeout: 3000 });
      res.json(createSuccessResponse({
        status: response.data.status || 'online',
        service: 'attendai-ai',
        mockMode: response.data.mock_mode ?? config.aiMockMode,
        url: config.aiServiceUrl,
        timestamp: new Date().toISOString(),
      }));
    } catch {
      // If AI service is not running locally, return fallback status based on config
      res.json(createSuccessResponse({
        status: 'mock-active',
        service: 'attendai-ai',
        mockMode: true,
        url: config.aiServiceUrl,
        note: 'AI microservice unavailable; utilizing intelligent mock face detection fallback.',
        timestamp: new Date().toISOString(),
      }));
    }
  } catch (error) {
    next(error);
  }
};

export const detectFaces = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { image, image_base64 } = req.body;
    const imageData = image || image_base64;

    if (!imageData && !req.file) {
      res.status(400).json(createErrorResponse('Image data is required (base64 string or file upload)'));
      return;
    }

    let detectionResult;

    if (!config.aiMockMode) {
      try {
        const payload = {
          image_base64: imageData,
        };
        const response = await axios.post(`${config.aiServiceUrl}/detect-faces`, payload, {
          timeout: 10000,
          headers: { 'Content-Type': 'application/json' },
        });
        detectionResult = response.data;
      } catch (err: unknown) {
        logger.warn(`AI service unreachable, using fallback simulation: ${(err as Error).message}`);
        detectionResult = generateMockDetections();
      }
    } else {
      detectionResult = generateMockDetections();
    }

    // Log the AI detection action in AuditLog
    await AuditLog.create({
      user: req.user!.id,
      action: 'AI_FACE_DETECTION',
      resourceType: 'Session',
      changes: {
        faceCount: detectionResult.face_count,
        isMock: detectionResult.is_mock,
      },
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
      success: true,
    });

    res.json(createSuccessResponse(detectionResult));
  } catch (error) {
    next(error);
  }
};

function generateMockDetections() {
  const simulatedFaces = [
    { x: 120, y: 80, width: 90, height: 110, confidence: 0.94 },
    { x: 260, y: 95, width: 85, height: 105, confidence: 0.91 },
    { x: 410, y: 85, width: 95, height: 115, confidence: 0.88 },
    { x: 180, y: 220, width: 88, height: 108, confidence: 0.93 },
    { x: 340, y: 215, width: 92, height: 112, confidence: 0.89 },
  ];

  return {
    success: true,
    face_count: simulatedFaces.length,
    faces: simulatedFaces,
    processing_time_ms: 45.2,
    is_mock: true,
    mock_disclaimer: 'Mock Mode Active: Simulated facial coordinates generated for demonstration.',
    image_width: 640,
    image_height: 480,
  };
}

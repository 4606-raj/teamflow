import { HttpStatus } from '@nestjs/common';
import { Prisma } from '@prisma/client';

export interface MappedPrismaError {
  status: HttpStatus;
  error: string;
  message: string;
}

const FK_FIELD_LABELS: Record<string, string> = {
  projectId: 'Project',
  userId: 'User',
  reporterId: 'Reporter',
  createdBy: 'Creator',
  parentId: 'Parent task',
  organizationId: 'Organization',
};

const toArray = (value: unknown): string[] =>
  Array.isArray(value) ? value.map(String) : value ? [String(value)] : [];

const modelLabel = (error: Prisma.PrismaClientKnownRequestError) =>
  error.meta?.modelName ? String(error.meta.modelName) : 'Record';

/**
 * Maps a Prisma error to an HTTP-friendly shape.
 * Returns null when the error is not a Prisma error we know how to translate.
 */
export function mapPrismaError(error: unknown): MappedPrismaError | null {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      // Foreign key constraint failed
      case 'P2003': {
        const constraint = String(
          error.meta?.field_name ?? error.meta?.constraint ?? '',
        );
        const field = Object.keys(FK_FIELD_LABELS).find((key) =>
          constraint.includes(key),
        );
        const label = field ? FK_FIELD_LABELS[field] : 'Related record';

        return {
          status: HttpStatus.BAD_REQUEST,
          error: 'Bad Request',
          message: `${label} does not exist`,
        };
      }
      // Record required for the operation not found
      case 'P2025':
        return {
          status: HttpStatus.NOT_FOUND,
          error: 'Not Found',
          message: `${modelLabel(error)} or related record not found`,
        };
      // Unique constraint failed
      case 'P2002': {
        const fields = toArray(error.meta?.target);

        return {
          status: HttpStatus.CONFLICT,
          error: 'Conflict',
          message: fields.length
            ? `${modelLabel(error)} with this ${fields.join(', ')} already exists`
            : `${modelLabel(error)} already exists`,
        };
      }
      // Value too long / out of range / invalid value for column
      case 'P2000':
      case 'P2006':
      case 'P2007':
      case 'P2020':
        return {
          status: HttpStatus.BAD_REQUEST,
          error: 'Bad Request',
          message: 'Invalid value provided',
        };
      // Null constraint violation / missing required value
      case 'P2011':
      case 'P2012':
        return {
          status: HttpStatus.BAD_REQUEST,
          error: 'Bad Request',
          message: 'A required value is missing',
        };
    }
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    return {
      status: HttpStatus.BAD_REQUEST,
      error: 'Bad Request',
      message: 'Invalid data provided',
    };
  }

  return null;
}

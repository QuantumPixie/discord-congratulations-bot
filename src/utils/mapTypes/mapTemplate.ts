// src/utils/mapTypes/mapTemplate.ts
import { Templates } from '../../database/types';

export const mapTemplate = (template: any): Templates => {
  return {
    ...template,
    id: template.id as number | null,
    message_template: template.messageTemplate as string,
  };
};

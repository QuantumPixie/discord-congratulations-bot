import { Messages } from '../../database/types';

export const mapMessage = (message: any): Messages => {
  return {
    ...message,
    id: message.id as unknown as number | null,
    user_id: message.user_id as unknown as number,
    template_id: message.template_id as unknown as number,
    sprint_id: message.sprint_id as unknown as number,
    timestamp: message.timestamp as unknown as string,
  };
};

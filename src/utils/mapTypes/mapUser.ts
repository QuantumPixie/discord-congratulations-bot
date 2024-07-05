import { Users } from '../../database/types';

export const mapUser = (user: any): Users => {
  return {
    id: user.id,
    user_name: user.user_name,
  };
};

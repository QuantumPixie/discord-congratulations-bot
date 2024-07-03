import { Users } from '../../database/types';

export const mapUser = (user: any): Users => {
  return {
    ...user,
    id: user.id as number,
  };
};

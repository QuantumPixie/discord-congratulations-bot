import { Sprints } from '../../database/types';

export const mapSprint = (sprint: any): Sprints => {
  return {
    ...sprint,
    id: sprint.id as number,
    sprint_code: sprint.sprintCode as string,
    sprint_name: sprint.sprintName as string,
  };
};

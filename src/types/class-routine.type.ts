import { TClassRoom } from "./classRoom.type";
import { TMeta } from "./global.type";
import { TSubjectPlan } from "./subject-plan.type";


export type TClassRoutine = {
    id: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;

    dayOfTheWeek: string,
    startTime: string,
    endTime: string,
    type: string,
    classRoom: TClassRoom,
    subject: TSubjectPlan,


}

export type TClassRoutineResponse = {
    data: TClassRoutine[];
    meta: TMeta;
}
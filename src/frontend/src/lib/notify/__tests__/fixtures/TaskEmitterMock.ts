import { TaskEmitter, NotifyTask } from "@/lib/notify/lib";

export const addTask = jest.fn();

export class TaskEmitterMock extends TaskEmitter {
  public addTask(task: NotifyTask): void {
    addTask(task);
  }
}

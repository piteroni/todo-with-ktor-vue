package io.github.piteroni.todoktorvue.app.usecase.task

import io.github.piteroni.todoktorvue.app.domain.DomainException
import io.github.piteroni.todoktorvue.app.domain.task.Task
import io.github.piteroni.todoktorvue.app.domain.task.TaskId
import io.github.piteroni.todoktorvue.app.domain.task.TaskName
import io.github.piteroni.todoktorvue.app.domain.task.TaskRepository
import io.github.piteroni.todoktorvue.app.domain.user.UserId

class TaskUseCase(private val taskRepository: TaskRepository) {
    /**
     * Create a retained task in the repository.
     *
     * @param inputData Input data required when creating retained task.
     * @return created retained task.
     * @throws RetainedTaskCreationInputDataException Thrown when input data does not follow domain.
     */
    fun createRetainedTask(inputData: RetainedTaskCreationInputData): Task {
        val userId = UserId(inputData.userId)
        val name: TaskName

        try {
            name = TaskName(inputData.name)
        } catch (exception: DomainException) {
            throw RetainedTaskCreationInputDataException(exception.message!!)
        }

        val task = Task.create(userId, name)

        return taskRepository.save(task)
    }

    /**
     * Get list of retained task from repository.
     *
     * @return List of retained tasks retrieved from the repository.
     */
    fun getRetainedTaskList(authorId: Int): List<RetainedTask> {
        return taskRepository.findAllByUserId(UserId(authorId)).map { RetainedTask(it.id.value, it.name.value) }
    }

    /**
     * Delete retained task stored in repository.
     *
     * @param inputData Input data required when deleting retained task.
     * @throws RetainedTaskDeletionInputDataException Thrown when input data does not follow domain.
     * @throws AuthorizationException Thrown when does not have the authority to delete retained task.
     */
    fun deleteRetainedTask(inputData: RetainedTaskDeletionInputData) {
        val userId = UserId(inputData.userId)
        val taskId: TaskId

        try {
            taskId = TaskId(inputData.taskId)
        } catch (exception: DomainException) {
            throw RetainedTaskDeletionInputDataException(exception.message!!)
        }

        val task = taskRepository.find(taskId)

        if (task == null || task.userId != userId) {
            throw AuthorizationException("not have permission to delete tasks. userId = $userId, taskId = $taskId")
        }

        taskRepository.remove(task.id)
    }
}

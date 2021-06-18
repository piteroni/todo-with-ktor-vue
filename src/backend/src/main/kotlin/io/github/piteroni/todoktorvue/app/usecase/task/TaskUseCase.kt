package io.github.piteroni.todoktorvue.app.usecase.task

import io.github.piteroni.todoktorvue.app.domain.DomainException
import io.github.piteroni.todoktorvue.app.domain.task.Task
import io.github.piteroni.todoktorvue.app.domain.task.TaskId
import io.github.piteroni.todoktorvue.app.domain.task.TaskName
import io.github.piteroni.todoktorvue.app.domain.task.TaskRepository
import io.github.piteroni.todoktorvue.app.domain.user.UserId

class TaskUseCase(private val taskRepository: TaskRepository) {
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

    fun getRetainedTaskList(authorId: Int): List<RetainedTask> {
        return taskRepository.findAllByUserId(UserId(authorId)).map { RetainedTask(it.id.value, it.name.value) }
    }

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
            throw AuthorizationException("not have permission to delete tasks. userId = $userId, taskId = $taskId"  )
        }

        taskRepository.remove(task.id)
    }
}

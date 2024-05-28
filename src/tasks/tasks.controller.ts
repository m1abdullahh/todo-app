import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import {
  AddTaskDTO,
  PaginationDTO,
  SearchTasksDTO,
  UpdateTaskDTO,
} from './tasks.dto';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Tasks')
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @ApiResponse({ status: 200, description: 'Tasks Fetched' })
  @ApiOperation({ summary: 'Get all tasks' })
  @ApiQuery({ name: 'query', type: SearchTasksDTO })
  @ApiQuery({ name: 'pagination', type: PaginationDTO })
  @Get()
  async getAllTasks(@Query() payload: SearchTasksDTO & PaginationDTO) {
    return await this.tasksService.getAllTasks(payload);
  }

  @ApiOperation({ summary: 'Get specific task by ID' })
  @ApiResponse({ status: 200, description: 'Task Fetched' })
  @ApiParam({ name: 'id', type: String, required: true })
  @Get(':id')
  async getTask(@Param('id') id: string) {
    return await this.tasksService.getTask(id);
  }

  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({ status: 201, description: 'Task Created' })
  @ApiOperation({ summary: 'Add a Task' })
  @ApiBody({ type: AddTaskDTO, required: true })
  @Post()
  async createTask(@Body() data: AddTaskDTO) {
    return await this.tasksService.createTask(data);
  }

  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: 'Task Updated' })
  @ApiOperation({ summary: 'Update task details' })
  @ApiParam({ type: String, required: true, name: 'id' })
  @ApiBody({ type: UpdateTaskDTO, required: true })
  @Patch(':id')
  async updateTask(@Param('id') id: string, @Body() data: Partial<AddTaskDTO>) {
    return await this.tasksService.patchTask(id, data);
  }

  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: 'Task Deleted' })
  @ApiOperation({ summary: 'Delete a task' })
  @ApiParam({ type: String, required: true, name: 'id' })
  @Delete(':id')
  async deleteTask(@Param('id') id: string) {
    return await this.tasksService.deleteTask(id);
  }
}

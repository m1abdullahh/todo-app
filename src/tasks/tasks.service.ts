import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddTaskDTO } from './tasks.dto';
import { paginator } from 'src/utils';
import { PaginateFunction } from 'src/common/interfaces';
import { TaskStatus } from '@prisma/client';
import { TasksSearch } from './tasks.interfaces';
import * as moment from 'moment';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}
  async getAllTasks({
    is_active,
    name,
    page = 1,
    perPage = 10,
    priority,
    status,
    from,
    to,
  }: TasksSearch) {
    const paginate: PaginateFunction = paginator({ page, perPage });

    let searchQuery = {};

    if (is_active) {
      searchQuery = {
        ...searchQuery,
        status: TaskStatus.IN_PROGRESS,
      };
    }

    searchQuery = {
      ...searchQuery,
      name,
      priority,
      status,
    };

    if ((from && !to) || (to && !from)) {
      throw new BadRequestException(
        'Provide both "from" and "to" date ranges.',
      );
    } else if (!!from && !!to) {
      searchQuery = {
        ...searchQuery,
        date_of_creation: {
          lte: moment(to, 'DD-MM-YYYY').endOf('day').toDate(),
          gte: moment(from, 'DD-MM-YYYY').startOf('day').toDate(),
        },
      };
    }

    searchQuery = {
      where: {
        ...searchQuery,
      },
    };

    return paginate(
      this.prisma.task,
      {
        ...searchQuery,
        orderBy: {
          date_of_creation: 'desc',
        },
      },
      { page, perPage },
    );
  }

  async getTask(id: string) {
    const task = await this.prisma.task.findUnique({ where: { id } });

    if (!task) {
      throw new NotFoundException('Task not found.');
    }
  }

  async createTask(data: AddTaskDTO) {
    const createdTask = await this.prisma.task.create({
      data: {
        ...data,
      },
    });

    return createdTask;
  }

  async patchTask(taskId: string, data: Partial<AddTaskDTO>) {
    const { due_date } = data;

    if (due_date) {
      const formattedDate = moment(due_date, 'DD-MM-YYYY')
        .endOf('day')
        .toDate();

      data = {
        ...data,
        due_date: formattedDate,
      };
    }

    return await this.prisma.task.update({
      where: {
        id: taskId,
      },
      data: { ...data },
    });
  }

  async deleteTask(id: string) {
    return await this.prisma.task.delete({ where: { id } });
  }
}

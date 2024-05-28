import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { TaskPriority, TaskStatus } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import * as moment from 'moment';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class AddTaskDTO {
  @ApiProperty({ type: String, required: true, example: 'Buy Eggs' })
  @IsString()
  name: string;

  @ApiProperty({ type: String, required: true, example: '28-05-2024' })
  @Type(() => String)
  @Transform(({ value }) => moment(value, 'DD-MM-YYYY').endOf('day').toDate())
  due_date: Date;

  @ApiProperty({ enum: TaskStatus, required: false })
  @IsString()
  @IsEnum(TaskStatus)
  @IsOptional()
  status: TaskStatus = TaskStatus.PENDING;

  @ApiProperty({ enum: TaskPriority, required: false })
  @IsString()
  @IsEnum(TaskPriority)
  @IsOptional()
  priority: TaskPriority = TaskPriority.MEDIUM;

  @ApiProperty({ type: Boolean, required: false })
  @IsBoolean()
  @IsOptional()
  is_active: boolean = true;
}

export class UpdateTaskDTO extends PartialType(AddTaskDTO) {}

export class PaginationDTO {
  @ApiProperty({ type: Number, required: true })
  @IsNotEmpty()
  page: number;

  @ApiProperty({ type: Number, required: true })
  @IsNotEmpty()
  perPage: number;
}

export class SearchTasksDTO {
  @ApiProperty({ type: String, required: false })
  @IsString()
  name?: string;

  @ApiProperty({ type: Boolean, required: false })
  @IsString()
  is_active?: boolean;

  @ApiProperty({ enum: TaskPriority, required: false })
  @IsString()
  priority?: string;

  @ApiProperty({ enum: TaskStatus, required: false })
  @IsString()
  status?: string;

  @ApiProperty({ type: String, required: false })
  @IsString()
  from?: string;

  @ApiProperty({ type: String, required: false })
  @IsString()
  to?: string;
}

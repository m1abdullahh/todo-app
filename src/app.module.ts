import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { TasksModule } from './tasks/tasks.module';
import { PrismaModule } from 'nestjs-prisma';

@Module({
  imports: [PrismaModule.forRoot({ isGlobal: true }), TasksModule],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}

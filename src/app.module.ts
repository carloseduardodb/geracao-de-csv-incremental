import { Module } from '@nestjs/common';
import { ArchiveModule } from './archive/archive.module';

@Module({
  imports: [ArchiveModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

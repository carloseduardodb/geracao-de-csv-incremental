import { Body, Controller, Post } from '@nestjs/common';
import { ArchiveService } from './archive.service';
import { LineDto } from './dto/line.dto';

@Controller('archive')
export class ArchiveController {
  constructor(private readonly archiveService: ArchiveService) {}

  @Post('/')
  async archive(@Body() request: LineDto) {
    return await this.archiveService.create(
      request,
      './src/generate-archives/',
    );
  }

  @Post('/test')
  async test() {
    await this.archiveService.test();
  }
}

import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Query,
  Body,
  UseGuards,
} from '@nestjs/common';
import { SidesService } from './sides.service';
import { CreateSideDto } from './dto/create-side.dto';
import { UpdateSideDto } from './dto/update-side.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('sides')
export class SidesController {
  constructor(private readonly sidesService: SidesService) {}

  @Get()
  findAll(@Query('floorId') floorId?: string) {
    return this.sidesService.findAll(floorId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sidesService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateSideDto) {
    return this.sidesService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateSideDto) {
    return this.sidesService.update(id, dto);
  }

  @Patch(':id/status')
  toggleStatus(@Param('id') id: string) {
    return this.sidesService.toggleStatus(id);
  }
}

import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { DisplayConfigurationsService } from './display-configurations.service';
import { CreateDisplayConfigurationDto } from './dto/create-display-configuration.dto';
import { UpdateDisplayConfigurationDto } from './dto/update-display-configuration.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('display-configurations')
export class DisplayConfigurationsController {
  constructor(
    private readonly displayConfigurationsService: DisplayConfigurationsService,
  ) {}

  @Get()
  findAll() {
    return this.displayConfigurationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.displayConfigurationsService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateDisplayConfigurationDto) {
    return this.displayConfigurationsService.create(dto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateDisplayConfigurationDto,
  ) {
    return this.displayConfigurationsService.update(id, dto);
  }

  @Patch(':id/status')
  toggleStatus(@Param('id') id: string) {
    return this.displayConfigurationsService.toggleStatus(id);
  }
}

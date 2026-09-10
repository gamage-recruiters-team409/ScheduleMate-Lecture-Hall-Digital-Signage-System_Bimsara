import { Controller, Get, Param } from '@nestjs/common';
import { SignageService } from './signage.service';

@Controller('public')
export class SignageController {
  constructor(private readonly signageService: SignageService) {}

  @Get('displays/:displayKey')
  getDisplayData(@Param('displayKey') displayKey: string) {
    return this.signageService.getDisplayData(displayKey);
  }

  @Get('rooms/:roomCode/status')
  getRoomStatusByCode(@Param('roomCode') roomCode: string) {
    return this.signageService.getRoomStatusByCode(roomCode);
  }
}

import { Body, Controller, HttpCode, Post, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { EncryptRequestDto, EncryptResponseDto } from './dto/Encrypt.dto';
import { DecryptRequestDto, DecryptResponseDto } from './dto/Decrypt.dto';
import { ApiResponse } from '@nestjs/swagger';
import { FailedResponseDto, IResponse } from './dto/Response.dto';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('get-encrypt-data')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Encryption successful.',
    type: EncryptResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Encryption failed.',
    type: FailedResponseDto,
  })
  encryptData(
    @Body() encryptDto: EncryptRequestDto,
    @Res({ passthrough: true }) response: Response,
  ): IResponse {
    const result = this.appService.encryptData(encryptDto);
    if (!result.successful) {
      response.status(500);
      // TODO: check the error, some error should return with status 4xx
    }
    return result;
  }

  @Post('get-decrypt-data')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Decryption successful.',
    type: DecryptResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Decryption failed.',
    type: FailedResponseDto,
  })
  decryptData(
    @Body() decryptReqDto: DecryptRequestDto,
    @Res({ passthrough: true }) response: Response,
  ): IResponse {
    const result = this.appService.decryptData(decryptReqDto);
    if (!result.successful) {
      response.status(500);
      // TODO: check the error, some error should return with status 4xx
    }
    return result;
  }
}

import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, Length } from 'class-validator';
import { SuccessResposnseDto } from './Response.dto';

export class EncryptRequestDto {
  @ApiProperty({
    description: 'Data to encrypt',
    example: 'hello world!',
  })
  @IsDefined()
  @Length(0, 2000)
  payload: string;
}

export class EncryptResponseDataDto {
  @ApiProperty({
    description: 'Encrypted AES key',
    example:
      '818587913283680dd001361f062ba1797003cd9292a260cd7514dae721707905bcc3c19adfe77bfc846b79ada7204d0e37a7d25df9de1d669f485ca5a4cc4a7fcdda39c5ae9a0933ea28b13b06b8d94e85fd420ab15a91d7ea50b40ca39e6c134067772be127b42c585186138168b10c9cf51cbbe55f6bf1473acc0407b27c8f',
  })
  data1: string;

  @ApiProperty({
    description: 'Encrypted data',
    example: '9b832b69c0d41a3cfda984fae4c9e6a0',
  })
  data2: string;
}

export class EncryptResponseDto extends SuccessResposnseDto {
  @ApiProperty()
  data: EncryptResponseDataDto;

  constructor(data: EncryptResponseDataDto) {
    super();
    this.data = data;
  }
}

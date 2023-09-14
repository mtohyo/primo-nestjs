import { ApiProperty } from '@nestjs/swagger';
import { IsDefined } from 'class-validator';
import { SuccessResposnseDto } from './Response.dto';

export class DecryptRequestDto {
  @ApiProperty({
    description: 'Encrypted AES key',
    example:
      '818587913283680dd001361f062ba1797003cd9292a260cd7514dae721707905bcc3c19adfe77bfc846b79ada7204d0e37a7d25df9de1d669f485ca5a4cc4a7fcdda39c5ae9a0933ea28b13b06b8d94e85fd420ab15a91d7ea50b40ca39e6c134067772be127b42c585186138168b10c9cf51cbbe55f6bf1473acc0407b27c8f',
  })
  @IsDefined()
  data1: string;

  @ApiProperty({
    description: 'Encrypted data',
    example: '9b832b69c0d41a3cfda984fae4c9e6a0',
  })
  @IsDefined()
  data2: string;
}

export class DecryptResponseDataDto {
  @ApiProperty({ example: 'hello world!' })
  payload: string;
}

export class DecryptResponseDto extends SuccessResposnseDto {
  @ApiProperty()
  data: DecryptResponseDataDto;

  constructor(data: DecryptResponseDataDto) {
    super();
    this.data = data;
  }
}

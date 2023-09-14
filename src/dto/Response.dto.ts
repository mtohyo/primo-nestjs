import { ApiProperty } from '@nestjs/swagger';

export interface IResponse {
  successful: boolean;
  error_code: string;
  data: any;
}

export class SuccessResposnseDto implements IResponse {
  @ApiProperty({ example: true })
  successful: boolean = true;

  @ApiProperty({ example: '' })
  error_code: string = '';

  data: any;
}

export class FailedResponseDto implements IResponse {
  @ApiProperty({ example: false })
  successful: boolean = false;

  @ApiProperty({ example: 'ERR_OSSL_RSA_INVALID_PADDING' })
  error_code: string;

  @ApiProperty({ example: null })
  data: any = null;

  constructor(error_code: string) {
    this.error_code = error_code;
  }
}

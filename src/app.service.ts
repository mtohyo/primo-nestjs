import { Injectable } from '@nestjs/common';
import * as crypto from 'node:crypto';
import {
  EncryptRequestDto,
  EncryptResponseDataDto,
  EncryptResponseDto,
} from './dto/Encrypt.dto';
import {
  DecryptRequestDto,
  DecryptResponseDataDto,
  DecryptResponseDto,
} from './dto/Decrypt.dto';
import { FailedResponseDto, IResponse } from './dto/Response.dto';

@Injectable()
export class AppService {
  readonly RSA_PRIVATE_KEY =
    '-----BEGIN RSA PRIVATE KEY-----\n' +
    'MIICWwIBAAKBgQDZG4xt2W2gl2aZv45UXxDKo2OMaCwBIwd3ympoum4I4OMOXJSI' +
    'tWmztetWtGlDTm2lWd5fQfDZIQ9+nUhGFPvFgxTFv8mTUijba0pr5wBGe9Kdjjfw' +
    '7PQWoOiK3t8n5Im3sv2xViOm8CAU1LJE0s7OABq8G7jDHgU/o1ybnhBnuQIDAQAB' +
    'AoGAb3bMV02NEikI/SCywzB3n4HZRynohcDlQaRDk3c7rQVArYvsmm+BUEmzBLXl' +
    'YS/v7TfBimiBbgiiOuAnTgvR4niYiIGkhnYXd71zfXuaN5O7fTMPFXtbmJky4tF3' +
    'Ihw1yNocXB6JHaDHX0vm/xg1mbAXU+Mq1hQRM+oQdOKblXECQQD0c/Cu8zojrnD2' +
    'A+eVwp350Gagoisri32SLQkEf/dlObCkK3tYiyiC/41GW9pV6sN0qZSCRCJmyrOO' +
    'teiuhZ1VAkEA41zvIX3qQvP0K70MeBORMjIrvVKhvdbzVTSWVvuPhB1DibPvcExX' +
    'D6pY+51nBFCqy5aeXtev9rYKEuX+YVKA1QJANI5ArrxoQYedjablQVNoN29QwTRc' +
    'Z65Dvwujpq4EeGTgz0rx5+VzPkbHDttso5AnmYtj/GW9p6/ozsPZVLwxSQJATKf4' +
    'uAIMCabWnCiRG6r9OT9RH/PMNIVUZVXlmk4WhSSYsMTJ5cLXV6DHf44CPaI0849E' +
    'thVibnvRya1hps56QQJAIhiWBts/E2COLCx9OxlszF6Knu/C1+etb8gc4H5sW0hm' +
    'lFdH7DDgZXw41lozg/Pjgwce62vQnSLkFKvnxvOd4Q==\n' +
    '-----END RSA PRIVATE KEY-----';
  readonly RSA_PUBLIC_KEY =
    '-----BEGIN PUBLIC KEY-----\n' +
    'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDZG4xt2W2gl2aZv45UXxDKo2OM' +
    'aCwBIwd3ympoum4I4OMOXJSItWmztetWtGlDTm2lWd5fQfDZIQ9+nUhGFPvFgxTF' +
    'v8mTUijba0pr5wBGe9Kdjjfw7PQWoOiK3t8n5Im3sv2xViOm8CAU1LJE0s7OABq8' +
    'G7jDHgU/o1ybnhBnuQIDAQAB\n' +
    '-----END PUBLIC KEY-----';

  readonly AES_ALGORITHM = 'aes-256-cbc';
  readonly AES_KEY_SIZE = 32;
  readonly AES_IV_SIZE = 16;
  readonly AES_IV = Buffer.alloc(this.AES_IV_SIZE, 0);

  encryptData(encryptReqDto: EncryptRequestDto): IResponse {
    try {
      // encrypt payload
      const aesKey = crypto.randomBytes(this.AES_KEY_SIZE / 2).toString('hex');
      const cipher = crypto.createCipheriv(
        this.AES_ALGORITHM,
        aesKey,
        this.AES_IV,
      );
      let encryptedPayload = cipher.update(
        encryptReqDto.payload,
        'utf8',
        'hex',
      );
      encryptedPayload += cipher.final('hex');

      // encrypt AES key
      const encryptedAesKey = crypto
        .privateEncrypt(this.RSA_PRIVATE_KEY, Buffer.from(aesKey, 'hex'))
        .toString('hex');

      let respData = new EncryptResponseDataDto();
      respData.data1 = encryptedAesKey;
      respData.data2 = encryptedPayload;

      return new EncryptResponseDto(respData);
    } catch (error) {
      return new FailedResponseDto(error.code);
    }
  }

  decryptData(decryptReqDto: DecryptRequestDto): IResponse {
    try {
      // decrypt AES key
      const decryptedAesKey = crypto
        .publicDecrypt(
          this.RSA_PUBLIC_KEY,
          Buffer.from(decryptReqDto.data1, 'hex'),
        )
        .toString('hex');

      // decrypt payload
      const decipher = crypto.createDecipheriv(
        this.AES_ALGORITHM,
        decryptedAesKey,
        this.AES_IV,
      );
      let decryptedPayload = decipher.update(
        decryptReqDto.data2,
        'hex',
        'utf8',
      );
      decryptedPayload += decipher.final('utf8');

      let respData = new DecryptResponseDataDto();
      respData.payload = decryptedPayload;

      return new DecryptResponseDto(respData);
    } catch (error) {
      return new FailedResponseDto(error.code);
    }
  }
}

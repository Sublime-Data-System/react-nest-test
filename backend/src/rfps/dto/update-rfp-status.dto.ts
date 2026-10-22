import { IsEnum } from 'class-validator';
import { RfpStatus } from '../rfp-status.enum';

export class UpdateRfpStatusDto {
  @IsEnum(RfpStatus)
  status!: RfpStatus;
}

/* eslint-disable class-methods-use-this */
import documentsSvc from '@efex-services/documents/documentsSvc';
import { OnboardingDocumentTypeIds } from '@efex-services/documents/types';
import { DateTime } from 'luxon';
import {
  MxOnboardinStageAccount,
  MxOnboardinStageDocuments,
  RawDataAccount,
  RawDataDocuments,
} from '../types';

export default class ConvertMxOnboarding {
  uploadFiles(file: File, enterpriseId: number): void {
    documentsSvc.uploadOnboardingDocument(enterpriseId, {
      documentTypeId: OnboardingDocumentTypeIds.bankStatement,
      totalDocuments: 1,
      documents: [file] as unknown as FormData,
    });
  }

  getDocumentsStage(data: RawDataDocuments): MxOnboardinStageDocuments {
    const {
      addressLine1,
      incorporation,
      taxId,
      resourceStatament,
      resourceStatementOption,
      legalRepresentativeStatament,
      postCode,
      phoneNumber,
      website,
      businessSectorId,
      idNumber,
      idType,
      citizenship,
      externalNumber,
      internalNumber,
    } = data;
    return {
      idNumber,
      idType,
      addressLine1,
      citizenship,
      businessSectorId: businessSectorId || 0,
      phoneNumber: phoneNumber || '',
      postalCodeId: postCode,
      incorporation: incorporation
        ? DateTime.fromISO(incorporation).toFormat('yyyy-MM-dd')
        : undefined,
      rfc: taxId || '',
      resourceStatament:
        resourceStatament && typeof resourceStatament === 'boolean'
          ? resourceStatament
          : !!resourceStatament || false,
      resourceStatementOption: resourceStatementOption || '',
      legalRepresentativeStatament:
        legalRepresentativeStatament &&
        typeof legalRepresentativeStatament === 'boolean'
          ? legalRepresentativeStatament
          : !!legalRepresentativeStatament || false,
      website,
      externalNumber,
      internalNumber,
    };
  }

  getAccountStage(
    data: RawDataAccount,
    enterpriseId: number
  ): MxOnboardinStageAccount {
    const { accountCurrency, accountNumber, bankName, bankStatement } = data;
    if (bankStatement) {
      this.uploadFiles(bankStatement, enterpriseId);
    }
    return {
      bankName,
      clabe: accountNumber,
      currency: accountCurrency,
    };
  }
}

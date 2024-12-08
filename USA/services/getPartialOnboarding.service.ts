/* eslint-disable class-methods-use-this */
import { StakeHoldersFormData } from '@efex-services/client/types';
import {
  OnboardingDocumentTypeIds,
  OnboardingUsaDocumentTypeIds,
} from '@efex-services/documents/types';
import { MexicoStakeHoldersFormData } from '@pages/onboarding/Mexico/types/stakeholders.type';
import { IStakeholderResponse } from '@pages/onboarding/types/newStakeholderResponse';
import { DateTime } from 'luxon';
import type {
  FormDataFromPartial,
  IOnboardingPartials,
  IStakeholdersPartials,
} from '../types';

type StakeHolderDocumentType =
  IStakeholderResponse['stakeholders'][0]['documents'];

export default class GetPartialOnboarding {
  buildFormData = (
    onboardingData: IOnboardingPartials
  ): FormDataFromPartial => ({
    accountCurrency: onboardingData.accountCurrency,
    accountNumber: onboardingData.accountNumber,
    accountType: onboardingData.accountType,
    addressLine: onboardingData.addressLine1,
    addressLine1: onboardingData.addressLine1,
    addressLine2: onboardingData.addressLine2,
    bankCode: onboardingData.bankCode,
    bankName: onboardingData.bankName,
    birthDate: DateTime.fromISO(onboardingData.birthDate),
    citizenship: onboardingData.citizenShip || '',
    city: onboardingData.city,
    companyDocumentType: onboardingData.companyDocumentType,
    effectiveAt: DateTime.fromISO(onboardingData.effectiveAt),
    expiredAt: DateTime.fromISO(onboardingData.expiredAt),
    gender: onboardingData.gender,
    idNumber: onboardingData.idNumber || '',
    idType: onboardingData.idType || '',
    incorporation: DateTime.fromISO(onboardingData.incorporation),
    industryCode: onboardingData.industryCode,
    isBankStatementUploaded: onboardingData.bankStatementFile,
    isCertificateUploaded: onboardingData.certificateFile,
    isConstitutionUploaded: onboardingData.constitutionFileFile,
    isIdFileBackUploaded: onboardingData.idFileBackFile,
    isIdFileFrontUploaded: onboardingData.idFileFrontFile,
    isResidenceUploaded: onboardingData.residenceFile,
    isSatUploaded: onboardingData.satFile,
    number: onboardingData.number,
    phoneNumber:
      onboardingData?.phoneNumberEnterprise ||
      onboardingData?.phoneNumber ||
      '',
    postCode: onboardingData.postCode,
    question1:
      onboardingData.questions?.find((item) => item.questionId === 1)?.answer ||
      undefined,
    question2:
      onboardingData.questions?.find((item) => item.questionId === 2)?.answer ||
      undefined,
    question3:
      onboardingData.questions?.find((item) => item.questionId === 3)?.answer ||
      undefined,
    question4:
      onboardingData.questions?.find((item) => item.questionId === 4)?.answer ||
      undefined,
    question5:
      onboardingData.questions?.find((item) => item.questionId === 5)?.answer ||
      undefined,
    question6:
      onboardingData.questions?.find((item) => item.questionId === 6)?.answer ||
      undefined,
    question7:
      onboardingData.questions?.find((item) => item.questionId === 7)?.answer ||
      undefined,
    question8:
      onboardingData.questions?.find((item) => item.questionId === 8)?.answer ||
      undefined,
    routingNumber: onboardingData.routingNumber,
    state: onboardingData.state,
    taxId: onboardingData.taxId,
    taxIdType: onboardingData.taxIdType,
    website: onboardingData.website,
  });

  buildStakeHolders = (
    stakeholders: IStakeholdersPartials
  ): StakeHoldersFormData[] => {
    const mappedData: StakeHoldersFormData[] = stakeholders.stakeholders.map(
      (stake) => {
        const address = stakeholders.address.find(
          (add) => add.stakeholder === stake.id
        );
        return {
          id: stake.id || undefined,
          name: stake.name.split(' ')[0],
          lastName: stake.name.split(' ')[1],
          birthDate: DateTime.fromISO(stake.birth_date),
          citizenship: stake.citizenship,
          percentage: stake.percentage,
          title: stake.title,
          idType: stake.type_document,
          idNumber: stake.number_id,
          isIdFileFront: stake.file_front,
          idFileFront: undefined,
          isIdFileBack: stake.file_back,
          idFileBack: undefined,
          addressLine1: address?.address_line1 || '',
          addressLine2: address?.address_line2 || '',
          isResidenceFile: stake.residence_file,
          residenceFile: undefined,
          city: address?.city || '',
          state: address?.state || '',
          postCode: address?.post_code || '',
        } as unknown as StakeHoldersFormData;
      }
    );
    return mappedData;
  };

  getStakeholderDocumentType = (
    documents?: StakeHolderDocumentType
  ): StakeHolderDocumentType => {
    if (!documents) {
      return [];
    }
    const validMetadataIds = [
      OnboardingDocumentTypeIds.personalIdentification,
      OnboardingDocumentTypeIds.personalIdentificationBack,
      OnboardingUsaDocumentTypeIds.driversLicence,
      OnboardingUsaDocumentTypeIds.driversLicenceBack,
      OnboardingUsaDocumentTypeIds.passport,
      OnboardingUsaDocumentTypeIds.personalId,
      OnboardingUsaDocumentTypeIds.personalIdBack,
    ];
    const filteredDocument = documents.filter((doc) =>
      validMetadataIds.includes(doc.document.type.id)
    );
    return filteredDocument;
  };

  buildNewStakeHolders = (
    stakeholders: IStakeholderResponse
  ): MexicoStakeHoldersFormData[] => {
    const mappedData: MexicoStakeHoldersFormData[] =
      stakeholders.stakeholders.map((stake) => {
        const { address, documents } = stake;
        const documentType = this.getStakeholderDocumentType(documents)[0];
        return {
          id: stake.id || undefined,
          name: stake.name || '',
          lastName: stake.lastName || '',
          secondLastName: stake.secondLastName || '',
          birthDate: DateTime.fromISO(stake.birthDate).toFormat('yyyy-MM-dd'),
          citizenship: stake.citizenship,
          percentage: stake.percentage,
          title: stake.title,
          idType: documentType?.document?.type.name ?? '',
          idNumber: documentType?.document?.metaData?.number ?? '',
          effectiveAt: documentType?.document?.metaData?.effectiveAt ?? '',
          expiredAt: documentType?.document?.metaData?.expiredAt ?? '',
          addressLine1: address?.addressLine1 ?? '',
          addressLine2: address?.addressLine2 ?? '',
          city: address?.city ?? '',
          state: address?.state ?? '',
          postCode: address?.postCode ?? undefined,
          ountryBirthId: stake.countryBirthId,
          federalEntityId: stake.federalEntityId,
          curp: stake.curp,
          gender: stake.gender === 'F' ? 'Female' : 'Male',
          neighborhood: '',
          documents,
        } as unknown as MexicoStakeHoldersFormData;
      });
    return mappedData;
  };
}

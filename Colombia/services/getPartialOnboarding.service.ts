/* eslint-disable class-methods-use-this */
import { StakeHoldersFormData } from '@efex-services/client/types';
import {
  OnboardingDocumentTypeIds,
  OnboardingUsaDocumentTypeIds,
} from '@efex-services/documents/types';
import onboardingSvc from '@efex-services/onboarding';
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
    idNumber: onboardingData.idNumber || onboardingData.taxId || '',
    idType: onboardingData.idType || '',
    incorporation: DateTime.fromISO(onboardingData.incorporation),
    phoneNumber:
      onboardingData?.phoneNumberEnterprise ||
      onboardingData?.phoneNumber ||
      '',
    postCode: onboardingData.postCode,
    routingNumber: onboardingData.routingNumber,
    state: onboardingData.state,
    taxId: onboardingData.idNumber || onboardingData.taxId || '',
    website: onboardingData.website,
    isBankStatementUploaded: onboardingData.bankStatementFile,
    isCertificateUploaded: onboardingData.certificateFile,
    isConstitutionUploaded: onboardingData.constitutionFileFile,
    isIdFileBackUploaded: onboardingData.idFileBackFile,
    isIdFileFrontUploaded: onboardingData.idFileFrontFile,
    isResidenceUploaded: onboardingData.residenceFile,
    isSatUploaded: onboardingData.satFile,
    question1: onboardingData.question1 || undefined,
    question2: onboardingData.question2 || undefined,
    question3: onboardingData.question3 || undefined,
    question4: onboardingData.question4 || undefined,
    question5: onboardingData.question5 || undefined,
    question6: onboardingData.question6 || undefined,
    question7: onboardingData.question7 || undefined,
    question8: onboardingData.question8 || undefined,
  });

  getMxPostalCode = async (postalCode: number): Promise<IPostalCode | null> => {
    try {
      const postCodeSearched = await onboardingSvc.getPostalCodeById(
        postalCode
      );
      return postCodeSearched;
    } catch (error) {
      console.error(error);
      return Promise.resolve(null);
    }
  };

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
    const validMetadataIds = [
      OnboardingDocumentTypeIds.personalIdentification,
      OnboardingDocumentTypeIds.personalIdentificationBack,
      OnboardingUsaDocumentTypeIds.driversLicence,
      OnboardingUsaDocumentTypeIds.driversLicenceBack,
      OnboardingUsaDocumentTypeIds.passport,
      OnboardingUsaDocumentTypeIds.personalId,
      OnboardingUsaDocumentTypeIds.personalIdBack,
    ];
    const filteredDocument = documents?.filter((doc) =>
      validMetadataIds.includes(doc.document.type.id)
    );
    return filteredDocument || [];
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

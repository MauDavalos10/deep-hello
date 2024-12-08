/* eslint-disable class-methods-use-this */
import onboardingSvc from '@efex-services/onboarding';
import { IOnboardingPartials } from '@pages/onboarding/Colombia/types';
import { DateTime } from 'luxon';
import { IStakeholderResponse } from '@pages/onboarding/types/newStakeholderResponse';
import {
  OnboardingDocumentTypeIds,
  OnboardingUsaDocumentTypeIds,
} from '@efex-services/documents/types';
import type { FormDataFromPartial, IMexicoOnboardingPartials } from '../types';
import {
  IMexicoStakeholdersPartials,
  MexicoStakeHoldersFormData,
} from '../types/stakeholders.type';
import { documentTypeOptions, STAKEHOLDER_AGREEMENTS } from '../constants';

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
    idNumber: onboardingData.idNumber || '',
    idType: onboardingData.idType || '',
    incorporation: DateTime.fromISO(onboardingData.incorporation),
    phoneNumber:
      onboardingData?.phoneNumberEnterprise ||
      onboardingData?.phoneNumber ||
      '',
    postCode: onboardingData.postCode,
    routingNumber: onboardingData.routingNumber,
    state: onboardingData.state,
    taxId: onboardingData.taxId,
    website: onboardingData.website,
    isBankStatementUploaded: onboardingData.bankStatementFile,
    isCertificateUploaded: onboardingData.certificateFile,
    isConstitutionUploaded: onboardingData.constitutionFileFile,
    isIdFileBackUploaded: onboardingData.idFileBackFile,
    isIdFileFrontUploaded: onboardingData.idFileFrontFile,
    isResidenceUploaded: onboardingData.residenceFile,
    isSatUploaded: onboardingData.satFile,
  });

  getMxPostalCode = async (postalCode: number): Promise<IPostalCode | null> => {
    if (!postalCode) return Promise.resolve(null);
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

  buildFromMexicoPartials = async (
    values: IMexicoOnboardingPartials
  ): Promise<unknown> => {
    const postData = await this.getMxPostalCode(Number(values.postCode));
    return {
      accountCurrency: values.accountCurrency,
      accountNumber: values.accountNumber,
      accountType: values.accountType,
      addressLine: values.addressLine1,
      addressLine1: values.addressLine1,
      addressLine2: values.addressLine2,
      externalNumber: values.externalNumber,
      internalNumber: values.internalNumber,
      bankCode: values.bankCode,
      bankName: values.bankName,
      birthDate: DateTime.fromISO(values.birthDate),
      incorporation: DateTime.fromISO(values.incorporation),
      phoneNumber: values?.phoneNumberEnterprise || values?.phoneNumber || '',
      city: values.city || '',
      idNumber: values.idNumber,
      idType: values.idType,
      citizenship: values.citizenship,
      routingNumber: values.routingNumber,
      state: values.state || '',
      taxId: values.taxId || values.rfc,
      website: values.website,
      companySector: values.companySector,
      statements: values.statements,
      postData,
    };
  };

  buildStakeHolders = (
    stakeholders: IMexicoStakeholdersPartials
  ): MexicoStakeHoldersFormData[] => {
    const mappedData: MexicoStakeHoldersFormData[] =
      stakeholders.stakeholders.map((stake) => {
        const address = stakeholders.address.find(
          (add) => add.stakeholder === stake.id
        );
        return {
          id: stake.id || undefined,
          name: stake.name,
          lastName: stake.lastName,
          secondLastName: stake.secondLastName,
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
          postCode: address?.post_code || undefined,
          ountryBirthId: stake.countryBirthId,
          federalEntityId: stake.federalEntityId,
          curp: stake.curp,
          gender: stake.gender,
          neighborhood: stake.neighborhood,
        } as unknown as MexicoStakeHoldersFormData;
      });
    return mappedData;
  };

  getStakeholderDocumentType = (
    documents?: StakeHolderDocumentType
  ): StakeHolderDocumentType => {
    if (!documents) return [];
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

  getStakeholderIdType = (id: number): string => {
    const validTypeds = [
      OnboardingDocumentTypeIds.personalIdentification,
      OnboardingDocumentTypeIds.personalIdentificationBack,
    ];
    if (validTypeds.includes(id)) return documentTypeOptions[0].key;
    if (id === OnboardingUsaDocumentTypeIds.passport)
      return documentTypeOptions[1].value;
    return '';
  };

  buildNewStakeHolders = (
    stakeholders: IStakeholderResponse
  ): MexicoStakeHoldersFormData[] => {
    const mappedData: MexicoStakeHoldersFormData[] =
      stakeholders.stakeholders.map((stake) => {
        const { address, documents, agreements } = stake;
        const resourceAgreement = agreements?.find(
          (agreement) =>
            agreement.agreement.id === STAKEHOLDER_AGREEMENTS.RESOURCE
        );
        const representativeAgreement = agreements?.find(
          (agreement) =>
            agreement.agreement.id ===
            STAKEHOLDER_AGREEMENTS.LEGAL_REPRESENTATIVE
        );
        const documentType = this.getStakeholderDocumentType(documents)[0];
        return {
          id: stake.id || undefined,
          name: stake.name || '',
          lastName: stake.lastName || '',
          secondLastName: stake.secondLastName || '',
          birthDate: DateTime.fromISO(stake.birthDate).toFormat('yyyy-MM-dd'),
          businessSector: stake.businessSector || '',
          citizenship: stake.citizenship,
          countryBirthId: stake.citizenship,
          percentage: stake.percentage,
          title: stake.title,
          idType: documentType?.document.type.id
            ? this.getStakeholderIdType(documentType?.document.type.id)
            : '',
          idNumber: documentType?.document?.metaData?.number ?? '',
          addressLine1: address?.addressLine1 ?? address?.street ?? '',
          addressLine2: address?.addressLine2 ?? '',
          extNumber: address?.extNumber ?? '',
          intNumber: address?.intNumber ?? '',
          city: address?.city ?? '',
          state: address?.state ?? '',
          postCode: address?.postCode ?? undefined,
          postCodeId: address?.postalCodeId ?? undefined,
          nationalityPersonId: stake.nationalityPerson,
          federalEntityId: stake.federalEntityId,
          curp: stake.curp,
          gender: stake.gender === 'F' ? 'Female' : 'Male',
          neighborhood: '',
          documents,
          resourceFamilyStatament: resourceAgreement?.agreementValue || false,
          resourceFamilyStatamentResponse:
            resourceAgreement?.agreementDetail || '',
          legalRepresentativeStatament:
            representativeAgreement?.agreementValue || false,
          legalRepresentativeResponse:
            representativeAgreement?.agreementDetail || '',
        } as unknown as MexicoStakeHoldersFormData;
      });
    return mappedData;
  };
}

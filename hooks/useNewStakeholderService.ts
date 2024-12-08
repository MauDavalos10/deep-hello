import {
  ICreateStakeholderpayload,
  UploadStaStakeHolders,
} from '@efex-services/client/types';
import { IOnboardingDocuments } from '@efex-services/documents/documentsSvc';
import { DateTime } from 'luxon';
import { useState } from 'react';

const useNewStakeholderService = () => {
  const [metadata, setMetadata] = useState<Record<
    string,
    string | undefined
  > | null>(null);

  const generateStakeholderPayload = (
    stakeholder: UploadStaStakeHolders,
    documents: IOnboardingDocuments[]
  ): ICreateStakeholderpayload => {
    const documentIds = documents.map((doc) => doc.id);
    const {
      addressLine1,
      addressLine2,
      birthDate,
      citizenship,
      city,
      curp,
      businessSectorId,
      effectiveAt,
      expiredAt,
      federalEntityId,
      gender,
      idNumber,
      lastName,
      name,
      nationalityPersonId,
      neighborhood,
      percentage,
      postCode,
      postCodeId,
      secondLastName,
      state,
      title,
      legalRepresentativeStatament,
      legalRepresentativeResponse,
      resourceFamilyStatament,
      resourceFamilyStatamentResponse,
      extNumber,
      intNumber,
    } = stakeholder;
    setMetadata({
      effectiveAt,
      expiredAt,
      number: idNumber,
    });
    const address = {
      addressLine1,
      addressLine2,
      city,
      neighborhood,
      postCode,
      postCodeId,
      state,
      extNumber,
      intNumber,
    };

    const payload = {
      birthDate: DateTime.fromISO(birthDate || '').toFormat('yyyy-MM-dd'),
      citizenship,
      curp,
      federalEntityId,
      gender: gender === 'Female' ? 'F' : 'M',
      lastName,
      name,
      nationalityPersonId,
      percentage,
      secondLastName,
      title,
      documentIds,
      address,
      businessSectorId,
      legalRepresentativeStatament,
      legalRepresentativeResponse,
      resourceFamilyStatament,
      resourceFamilyStatamentResponse,
    };

    return payload;
  };

  return { metadata, generateStakeholderPayload };
};

export default useNewStakeholderService;

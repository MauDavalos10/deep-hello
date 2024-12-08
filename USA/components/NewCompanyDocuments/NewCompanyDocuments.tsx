/* eslint-disable @typescript-eslint/no-unused-vars */
import authSvc from '@efex-services/auth/authSvc';
import documentsSvc from '@efex-services/documents/documentsSvc';
import { OnboardingUsaDocumentTypeIds } from '@efex-services/documents/types';
import { FormControl, Grid, InputLabel, MenuItem, Select } from '@mui/material';
import BussinesNature from '@pages/onboarding/components/BussinesNature/BussinesNature';
import CompanyOperation from '@pages/onboarding/components/CompanyOperation/CompanyOperation';
import { selectBusiness } from '@pages/profile/store/selectors';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import {
  Control,
  Controller,
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
} from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useApiCall } from 'use-api-call';
import type { FormularyDataUSA } from '../../steps/CompanyDocumentation';

interface NewCompanyDocumentsProps {
  register: UseFormRegister<FormularyDataUSA>;
  setValue: UseFormSetValue<FormularyDataUSA>;
  errors: FieldErrors<FormularyDataUSA>;
  control: Control<FormularyDataUSA, any>;
}

const NewCompanyDocuments = ({
  register,
  errors,
  control,
}: NewCompanyDocumentsProps) => {
  const company = useSelector(selectBusiness);
  const [search, setSearch] = useState('');
  const [industryCodes, setIndustryCodes] = useState<Record<string, string>[]>(
    []
  );

  const requestIndsutryCodes = async () => {
    try {
      const result = await authSvc.getIndsutryCodes({ search });
      setIndustryCodes(result);
    } catch (err) {
      console.error(err);
    }
  };

  const [selectedCompanyDocument, setSelectedCompanyDocument] = useState<
    string | undefined
  >();

  useEffect(() => {
    requestIndsutryCodes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const {
    loading,
    data: uploadData,
    error,
    invoke: uploadDocuments,
  } = useApiCall(
    ({
      currentDocuments,
      name,
    }: {
      currentDocuments: File[];
      name: OnboardingUsaDocumentTypeIds;
    }) =>
      documentsSvc.uploadOnboardingDocument(
        company?.enterpriseId as unknown as number,
        {
          documentTypeId: OnboardingUsaDocumentTypeIds[
            name
          ] as unknown as OnboardingUsaDocumentTypeIds,
          totalDocuments: currentDocuments.length,
          documents: currentDocuments as unknown as FormData,
        }
      )
  );

  return (
    <Grid container xs={12} className="!my-[15px]" rowGap={2}>
      {industryCodes.length ? (
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel id="industryCode">
              {t('onbRegistryindustryCode')}
            </InputLabel>
            <Controller
              name="industryCode"
              control={control}
              render={({ field: { value } }) => (
                <Select
                  labelId="industryCode"
                  id="industryCode"
                  className="w-[90%]"
                  label={t('onbRegistryindustryCode')}
                  value={
                    value
                      ? industryCodes.find((code) => code.code === value)?.code
                      : ''
                  }
                  error={!!errors.industryCode}
                  {...register('industryCode', { required: true })}
                >
                  {industryCodes.map((code) => (
                    <MenuItem key={code.code} value={code.code}>
                      {industryCodes?.find((val) => val.code === value)?.value}
                      {t(code.name)}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
          </FormControl>
          {errors &&
            errors.industryCode &&
            errors.industryCode.type === 'required' && (
              <p className="text-orange-600 text-xs mt-1">
                {t('defaultError')}
              </p>
            )}
        </Grid>
      ) : null}
      <Grid item xs={12}>
        <BussinesNature />
        <CompanyOperation />
      </Grid>
    </Grid>
  );
};

export default NewCompanyDocuments;

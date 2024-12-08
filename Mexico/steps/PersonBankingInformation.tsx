/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-props-no-spreading */
import Button from '@efex-components/common/Button';
import DataLoadingWrapper from '@efex-components/common/DataLoadingWrapper';
import UploadFileInput from '@efex-components/common/Form/UploadFileInput';
import documentsSvc, {
  IOnboardingDocuments,
} from '@efex-services/documents/documentsSvc';
import { OnboardingDocumentTypeIds } from '@efex-services/documents/types';
import useBoolean from '@main-hooks/useBoolean';
import {
  Alert,
  FormControl,
  Grid,
  Link,
  TextField,
  Typography,
} from '@mui/material';
import { selectBusiness } from '@pages/profile/store/selectors';
import { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useApiCall } from 'use-api-call';
import { icon_check_circle_green } from '../../../../assets';
import { MX_DIGITS_CLABE } from '../constants';
import { useFormData } from '../context';

interface IPersonBankingInformation {
  nextFormStep: (data: any) => void;
  prevStep: () => void;
  loading: boolean;
  isDisabledEdit?: boolean;
}

export type PersonBankFormData = {
  bankName: string;
  accountNumber: string;
};

const PersonBankingInformation = ({
  nextFormStep,
  prevStep,
  loading,
  isDisabledEdit = false,
}: IPersonBankingInformation) => {
  const { t } = useTranslation();
  const company = useSelector(selectBusiness);
  const { setFormValues, data } = useFormData();
  const {
    onboardingDocuments,
    getOnboardingDocuments,
  }: {
    onboardingDocuments: IOnboardingDocuments[];
    getOnboardingDocuments: () => void;
  } = useFormData();

  const [canGoNext, { setFalse: goNetx, setTrue: cantGoNext }] =
    useBoolean(false);

  const {
    loading: loadingDocuments,
    data: uploadData,
    error: errorDocuments,
    invoke: uploadDocuments,
  } = useApiCall(
    ({
      currentDocuments,
      name,
    }: {
      currentDocuments: File[];
      name: OnboardingDocumentTypeIds;
    }) =>
      documentsSvc.uploadOnboardingDocument(
        company?.enterpriseId as unknown as number,
        {
          documentTypeId: OnboardingDocumentTypeIds[
            name
          ] as unknown as OnboardingDocumentTypeIds,
          totalDocuments: currentDocuments.length,
          documents: currentDocuments as unknown as FormData,
        }
      )
  );

  const {
    handleSubmit,
    formState: { errors },
    register,
    setValue,
    control,
  } = useForm<PersonBankFormData>({ mode: 'all' });

  const FieldsWatched = useWatch({
    control,
    name: ['bankName', 'accountNumber'],
  });

  const validateValueFromKeyboard = (e: any) => {
    if (e.key === 'e' || e.key === 'E' || e.key === '-' || e.key === '+') {
      e.preventDefault();
    }
  };

  const handleChangeFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    if (files && files.length) {
      const filesArray: File[] = [];
      // eslint-disable-next-line no-plusplus
      for (let index = 0; index <= files.length - 1; index++) {
        filesArray[index] = files.item(index) as File;
      }
      uploadDocuments({
        currentDocuments: filesArray,
        name: 'bankStatement',
      });
    }
  };

  const onSubmit = handleSubmit(async (values) => {
    setFormValues({ ...data, ...values, isLastStep: true });
    nextFormStep({ ...data, ...values, isLastStep: true });
  });

  const handleBack = () => {
    prevStep();
  };

  useEffect(() => {
    setValue('bankName', data.bankName || '');
    setValue('accountNumber', data.accountNumber || '');
  }, [data]);

  useEffect(() => {
    if (uploadData && !errorDocuments && !loadingDocuments) {
      getOnboardingDocuments();
    }
  }, [uploadData, errorDocuments, loadingDocuments]);

  useEffect(() => {
    if (
      onboardingDocuments?.length &&
      onboardingDocuments.filter(
        (doc) =>
          doc.document.type.id === OnboardingDocumentTypeIds.bankStatement
      ).length
    ) {
      goNetx();
    } else {
      cantGoNext();
    }
  }, [onboardingDocuments]);

  return (
    <>
      <Typography variant="h4" className="!font-medium">
        {t('onbAboutYourBanking')}
      </Typography>
      <Typography className="!leading-5 !mt-[10px] !mb-[20px]">
        {t('onbPlsEnterBankingInformation')}
      </Typography>

      <form onSubmit={onSubmit} autoComplete="off">
        <Grid rowSpacing={2} columnSpacing={{ xs: 2, sm: 2, md: 3 }}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <Typography variant="subtitle2">{t(`onbBankName`)}</Typography>
              <div className="flex w-full">
                <TextField
                  autoComplete="off"
                  type="text"
                  className="custom-textfield w-[90%]"
                  size="small"
                  placeholder={t(`onbBankName`) as string}
                  {...register('bankName', { required: true })}
                />
                {FieldsWatched[0] && FieldsWatched[0].length > 0 && (
                  <img
                    src={icon_check_circle_green}
                    alt=""
                    className="w-[25px] ml-[10px]"
                  />
                )}
              </div>
              {errors && errors.bankName && (
                <p className="text-orange-600 text-xs mt-1">
                  {t('defaultError')}
                </p>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} className="!my-[15px]">
            <FormControl fullWidth>
              <Typography variant="subtitle2">{t('accountClabe')}</Typography>
              <div className="flex w-full">
                <TextField
                  autoComplete="off"
                  type="number"
                  onKeyDown={(e) => validateValueFromKeyboard(e)}
                  className="custom-textfield w-[90%]"
                  size="small"
                  error={!!errors.accountNumber}
                  placeholder={t('accountClabe') as string}
                  {...register('accountNumber', {
                    required: true,
                    minLength: MX_DIGITS_CLABE,
                    maxLength: MX_DIGITS_CLABE,
                  })}
                />
                {FieldsWatched[1] && FieldsWatched[1].length > 0 && (
                  <img
                    src={icon_check_circle_green}
                    alt=""
                    className="w-[25px] ml-[20px] mr-[10px]"
                  />
                )}
              </div>
              {errors &&
                errors.accountNumber &&
                errors.accountNumber.type === 'required' && (
                  <p className="text-orange-600 text-xs mt-1">
                    {t('defaultError')}
                  </p>
                )}
              {errors &&
                errors.accountNumber &&
                errors.accountNumber.type === 'minLength' && (
                  <p className="text-orange-600 text-xs mt-1">
                    {t('clabeValidation')} ({MX_DIGITS_CLABE})
                  </p>
                )}
              {errors &&
                errors.accountNumber &&
                errors.accountNumber.type === 'maxLength' && (
                  <p className="text-orange-600 text-xs mt-1">
                    {t('clabeValidation')} ({MX_DIGITS_CLABE})
                  </p>
                )}
            </FormControl>
          </Grid>
          <Grid item xs={12} className="!mb-[15px]">
            <UploadFileInput
              onChange={handleChangeFile}
              onDelete={() => {}}
              title={t('onbBankStatementPerson') || ''}
              subTitle={t('onbOldDocument') || ''}
              classes="!mr-auto mx-[unset]"
              fullWidth
            />
          </Grid>
          {onboardingDocuments?.map((file) => {
            if (
              file.document.type.id === OnboardingDocumentTypeIds.bankStatement
            ) {
              return (
                <Link
                  key={file.id}
                  href={`${file.document.location}`}
                  variant="subtitle2"
                  className="!mx-auto !block text-center"
                  target="_blank"
                >
                  {file.document.type.name}
                </Link>
              );
            }
            return null;
          })}
        </Grid>
        <Grid item xs={12} className="flex justify-center gap-10">
          {!isDisabledEdit ? (
            <>
              <Button
                size="large"
                className="mt-2 text-[14px]"
                type="button"
                variant="secondary"
                onClick={handleBack}
              >
                {t('backBtn')}
              </Button>
              <DataLoadingWrapper loadingData={loading} variant="spinner">
                <Button
                  size="large"
                  className="mt-2 bg-[#006BF8] border-[#006BF8] text-[14px]"
                  type="submit"
                  disabled={canGoNext}
                >
                  {t('continue')}
                </Button>
              </DataLoadingWrapper>
            </>
          ) : (
            <Alert severity="info">{t('kybStepTwoTitle')}</Alert>
          )}
        </Grid>
      </form>
    </>
  );
};

export default PersonBankingInformation;

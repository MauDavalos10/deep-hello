/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-props-no-spreading */
import { Country } from '@configs/language';
import Button from '@efex-components/common/Button';
import UploadFileInput from '@efex-components/common/Form/UploadFileInput';
import documentsSvc, {
  IOnboardingDocuments,
} from '@efex-services/documents/documentsSvc';
import { OnboardingDocumentTypeIds } from '@efex-services/documents/types';
import AutorenewIcon from '@mui/icons-material/Autorenew';
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
import useBoolean from '../../../../hooks/useBoolean';
import { useFormData } from '../context';

interface IBankingInformation {
  countryOrigin: Country;
  isDisabledEdit?: boolean;
  loading?: boolean;
  nextFormStep: (data: any) => void;
  prevStep: () => void;
  onChangeOption: (value: boolean) => void;
}

type FormularyData = {
  accountNumber: string;
  bankName: string;
  bankStatement: File | undefined;
  routingNumber: string;
};

const BankingInformation = ({
  isDisabledEdit = false,
  loading,
  nextFormStep,
  prevStep,
  onChangeOption,
}: IBankingInformation) => {
  const { t } = useTranslation();
  const company = useSelector(selectBusiness);
  const { setFormValues, data } = useFormData();

  const {
    handleSubmit,
    formState: { errors },
    register,
    setValue,
    control,
  } = useForm<FormularyData>({ mode: 'all' });

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

  const FieldsWatched = useWatch({
    control,
    name: ['bankName', 'accountNumber', 'routingNumber'],
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
    const fixedValues = {
      ...data,
      ...values,
      isLastStep: false,
      isFirstAccount: false,
    };
    setFormValues(fixedValues);
    nextFormStep(fixedValues);
  });

  const handleBack = () => {
    prevStep();
  };

  useEffect(() => {
    setValue('bankName', data.bankName || '');
    setValue('accountNumber', data.accountNumber || '');
    setValue('routingNumber', data.routingNumber || '');
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
        {t('onbPlsEnterCompanyBankingInformation')}
      </Typography>

      <Button
        variant="link"
        className="mb-5"
        onClick={() => onChangeOption(true)}
      >
        {t('onbUserChangeBankOption')}
      </Button>

      <form onSubmit={onSubmit} autoComplete="off">
        <Grid rowSpacing={2} columnSpacing={{ xs: 2, sm: 2, md: 3 }}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <Typography variant="subtitle2">{t(`onbBankName`)}</Typography>
              <div className="flex w-full">
                <TextField
                  autoComplete="off"
                  type="text"
                  className="custom-textfield w-full max-w-[920px]"
                  size="small"
                  placeholder={t(`onbBankName`) as string}
                  {...register('bankName', { required: true })}
                />
                {FieldsWatched[0] && FieldsWatched[0].length > 0 ? (
                  <img
                    src={icon_check_circle_green}
                    alt=""
                    className="w-[25px] ml-[10px]"
                  />
                ) : (
                  <div className="!mr-[35px]" />
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
              <Typography variant="subtitle2">
                {t(`onbAccountNumber`)}
              </Typography>
              <div className="flex w-full">
                <TextField
                  autoComplete="off"
                  type="number"
                  onKeyDown={(e) => validateValueFromKeyboard(e)}
                  className="custom-textfield w-full max-w-[920px]"
                  size="small"
                  placeholder={t(`onbAccountNumber`) as string}
                  {...register('accountNumber', { required: true })}
                />
                {FieldsWatched[1] && FieldsWatched[1].length > 0 ? (
                  <img
                    src={icon_check_circle_green}
                    alt=""
                    className="w-[25px] ml-[20px] mr-[10px]"
                  />
                ) : (
                  <div className="!mr-[35px]" />
                )}
              </div>
              {errors && errors.accountNumber && (
                <p className="text-orange-600 text-xs mt-1">
                  {t('defaultError')}
                </p>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} className="!my-[15px]">
            <FormControl fullWidth>
              <Typography id="routingNumber">
                {t('onbRoutingNumber')}
              </Typography>
              <div className="flex w-full">
                <TextField
                  autoComplete="off"
                  type="number"
                  onKeyDown={(e) => validateValueFromKeyboard(e)}
                  className="custom-textfield w-full max-w-[920px]"
                  size="small"
                  placeholder={t(`onbRoutingNumber`) as string}
                  {...register('routingNumber', {
                    required: true,
                    minLength: 9,
                    maxLength: 9,
                  })}
                />
                {FieldsWatched[2] && FieldsWatched[2].length > 0 && (
                  <img
                    src={icon_check_circle_green}
                    alt=""
                    className="w-[25px] ml-[20px] mr-[10px]"
                  />
                )}
              </div>
              {errors &&
                errors.routingNumber &&
                errors.routingNumber.type === 'required' && (
                  <p className="text-orange-600 text-xs mt-1">
                    {t('defaultError')}
                  </p>
                )}
              {errors &&
                errors.routingNumber &&
                (errors.routingNumber.type === 'minLength' ||
                  errors.routingNumber.type === 'maxLength') && (
                  <p className="text-orange-600 text-xs mt-1">
                    {t('onbMaxDigits', { digits: 9 })}
                  </p>
                )}
              <Alert
                severity="info"
                className="my-2 text-left w-full  max-w-[920px]"
              >
                <p>{t(`routingNumberAlert`)}</p>
              </Alert>
            </FormControl>
          </Grid>
          <Grid item xs={12} className="!mb-[15px]">
            <UploadFileInput
              onChange={handleChangeFile}
              onDelete={() => {}}
              title={t('onbBankStatement') || ''}
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
        <Grid
          item
          xs={12}
          className="flex justify-center gap-10  max-w-[1000px]"
        >
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
              <Button
                size="large"
                className="mt-2 bg-[#006BF8] border-[#006BF8] text-[14px]"
                type="submit"
                disabled={canGoNext || loading}
                icon={
                  loading ? (
                    <AutorenewIcon className="animate-spin" />
                  ) : undefined
                }
              >
                {t('continue')}
              </Button>
            </>
          ) : (
            <Alert severity="info">{t('kybStepTwoTitle')}</Alert>
          )}
        </Grid>
      </form>
    </>
  );
};

export default BankingInformation;

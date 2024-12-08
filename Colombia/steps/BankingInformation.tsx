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
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { selectBusiness } from '@pages/profile/store/selectors';
import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useApiCall } from 'use-api-call';
import { icon_check_circle_green } from '../../../../assets';
import useBoolean from '../../../../hooks/useBoolean';
import authSvc from '../../../../services/auth/authSvc';
import { IBanks } from '../../../../services/auth/types';
import { useFormData } from '../context';

interface IBankingInformation {
  countryOrigin: Country;
  isDisabledEdit?: boolean;
  loading?: boolean;
  nextFormStep: (data: any) => void;
  prevStep: () => void;
}

type FormularyData = {
  accountNumber: string;
  accountType: string;
  bankCode: string;
  bankName: string;
  bankStatement: File | undefined;
};

const BankingInformation = ({
  isDisabledEdit = false,
  loading,
  nextFormStep,
  prevStep,
}: IBankingInformation) => {
  const { t } = useTranslation();
  const company = useSelector(selectBusiness);
  const { setFormValues, data } = useFormData();
  const [colombianBanks, setColombianBanks] = useState<null | IBanks[]>(null);

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

  const getBanks = async () => {
    try {
      const result = await authSvc.getBanks();
      setColombianBanks(result);
      const isBankSelected = data.bankCode
        ? result.find((bank: IBanks) => bank.code === data.bankCode)
        : result[0];
      setValue('bankName', isBankSelected?.name || '');
      setValue('bankCode', isBankSelected?.code || '');
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (event: {
    target: {
      name: string;
      value: string;
    };
  }) => {
    if (event.target.name === 'bankCode') {
      if (!colombianBanks) return;
      const bankName =
        (colombianBanks.find(
          (item) => item.code === (event.target.value as IBanks['code'])
        )?.name as string) ?? '';
      setValue('bankName', bankName);
    }
  };

  const FieldsWatched = useWatch({
    control,
    name: ['bankCode', 'accountNumber', 'accountType'],
  });

  const accountTypeOptions: { key: string; value: string }[] = [
    { value: '1', key: t('checkingsAccount') },
    { value: '2', key: t('savingsAccount') },
  ];

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
    setValue('bankCode', data.bankCode || '');
    setValue('bankName', data.bankName || '');
    setValue('accountNumber', data.accountNumber || '');
    setValue('accountType', data.accountType || '');
  }, [data]);

  useEffect(() => {
    getBanks();
  }, []);

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

      <form onSubmit={onSubmit} autoComplete="off">
        <Grid rowSpacing={2} columnSpacing={{ xs: 2, sm: 2, md: 3 }}>
          {colombianBanks ? (
            <Grid item xs={12}>
              <FormControl fullWidth>
                <Typography variant="subtitle2">{t(`bank`)}</Typography>
                <div className="flex w-full">
                  <Select
                    fullWidth
                    labelId="bankCode"
                    id="bankCode"
                    size="small"
                    className="custom-textfield w-full max-w-[920px]"
                    error={!!errors.bankCode}
                    defaultValue={data.bankCode || colombianBanks[0].code}
                    {...register('bankCode', { required: true })}
                    onChange={handleChange}
                  >
                    {colombianBanks?.map((bankCode) => (
                      <MenuItem key={bankCode.code} value={bankCode.code}>
                        {bankCode.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {FieldsWatched[0] && FieldsWatched[0].length > 0 ? (
                    <img
                      src={icon_check_circle_green}
                      alt=""
                      className="w-[25px] ml-[20px] mr-[10px]"
                    />
                  ) : (
                    <div className="!mr-[35px]" />
                  )}
                </div>
                {errors.bankCode && (
                  <p className="text-orange-600">{t('defaultError')}</p>
                )}
              </FormControl>
            </Grid>
          ) : null}
          <Grid item xs={12} className="!hidden">
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
              <Typography id="accountType">{t('accountType')}</Typography>
              <div className="flex w-full">
                <Select
                  fullWidth
                  {...register('accountType', { required: true })}
                  labelId="accountType"
                  name="accountType"
                  size="small"
                  className="custom-textfield w-full max-w-[920px]"
                  defaultValue={data.accountType ?? accountTypeOptions[0].value}
                  label={t('accountType')}
                >
                  {accountTypeOptions.map((accountType) => (
                    <MenuItem key={accountType.key} value={accountType.value}>
                      {accountType.key}
                    </MenuItem>
                  ))}
                </Select>
                {FieldsWatched[2] && FieldsWatched[2].length > 0 ? (
                  <img
                    src={icon_check_circle_green}
                    alt=""
                    className="w-[25px] ml-[20px] mr-[10px]"
                  />
                ) : (
                  <div className="!mr-[35px]" />
                )}
              </div>
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

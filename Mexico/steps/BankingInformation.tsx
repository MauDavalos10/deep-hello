/* eslint-disable react-hooks/exhaustive-deps */
import { Country } from '@configs/language';
import Button from '@efex-components/common/Button';
import FileInputV3 from '@efex-components/EfexDS/FileInput/FileInput';
import { dropdownOptionsCurrency } from '@efex-components/types';
import documentsSvc, {
  IOnboardingDocuments,
} from '@efex-services/documents/documentsSvc';
import { OnboardingDocumentTypeIds } from '@efex-services/documents/types';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import {
  Alert,
  FormControl,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { selectBusiness } from '@pages/profile/store/selectors';
import { useEffect } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useApiCall } from 'use-api-call';
import { icon_check_circle_green } from '../../../../assets';
import useBoolean from '../../../../hooks/useBoolean';
import { IUserType } from '../../../../services/auth/types';
import { useFormData } from '../context';

interface IBankingInformation {
  countryOrigin: Country;
  entityType: IUserType;
  isDisabledEdit?: boolean;
  loading?: boolean;
  nextFormStep: (data: any) => void;
  prevStep: () => void;
}

type FormularyData = {
  accountCurrency: string;
  accountNumber: string;
  accountType: string;
  bankName: string;
};

const BankingInformation = ({
  entityType,
  isDisabledEdit = false,
  loading,
  nextFormStep,
  prevStep,
}: IBankingInformation) => {
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
    loading: loadingDelete,
    data: dataDelete,
    error: errorDelete,
    invoke: deleteDocument,
  } = useApiCall(({ documentId }: { documentId: number }) =>
    documentsSvc.deleteOnboardingDocuments(
      company?.enterpriseId as unknown as number,
      documentId
    )
  );

  const {
    handleSubmit,
    formState: { errors },
    register,
    setValue,
    control,
  } = useForm<FormularyData>({ mode: 'all' });

  const FieldsWatched = useWatch({
    control,
    name: ['bankName', 'accountNumber', 'accountType'],
  });

  const uploadFilesFromEvent = (files: FileList, name: string) => {
    const filesArray: File[] = [];
    // eslint-disable-next-line no-plusplus
    for (let index = 0; index <= files.length - 1; index++) {
      filesArray[index] = files.item(index) as File;
    }
    uploadDocuments({
      currentDocuments: filesArray,
      name,
    });
  };

  const handleChangeFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files, name } = event.target;
    if (files && files.length) {
      uploadFilesFromEvent(files, name);
    }
  };

  const handleDropChangeFile = (files: FileList, name: string) => {
    if (files && files.length) {
      uploadFilesFromEvent(files, name);
    }
  };

  const handleDeleteFile = (id: string | number) => {
    deleteDocument({ documentId: id });
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
    setValue('accountCurrency', data.accountCurrency || '');
  }, [data]);

  useEffect(() => {
    if (uploadData && !errorDocuments && !loadingDocuments) {
      getOnboardingDocuments();
    }
  }, [uploadData, errorDocuments, loadingDocuments]);

  useEffect(() => {
    if (dataDelete && !errorDelete && !loadingDelete) {
      getOnboardingDocuments();
    }
  }, [dataDelete, errorDelete, loadingDelete]);

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
        {t(
          entityType === 'PERSON'
            ? 'onbPlsEnterBankingInformation'
            : 'onbPlsEnterCompanyBankingInformation'
        )}
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
            <FormControl className="w-full" fullWidth>
              <Typography variant="subtitle2">{t(`accountClabe`)}</Typography>
              <div className="flex w-full">
                <TextField
                  autoComplete="off"
                  type="number"
                  size="small"
                  placeholder={t('onbAccountNumber') as string}
                  inputProps={{
                    maxLength: 18,
                    pattern: '\\d{0,18}',
                    onInput: (e: React.FormEvent<HTMLInputElement>) => {
                      const input = e.currentTarget;
                      input.value = input.value.slice(0, 18);
                    },
                  }}
                  {...register('accountNumber', {
                    required: true,
                  })}
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
              <Typography>{t('ccAccountCurrencyType')}</Typography>
              <div className="flex w-full">
                <Controller
                  name="accountCurrency"
                  control={control}
                  defaultValue={dropdownOptionsCurrency[0].value}
                  render={({ field: { onChange, value } }) => (
                    <Select
                      labelId="accountCurrency"
                      id="accountCurrency"
                      defaultValue={dropdownOptionsCurrency[0].value}
                      label={t('ccAccountCurrencyType')}
                      value={value}
                      className="custom-textfield w-full max-w-[920px]"
                      onChange={onChange}
                      size="small"
                    >
                      {dropdownOptionsCurrency.map((currency) => (
                        <MenuItem key={currency.key} value={currency.value}>
                          {currency.key}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                {FieldsWatched[2] && FieldsWatched[2].length > 0 && (
                  <img
                    src={icon_check_circle_green}
                    alt=""
                    className="w-[25px] ml-[20px] mr-[10px]"
                  />
                )}
              </div>
            </FormControl>
          </Grid>
          <Grid item xs={12} className="!mb-[15px]">
            <FileInputV3
              documents={onboardingDocuments?.filter(
                (element) =>
                  element.document.type.id ===
                  OnboardingDocumentTypeIds.bankStatement
              )}
              onChange={handleChangeFile}
              onDropChange={handleDropChangeFile}
              onDelete={handleDeleteFile}
              inputName="bankStatement"
              title={t('onbBankStatement') as string}
              subTitle={t('onbOldDocument') as string}
              wrapperClasses="max-w-[97%]"
            />
          </Grid>
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

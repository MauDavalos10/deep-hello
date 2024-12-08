import useBoolean from '@main-hooks/useBoolean';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import {
  Alert,
  Checkbox,
  FormControl,
  FormHelperText,
  Grid,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  TextareaAutosize,
  Typography,
} from '@mui/material';

import Button from '@efex-components/common/Button';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useFormData } from '../context';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

interface IFinalQuestions {
  isDisabledEdit?: boolean;
  nextFormStep: (data: any) => void;
  prevStep: () => void;
}

interface FormData {
  question1: string;
  question2: string;
  question3: string[];
  question4: string[];
  question5: string;
  question6: string[];
}

const FinalQuestions = ({
  isDisabledEdit = false,
  prevStep,
  nextFormStep,
}: IFinalQuestions) => {
  const { t } = useTranslation();

  const [countriesSelected, setCountriesSelected] = useState<string[]>([]);
  const [productsSelected, setProductsSelected] = useState<string[]>([]);
  const [paymentsSelected, setPaymentsSelected] = useState<string[]>([]);
  const countries = [t('mexico'), t('usa'), t('col'), t('other')];
  const products = [
    t('onbProduct1'),
    t('onbProduct2'),
    t('onbProduct3'),
    t('onbProduct4'),
  ];
  const payments = [
    t('paymentOption1'),
    t('paymentOption2'),
    t('paymentOption3'),
    t('paymentOption4'),
    t('paymentOption5'),
    t('paymentOption6'),
    t('paymentOption7'),
    t('paymentOption8'),
    t('paymentOption9'),
    t('paymentOption10'),
  ];

  const [isSubmittingData, { setFalse: notSubmitting, setTrue: submitting }] =
    useBoolean(false);

  const { setFormValues, data } = useFormData();

  const {
    handleSubmit,
    formState: { errors },
    register,
    setValue,
  } = useForm<FormData>();

  const onSubmit = handleSubmit(async (values) => {
    const question3 = values.question3.join(',');
    const question4 = values.question4.join(',');
    const question6 = values.question6.join(',');
    const newData = {
      ...data,
      ...values,
      question3,
      question4,
      question6,
      isLastStep: true,
    };
    submitting();
    setFormValues(newData);
    nextFormStep(newData);
  });

  const handleBack = () => {
    prevStep();
  };

  const handleChange = (event: SelectChangeEvent<typeof countriesSelected>) => {
    const {
      target: { value },
    } = event;
    setCountriesSelected(typeof value === 'string' ? value.split(',') : value);
  };

  const handleProductChange = (
    event: SelectChangeEvent<typeof productsSelected>
  ) => {
    const {
      target: { value },
    } = event;
    setProductsSelected(typeof value === 'string' ? value.split(',') : value);
  };

  const handlePaymentChange = (
    event: SelectChangeEvent<typeof productsSelected>
  ) => {
    const {
      target: { value },
    } = event;
    setPaymentsSelected(typeof value === 'string' ? value.split(',') : value);
  };

  useEffect(() => {
    setValue('question1', data.question1 || '');
    setValue('question2', data.question2 || '');
    if (data.question3 && data.question3?.length > 0) {
      setValue('question3', data.question3?.split(',') || []);
      setProductsSelected(data.question3?.split(',') || []);
    }
    if (data.question4 && data.question4?.length > 0) {
      setValue('question4', data.question4?.split(',') || []);
      setCountriesSelected(data.question4?.split(',') || []);
    }
    setValue('question5', data.question5 || '');
    if (data.question6 && data.question6?.length > 0) {
      setValue('question6', data.question6?.split(',') || []);
      setPaymentsSelected(data.question6?.split(',') || []);
    }
  }, [data, setValue]);

  useEffect(
    () => () => {
      notSubmitting();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <>
      <Typography variant="h4" className="!font-medium">
        {t('onbFinalQuestions')}
      </Typography>

      <form onSubmit={onSubmit} autoComplete="off">
        <Grid rowSpacing={2} columnSpacing={{ xs: 2, sm: 2, md: 3 }}>
          <Grid item xs={12} className="!my-[15px]">
            <FormControl fullWidth>
              <Typography variant="subtitle2">
                {t(`onbFinalQuestions1`)}
              </Typography>
              <TextareaAutosize
                minRows={3}
                placeholder={t('onbFinalQuestions1Placeholder') as string}
                className={clsx(
                  'custom-textarea w-[90%] border border-solid border-gray-300 rounded-md p-2 text-base',
                  errors.question1 && 'border-red-500'
                )}
                {...register('question1', { required: true })}
              />
              {errors &&
                errors.question1 &&
                errors.question1.type === 'required' && (
                  <p className="text-orange-600 text-xs mt-1">
                    {t('defaultError')}
                  </p>
                )}
            </FormControl>
          </Grid>
          <Grid item xs={12} className="!my-[15px]">
            <FormControl fullWidth>
              <Typography variant="subtitle2">
                {t(`onbFinalQuestions2`)}
              </Typography>
              <TextareaAutosize
                minRows={3}
                placeholder={t('onbFinalQuestions2Placeholder') as string}
                className={clsx(
                  'custom-textarea w-[90%] border border-solid border-gray-300 rounded-md p-2 text-base',
                  errors.question2 && 'border-red-500'
                )}
                {...register('question2', { required: true })}
              />
              {errors &&
                errors.question2 &&
                errors.question2.type === 'required' && (
                  <p className="text-orange-600 text-xs mt-1">
                    {t('defaultError')}
                  </p>
                )}
            </FormControl>
          </Grid>
          <Grid item xs={12} className="!my-[15px]">
            <FormControl fullWidth>
              <Typography variant="subtitle2">
                {t(`onbFinalQuestions3`)}
              </Typography>
              <Select
                multiple
                value={productsSelected}
                input={<OutlinedInput label={t(`onbFinalQuestions3`)} />}
                renderValue={(selected) => selected.join(', ')}
                MenuProps={MenuProps}
                className={clsx(
                  'custom-textarea w-[90%] border border-solid border-gray-300 rounded-md p-2 text-base',
                  errors.question4 && 'border-red-500'
                )}
                {...register('question3', { required: true })}
                onChange={handleProductChange}
              >
                {products.map((product) => (
                  <MenuItem key={product} value={product}>
                    <Checkbox
                      checked={productsSelected.indexOf(product) > -1}
                    />
                    <ListItemText primary={product} />
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>{t('selectAllOptions')}</FormHelperText>
              {errors &&
                errors.question3 &&
                errors.question3.type === 'required' && (
                  <p className="text-orange-600 text-xs mt-1">
                    {t('defaultError')}
                  </p>
                )}
            </FormControl>
          </Grid>
          <Grid item xs={12} className="!my-[15px]">
            <FormControl fullWidth>
              <Typography variant="subtitle2">
                {t(`onbFinalQuestions4`)}
              </Typography>
              <Select
                multiple
                value={countriesSelected}
                input={<OutlinedInput label={t(`onbFinalQuestions4`)} />}
                renderValue={(selected) => selected.join(', ')}
                MenuProps={MenuProps}
                className={clsx(
                  'custom-textarea w-[90%] border border-solid border-gray-300 rounded-md p-2 text-base',
                  errors.question4 && 'border-red-500'
                )}
                {...register('question4', { required: true })}
                onChange={handleChange}
              >
                {countries.map((country) => (
                  <MenuItem key={country} value={country}>
                    <Checkbox
                      checked={countriesSelected.indexOf(country) > -1}
                    />
                    <ListItemText primary={country} />
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>{t('onbSelectAllCountries')}</FormHelperText>
              {errors &&
                errors.question4 &&
                errors.question4.type === 'required' && (
                  <p className="text-orange-600 text-xs mt-1">
                    {t('defaultError')}
                  </p>
                )}
            </FormControl>
          </Grid>
          <Grid item xs={12} className="!my-[15px]">
            <FormControl fullWidth>
              <Typography variant="subtitle2">
                {t(`onbFinalQuestions5`)}
              </Typography>
              <TextareaAutosize
                minRows={3}
                placeholder={t('onbFinalQuestions5Placeholder') as string}
                className={clsx(
                  'custom-textarea w-[90%] border border-solid border-gray-300 rounded-md p-2 text-base',
                  errors.question5 && 'border-red-500'
                )}
                {...register('question5', { required: true })}
              />
              {errors &&
                errors.question5 &&
                errors.question5.type === 'required' && (
                  <p className="text-orange-600 text-xs mt-1">
                    {t('defaultError')}
                  </p>
                )}
            </FormControl>
          </Grid>
          <Grid item xs={12} className="!my-[15px]">
            <FormControl fullWidth>
              <Typography variant="subtitle2">
                {t(`onbFinalQuestions6`)}
              </Typography>
              <Select
                multiple
                value={paymentsSelected}
                input={<OutlinedInput label={t(`onbFinalQuestions6`)} />}
                renderValue={(selected) => selected.join(', ')}
                MenuProps={MenuProps}
                className={clsx(
                  'custom-textarea w-[90%] border border-solid border-gray-300 rounded-md p-2 text-base',
                  errors.question4 && 'border-red-500'
                )}
                {...register('question6', { required: true })}
                onChange={handlePaymentChange}
              >
                {payments.map((payment) => (
                  <MenuItem key={payment} value={payment}>
                    <Checkbox
                      checked={paymentsSelected.indexOf(payment) > -1}
                    />
                    <ListItemText primary={payment} />
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>{t('selectAllOptions')}</FormHelperText>
              {errors &&
                errors.question6 &&
                errors.question6.type === 'required' && (
                  <p className="text-orange-600 text-xs mt-1">
                    {t('defaultError')}
                  </p>
                )}
            </FormControl>
          </Grid>
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
              <Button
                size="large"
                className="mt-2 bg-[#006BF8] border-[#006BF8] text-[14px]"
                type="submit"
                disabled={isSubmittingData}
                icon={
                  isSubmittingData ? (
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

export default FinalQuestions;

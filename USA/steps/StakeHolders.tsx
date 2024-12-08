/* eslint-disable react/no-array-index-key */
import Button from '@efex-components/common/Button';
import useStakeholderFileService from '@efex-components/EfexDS/FileInput/useStakeholderFileService';
import Autorenew from '@mui/icons-material/Autorenew';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import {
  Alert,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  Typography,
} from '@mui/material';
import useNewStakeholderService from '@pages/onboarding/hooks/useNewStakeholderService';
import { selectBusiness } from '@pages/profile/store/selectors';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useApiCall } from 'use-api-call';
import clientSvc from '../../../../services/client/clientSvc';
import {
  ICreateStakeholderV2,
  StakeHoldersFormData,
  UploadStaStakeHolders,
} from '../../../../services/client/types';
import { useFormData } from '../context';
import StakeHolderFormUSA from './usa/StakeHolder.Form';

interface IStakeHoldersForm {
  isDisabledEdit?: boolean;
  loading?: boolean;
  nextFormStep: (data: any) => void;
  prevStep: () => void;
}

const StakeHolders = ({
  isDisabledEdit = false,
  loading: loadingOnboarding,
  nextFormStep,
  prevStep,
}: IStakeHoldersForm) => {
  const { t } = useTranslation();
  const company = useSelector(selectBusiness);

  const [stakeHoldersConfirmed, setStakeHoldersConfirmed] =
    useState<boolean>(false);
  const { data, stkPartials, getStakeHolder } = useFormData();

  const {
    uploadedFiles,
    assignDocuments,
    handleChangeFile,
    handleDeleteFile,
    handleDropChangeFile,
  } = useStakeholderFileService({ getStakeHolder });

  const { metadata, generateStakeholderPayload } = useNewStakeholderService();

  const {
    data: createStakeHolderData,
    loading,
    error,
    invoke: createStakeHolder,
  } = useApiCall(({ enterpriseID, values }: ICreateStakeholderV2) =>
    clientSvc.createStakeHolderV2({ enterpriseID, values })
  );

  const {
    data: updateStakeHolderData,
    loading: loadingUpdate,
    error: errorUpdate,
    invoke: updateStakeHolderService,
  } = useApiCall((values: UploadStaStakeHolders) =>
    clientSvc.updateStakeHolder(values, company?.enterpriseId ?? '')
  );
  const {
    data: deleteStakeHolderData,
    loading: loadingDelete,
    error: errorDelete,
    invoke: deleteStakeHolder,
  } = useApiCall((id: string | number) => clientSvc.deleteStakeHolder(id));

  const [stakeHolders, setStakeHolders] = useState<StakeHoldersFormData[]>([]);

  const generateBackEndStakeholder = async (
    stakeHolderData: StakeHoldersFormData
  ) => {
    const { birthDate, ...rest } = stakeHolderData;
    const fixed: UploadStaStakeHolders = {
      birthDate: birthDate.toISODate() ?? undefined,
      ...rest,
    };
    try {
      const values = generateStakeholderPayload(fixed, uploadedFiles);
      await createStakeHolder({ enterpriseID: company?.enterpriseId, values });
      getStakeHolder();
      return true;
    } catch {
      return false;
    }
  };

  const onSubmit = async () => {
    nextFormStep({
      ...data,
      isLastStep: data?.countryOrigin !== 'USA',
      isStakeHolderDataConfirm:
        data?.countryOrigin === 'USA' ? stakeHoldersConfirmed : undefined,
    });
  };

  const handleBack = () => {
    prevStep();
  };

  const addNewStakeHolder = () => {
    const newData = [...stakeHolders, {} as StakeHoldersFormData];
    setStakeHolders(newData);
  };

  const updateStakeHolder = async (
    index: number,
    updates: StakeHoldersFormData
  ) => {
    const isExisting = (stkPartials as StakeHoldersFormData[]).find(
      (record) => record.id === index
    );
    if (isExisting) {
      const newValues = generateStakeholderPayload(
        updates as unknown as UploadStaStakeHolders,
        uploadedFiles
      );
      await updateStakeHolderService({
        ...newValues,
        id: updates.id,
      });
      getStakeHolder();
      return;
    }
    const newData = [...stakeHolders];
    const toUpdate = newData[index];
    newData[index] = { ...toUpdate, ...updates };
    await generateBackEndStakeholder(newData[index]);
  };

  const removeStakeHolder = async (index: number) => {
    const isExisting = (stkPartials as StakeHoldersFormData[]).find(
      (record) => record.id === index
    );
    if (isExisting) {
      await deleteStakeHolder(index);
      return;
    }
    const newData = [...stakeHolders];
    newData.splice(index, 1);
    setStakeHolders(newData);
  };

  useEffect(() => {
    if (stkPartials) {
      setStakeHolders([]);
      setTimeout(() => {
        setStakeHolders(stkPartials);
      }, 100);
    }
  }, [stkPartials]);

  useEffect(() => {
    if (error || errorUpdate || errorDelete || deleteStakeHolderData) {
      getStakeHolder();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, errorUpdate, errorDelete, deleteStakeHolderData]);

  useEffect(() => {
    if (
      createStakeHolderData ||
      updateStakeHolderData ||
      deleteStakeHolderData
    ) {
      assignDocuments(createStakeHolderData?.id as unknown as number, metadata);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createStakeHolderData, updateStakeHolderData, deleteStakeHolderData]);

  const renderForms = () =>
    stakeHolders.map((form, index) => {
      const formError = '';

      return (
        <div className="max-w-[1000px] mx-auto" key={index}>
          <StakeHolderFormUSA
            index={index}
            formError={formError}
            remove={removeStakeHolder}
            update={updateStakeHolder}
            handleChangeFile={handleChangeFile}
            handleDeleteFile={handleDeleteFile}
            handleDropChangeFile={handleDropChangeFile}
            uploadedFiles={uploadedFiles}
            data={form}
            loading={loading || loadingUpdate || loadingDelete}
            stakeholderId={form.id}
          />
        </div>
      );
    });

  return (
    <Grid container>
      <Grid item xs={12}>
        <div className="max-w-[1000px] mx-auto">
          <Typography variant="h4" className="text-left !font-medium">
            {t('onbStakeHoldersTitle')}
          </Typography>
          {!isDisabledEdit ? (
            <Button
              onClick={addNewStakeHolder}
              variant="secondary"
              className="ml-auto mb-3 mt-5"
              iconEnd={<PersonAddAltIcon />}
              disabled={stakeHolders.length >= 4}
            >
              {t('onbAdd')}
            </Button>
          ) : null}
          <Alert severity="info">{t('infoStakeholders')}</Alert>
          {error || errorUpdate || errorDelete ? (
            <Alert className="!my-5" severity="error">
              {t('onbStkCreateError')}
            </Alert>
          ) : null}
          {renderForms()}
        </div>
      </Grid>
      <Grid item xs={12} className="!my-5 !px-4">
        <FormControl fullWidth>
          <FormControlLabel
            control={
              <Checkbox
                checked={stakeHoldersConfirmed}
                onChange={(e) => setStakeHoldersConfirmed(e.target.checked)}
              />
            }
            label={t('onbStakeCheck')}
          />
        </FormControl>
      </Grid>

      <Grid item xs={12}>
        <div className="flex justify-around !mt-5 max-w-[1000px] mx-auto">
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
              {stakeHolders &&
                stakeHolders[0] &&
                stakeHolders[0].name &&
                stakeHolders[0].name?.length > 0 && (
                  <Button
                    size="large"
                    className="mt-2 bg-[#006BF8] border-[#006BF8] text-[14px]"
                    type="button"
                    onClick={onSubmit}
                    disabled={
                      !(
                        stakeHolders &&
                        stakeHolders[0] &&
                        stakeHolders[0].name &&
                        stakeHolders[0].name?.length > 0
                      ) ||
                      (data?.countryOrigin === 'USA' &&
                        !stakeHoldersConfirmed) ||
                      loadingOnboarding
                    }
                    icon={
                      !loadingOnboarding ? undefined : (
                        <Autorenew className="animate-spin" />
                      )
                    }
                  >
                    {t('continue')}
                  </Button>
                )}
            </>
          ) : (
            <Alert severity="info">{t('kybStepTwoTitle')}</Alert>
          )}
        </div>
      </Grid>
    </Grid>
  );
};

export default StakeHolders;

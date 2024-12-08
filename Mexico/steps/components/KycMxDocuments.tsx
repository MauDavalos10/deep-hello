/* eslint-disable react-hooks/exhaustive-deps */
import Button from '@efex-components/common/Button';
import FileInputV3 from '@efex-components/EfexDS/FileInput/FileInput';
import clientSvc from '@efex-services/client/clientSvc';
import documentsSvc, {
  IOnboardingDocuments,
} from '@efex-services/documents/documentsSvc';
import { OnboardingDocumentTypeIds } from '@efex-services/documents/types';
import useBoolean from '@main-hooks/useBoolean';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import { Grid, Typography } from '@mui/material';
import { MxOnboardingRequest } from '@pages/onboarding/Colombia/types';
import BussinesNature from '@pages/onboarding/components/BussinesNature/BussinesNature';
import CompanyOperation from '@pages/onboarding/components/CompanyOperation/CompanyOperation';
import {
  selectBusiness,
  selectProfileData,
} from '@pages/profile/store/selectors';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useApiCall } from 'use-api-call';
import { ENTITY_DOCUMENTS } from '../../constants/config';
import { useFormData } from '../../context';

interface KycMxDocumentsProps {
  nextFormStep: () => void;
}

const KycMxDocuments = ({ nextFormStep }: KycMxDocumentsProps) => {
  const { t } = useTranslation();
  const company = useSelector(selectBusiness);
  const userProfile = useSelector(selectProfileData);
  const {
    onboardingDocuments,
    getOnboardingDocuments,
  }: {
    onboardingDocuments: IOnboardingDocuments[];
    getOnboardingDocuments: () => void;
  } = useFormData();

  const [canGoNext, { setFalse: goNetx, setTrue: cantGoNext }] =
    useBoolean(false);

  const { data: completeMxKyc, invoke: completKycMx } = useApiCall(() =>
    clientSvc.onboardingMx(
      Number(company?.enterpriseId),
      {} as MxOnboardingRequest,
      'final'
    )
  );

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

  const handleConfirmMx = () => {
    completKycMx();
  };

  useEffect(() => {
    if (completeMxKyc) {
      nextFormStep();
    }
  }, [completeMxKyc]);

  useEffect(() => {
    if (uploadData && !error && !loading) {
      getOnboardingDocuments();
    }
  }, [uploadData, error, loading]);

  useEffect(() => {
    if (dataDelete && !errorDelete && !loadingDelete) {
      getOnboardingDocuments();
    }
  }, [dataDelete, errorDelete, loadingDelete]);

  useEffect(() => {
    const values = ENTITY_DOCUMENTS[userProfile?.userType || 'COMPANY'];
    if (onboardingDocuments?.length >= values.length) {
      goNetx();
    } else {
      cantGoNext();
    }
  }, [onboardingDocuments]);

  return (
    <>
      <Typography variant="h4" className="!font-medium">
        {t('onbCompanyDocumentationMex')}
      </Typography>
      <Typography className="!leading-5 !mt-[10px] !mb-[20px]">
        {t('onbCompanyDocumentationMexTitle')}
      </Typography>
      <Grid container xs={12} className="!mb-[15px]">
        {ENTITY_DOCUMENTS[userProfile?.userType || 'COMPANY'].map(
          (entityDocument) => (
            <Grid item xs={12} key={entityDocument.name}>
              <FileInputV3
                key={entityDocument.name}
                documents={onboardingDocuments?.filter(
                  (element) =>
                    element.document.type.id ===
                    OnboardingDocumentTypeIds[
                      entityDocument.name as keyof typeof OnboardingDocumentTypeIds
                    ]
                )}
                onChange={handleChangeFile}
                onDropChange={handleDropChangeFile}
                onDelete={handleDeleteFile}
                inputName={entityDocument.name}
                title={
                  t(
                    entityDocument.label || entityDocument.translation
                  ) as string
                }
                wrapperClasses="max-w-[500px]"
              />
            </Grid>
          )
        )}
      </Grid>
      <Grid item xs={12} className="!max-w-[500px]">
        <BussinesNature />
        <CompanyOperation />
      </Grid>
      <Grid item xs={12} className="flex justify-center gap-10  max-w-[1000px]">
        <Button
          size="large"
          className="mt-2 bg-[#006BF8] border-[#006BF8] text-[14px]"
          disabled={canGoNext || loading}
          icon={
            loading ? <AutorenewIcon className="animate-spin" /> : undefined
          }
          onClick={handleConfirmMx}
        >
          {t('continue')}
        </Button>
      </Grid>
    </>
  );
};

export default KycMxDocuments;

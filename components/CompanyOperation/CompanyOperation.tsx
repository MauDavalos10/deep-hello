import FileInputV3 from '@efex-components/EfexDS/FileInput/FileInput';
import useFileService from '@efex-components/EfexDS/FileInput/useFileService';
import { OnboardingDocumentTypeIds } from '@efex-services/documents/types';
import { Alert, AlertTitle, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

const CompanyOperation = () => {
  const { t } = useTranslation();
  const {
    onboardingDocuments,
    errorUploadDocuments: error,
    handleChangeFile,
    handleDeleteFile,
    handleDropChangeFile,
  } = useFileService();

  return (
    <>
      <Alert severity="info" variant="outlined">
        <AlertTitle>{t('operationRequirements')}</AlertTitle>
        <Typography variant="body2" className="!mb-2">
          {t('operationRequirementsMessage')}
        </Typography>
        <Typography component="p" variant="caption">
          {t('operationRequirementsOption1')}
        </Typography>
        <Typography component="p" variant="caption">
          {t('operationRequirementsOption2')}
        </Typography>
        <Typography component="p" variant="caption">
          {t('operationRequirementsOption3')}
        </Typography>
        <Typography component="p" variant="caption">
          {t('operationRequirementsOption4')}
        </Typography>
        <Typography component="p" variant="caption">
          {t('operationRequirementsOption5')}
        </Typography>
        <Typography component="p" variant="caption">
          {t('operationRequirementsOption6')}
        </Typography>
      </Alert>
      <FileInputV3
        inputName="companyOperation"
        onChange={handleChangeFile}
        onDropChange={handleDropChangeFile}
        onDelete={handleDeleteFile}
        error={error}
        documents={onboardingDocuments?.filter(
          (element) =>
            element.document.type.id ===
            OnboardingDocumentTypeIds.companyOperation
        )}
      />
    </>
  );
};

export default CompanyOperation;

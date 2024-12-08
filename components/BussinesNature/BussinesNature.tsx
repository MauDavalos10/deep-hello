import FileInputV3 from '@efex-components/EfexDS/FileInput/FileInput';
import useFileService from '@efex-components/EfexDS/FileInput/useFileService';
import { OnboardingDocumentTypeIds } from '@efex-services/documents/types';
import { Alert, AlertTitle, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

const BussinesNature = () => {
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
        <AlertTitle>{t('onbNatureOfBusiness')}</AlertTitle>
        <Typography variant="body2" className="!mb-2">
          {t('onbNatureOfBusinessSubtitle')}
        </Typography>
        <Typography component="p" variant="caption">
          {t('onbNatureOfBusinessOption1')}
        </Typography>
        <Typography component="p" variant="caption">
          {t('onbNatureOfBusinessOption2')}
        </Typography>
      </Alert>
      <FileInputV3
        inputName="businessNature"
        onChange={handleChangeFile}
        onDropChange={handleDropChangeFile}
        onDelete={handleDeleteFile}
        error={error}
        documents={onboardingDocuments?.filter(
          (element) =>
            element.document.type.id ===
            OnboardingDocumentTypeIds.businessNature
        )}
      />
    </>
  );
};

export default BussinesNature;

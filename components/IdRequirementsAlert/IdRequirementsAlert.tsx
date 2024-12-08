import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AlertTitle, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import {
  StyledAlert,
  StyledLink,
  StyledModal,
  ModalContent,
  CloseButton,
  RequirementText,
  ImageContainer,
} from './IdRequirementsAlert.styles';

const IdRequirementsAlert = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <>
      <StyledAlert severity="info" variant="outlined">
        <AlertTitle>
          {t('indivualIdRequirements')}:{' '}
          <StyledLink variant="body2" onClick={() => setOpen(true)}>
            {t('onbReviewExamples')}
          </StyledLink>
        </AlertTitle>
      </StyledAlert>

      <StyledModal open={open} onClose={() => setOpen(false)}>
        <ModalContent>
          <CloseButton onClick={() => setOpen(false)}>
            <CloseIcon />
          </CloseButton>

          <RequirementText>
            <Typography>{t('individualIdLegible')}:</Typography>
            <Typography
              component="span"
              variant="caption"
              color="text.secondary"
            >
              {t('individualIdLegibleMessage')}
            </Typography>
          </RequirementText>

          <RequirementText>
            <Typography>{t('individualIdComplete')}:</Typography>
            <Typography
              component="span"
              variant="caption"
              color="text.secondary"
            >
              {t('individualIdCompleteMessage')}
            </Typography>
          </RequirementText>

          <RequirementText>
            <Typography>{t('individualIdObstacles')}:</Typography>
            <Typography
              component="span"
              variant="caption"
              color="text.secondary"
            >
              {t('individualIdObstaclesMessage')}
            </Typography>
          </RequirementText>

          <ImageContainer>
            <Typography variant="subtitle2" className="title">
              {t('onbPassportExample')}
            </Typography>
            <img
              src="/src/assets/images/example_passport.svg"
              alt="Example passport"
            />
          </ImageContainer>

          <ImageContainer>
            <Typography variant="subtitle2" className="title">
              {t('onbDriverLicense')}
            </Typography>
            <img
              src="/src/assets/images/example_drivers_licence_personal_id.svg"
              alt="Example driver's license"
            />
          </ImageContainer>
        </ModalContent>
      </StyledModal>
    </>
  );
};

export default IdRequirementsAlert;

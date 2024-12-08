/* eslint-disable @typescript-eslint/no-unused-vars */
import { Step, StepButton, Stepper } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ONBOARDING_MEXICO_FORM_STEPS } from '../constants';

interface ISideBar {
  steps: string[];
  currentStep: number;
  isKyc?: boolean;
  setFormStep: (value: number) => void;
}

const SideBar = ({ steps, currentStep, isKyc, setFormStep }: ISideBar) => {
  const { t } = useTranslation();

  const handleStep = (step: number) => () => {
    setFormStep(step);
  };

  if (!steps.length) return null;

  return (
    <div className="flex flex-col gap-0 h-full">
      <div className="grid grid-flow-row md:grid-flow-col gap-0 h-full">
        <div className="bg-[#006BF8] text-[#FFFFFF] md:col-span-1 py-[40px] lg:pt-[80px] px-[20px] lg:px-[40px]">
          <div className="">
            <div className="text-[32px] font-medium text-[#FFFFFF]">
              {currentStep !==
              ONBOARDING_MEXICO_FORM_STEPS.ONBOARDING_CONFIRMATION
                ? currentStep + 1
                : steps.length}{' '}
              <span className="text-[#AFCDFB]">/ {steps.length}</span>
            </div>
            <Stepper
              activeStep={currentStep}
              nonLinear
              orientation="vertical"
              className="mt-[30px]"
              sx={{
                justifyContent: steps.length > 1 ? 'left' : ' center',
                '.MuiStepConnector-line': {
                  display: 'none',
                  borderColor: '#E8F3FF',
                  borderWidth: '0',
                },
                'svg.Mui-active': {
                  color: '#FFFFFF',
                },
                'svg:not(.Mui-active)': {
                  color: 'transparent',
                  borderColor: '#FFFFFF',
                  borderWidth: '1px',
                  borderRadius: '20px',
                },
                'svg.Mui-completed': {
                  color: '#FFFFFF',
                  borderColor: '#FFFFFF',
                  borderWidth: '0',
                  borderRadius: '20px',
                },
                '.MuiStepIcon-text': {
                  fill: 'transparent',
                },
                '.MuiStepLabel-label': {
                  color: '#FFFFFF',
                  fontWeight: '100',
                },
                '.MuiStepLabel-label.Mui-completed': {
                  color: '#FFFFFF',
                  fontWeight: '300',
                },
                '.MuiStepLabel-label.Mui-active ': {
                  color: '#FFFFFF',
                  fontWeight: '500',
                },
              }}
            >
              {steps.map((label, index) => (
                <Step key={label}>
                  <StepButton
                    disabled={isKyc}
                    color="inherit"
                    onClick={handleStep(index)}
                  >
                    {label}
                  </StepButton>
                </Step>
              ))}
              <Step>
                <StepButton
                  color="inherit"
                  onClick={handleStep(
                    ONBOARDING_MEXICO_FORM_STEPS.ONBOARDING_CONFIRMATION
                  )}
                >
                  {t('kybStepTwoTitle')}
                </StepButton>
              </Step>
            </Stepper>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SideBar;

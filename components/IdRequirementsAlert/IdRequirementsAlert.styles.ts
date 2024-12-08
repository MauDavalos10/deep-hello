import {
  styled,
  Alert,
  Box,
  IconButton,
  Modal,
  Typography,
} from '@mui/material';

export const StyledAlert = styled(Alert)(({ theme }) => ({
  marginLeft: theme.spacing(2),
  '& .MuiAlertTitle-root': {
    display: 'flex',
    gap: theme.spacing(1),
    alignItems: 'center',
    marginBottom: 0,
  },
}));

export const StyledLink = styled(Typography)(() => ({
  cursor: 'pointer',
  textDecoration: 'underline',
  '&:hover': {
    opacity: 0.8,
  },
}));

export const StyledModal = styled(Modal)(() => ({
  '& .MuiBackdrop-root': {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
}));

export const ModalContent = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[24],
  padding: theme.spacing(6),
  width: 500,
  maxHeight: '90vh',
  overflow: 'auto',
  borderRadius: theme.shape.borderRadius,
}));

export const CloseButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  right: theme.spacing(1),
  top: theme.spacing(1),
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

export const RequirementText = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '120px 1fr',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(2),
  '& .label': {
    fontWeight: 500,
    fontSize: '0.875rem',
  },
}));

export const ImageContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(3),
  '& img': {
    width: '100%',
    height: 'auto',
    borderRadius: theme.shape.borderRadius,
    border: `1px solid ${theme.palette.divider}`,
  },
  '& .title': {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
    fontWeight: 500,
  },
}));

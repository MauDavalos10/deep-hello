/* eslint-disable class-methods-use-this */
import {
  FormData as OnboardingFormData,
  UsaAccount,
  UsaDocument,
  UsaEfexAccount,
  UsaQuestions,
} from '../types';

export default class ConvertFormToRequest {
  getDocumentsStage(data: OnboardingFormData): UsaDocument {
    const {
      companyDocumentType,
      addressLine1,
      addressLine2,
      incorporation,
      taxId,
      taxIdType,
      postCode,
      phoneNumber,
      city,
      state,
      website,
      gender,
      number,
      industryCode,
    } = data;
    return {
      companyDocumentType,
      phoneNumber: phoneNumber || '',
      postCode: postCode || '',
      incorporation: incorporation?.toISODate() || '',
      taxId: taxId || '',
      website: website || '',
      state: state || '',
      city: city || '',
      addressLine1: addressLine1 || '',
      addressLine2: addressLine2 || '',
      number,
      gender: gender || '',
      industryCode,
      taxIdType,
    };
  }

  getAccountStage(data: OnboardingFormData): UsaAccount | UsaEfexAccount {
    const { accountNumber, bankName, routingNumber, isFirstAccount } = data;
    if (isFirstAccount) {
      return {
        isFirstAccount,
      };
    }
    return {
      bankName,
      accountNumber,
      routingNumber,
    };
  }

  getQuestionsStage(data: OnboardingFormData): UsaQuestions {
    const { question1, question2, question3, question4, question5, question6 } =
      data;
    return {
      question1: question1 || '',
      question2: question2 || '',
      question3: question3 || '',
      question4: question4 || '',
      question5: question5 || '',
      question6: question6 || '',
    };
  }
}

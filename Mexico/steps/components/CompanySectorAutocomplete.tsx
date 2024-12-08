/* eslint-disable react-hooks/exhaustive-deps */
import AutomCompleteBar from '@efex-components/searchBar/AutoCompleteBar';
import onboardingSvc from '@efex-services/onboarding';
import useBoolean from '@main-hooks/useBoolean';
import useDebounce from '@main-hooks/useDebounce';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApiCall } from 'use-api-call';

interface CompanySectorAutocompleteProps {
  className?: string;
  data: any;
  selectedValue: ICompanySector | null | undefined;
  showCompanySectorError?: boolean;
  onSelectCompanySector: (companySector?: ICompanySector) => void;
}

const CompanySectorAutocomplete = ({
  className,
  data,
  selectedValue,
  showCompanySectorError = false,
  onSelectCompanySector,
}: CompanySectorAutocompleteProps) => {
  const { t } = useTranslation();
  const [displayData, setDisplayData] = useState<ICompanySector[]>([]);
  const [searchCriteria, setSearchCriteria] = useState<string>('');
  const [inputValue, setInputValue] = useState<string>('');
  const debouncedSearchCriteria = useDebounce<string>(searchCriteria);
  const [isEmptyValue, { setTrue: isEmpty, setFalse: isNotEmpty }] =
    useBoolean(false);

  const { companySector: prefilledCompanySector, businessSector } = data;

  const {
    loading,
    data: companySector,
    invoke: getCompanySector,
  } = useApiCall((search: string) =>
    onboardingSvc.getCompanySector({
      searchCriteria: search,
    })
  );

  const handleChange = (_: any, companySectorOption: ICompanySector) => {
    if (!companySectorOption) return;
    const currentClient = displayData.find(
      (option) => option.id === companySectorOption.id
    );
    if (currentClient) {
      onSelectCompanySector(currentClient);
    }
  };

  const handleChangeCapture = async (event: any) => {
    setInputValue(event.target.value);
    const { value } = event.target;
    if (value.length >= 2) {
      setSearchCriteria(value);
    } else {
      onSelectCompanySector(undefined);
    }
  };

  const validateValue = () => {
    if (!selectedValue?.id) {
      isEmpty();
    } else {
      isNotEmpty();
    }
  };

  const searchData = async (search: string) => {
    if (search.length) {
      getCompanySector(search);
    } else {
      setDisplayData([]);
    }
  };

  useEffect(() => {
    searchData(debouncedSearchCriteria);
  }, [debouncedSearchCriteria]);

  useEffect(() => {
    if (companySector) {
      setDisplayData(companySector);
    }
  }, [companySector]);

  useEffect(() => {
    if (prefilledCompanySector?.economicActivity) {
      setInputValue(prefilledCompanySector.economicActivity);
    }
  }, [prefilledCompanySector]);

  useEffect(() => {
    if (businessSector?.name) {
      setInputValue(businessSector.name);
    }
  }, [businessSector]);

  useEffect(() => {
    if (showCompanySectorError) {
      isEmpty();
    } else {
      isNotEmpty();
    }
  }, [showCompanySectorError]);

  return (
    <AutomCompleteBar
      error={isEmptyValue}
      loading={loading}
      data={displayData}
      className={clsx(className, 'mb-2 !text-sm !rounded-md')}
      inputClassName="!rounded-md border-slate-300 hover:border-black focus:border-black"
      onGetOptionLabel={(companySectorOption: ICompanySector) =>
        companySectorOption.economicActivity
      }
      renderOption={(companySectorOption: ICompanySector) => (
        <div className="flex space-x-2 items-center w-full">
          <p>
            {companySectorOption.economicActivityKey} -{' '}
            {companySectorOption.economicActivity}
          </p>
        </div>
      )}
      inputParams={(params) => {
        if (params.inputProps?.value) {
          setInputValue(params.inputProps?.value as string);
        }

        return {
          value: inputValue,
          placeholder: 'Sector empresarial',
        };
      }}
      onChange={handleChange}
      onChangeCapture={handleChangeCapture}
      onInputChange={handleChange}
      onBlur={validateValue}
      emptyState={
        <div className="text-center">
          <SearchOffIcon sx={{ width: 50, height: 50 }} />
          <p className="text-sm m-0">{t('textSearchNotFound')}</p>
        </div>
      }
    />
  );
};

export default CompanySectorAutocomplete;

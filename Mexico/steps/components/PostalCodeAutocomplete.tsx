/* eslint-disable react-hooks/exhaustive-deps */
import SearchOffIcon from '@mui/icons-material/SearchOff';
import AutomCompleteBar from '@efex-components/searchBar/AutoCompleteBar';
import onboardingSvc from '@efex-services/onboarding';
import useDebounce from '@main-hooks/useDebounce';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApiCall } from 'use-api-call';

interface PostalCodeAutocompleteProps {
  className?: string;
  defaultPostCode?: string;
  onSelectPostalCode: (postalCode?: IPostalCode) => void;
}

const PostalCodeAutocomplete = ({
  className,
  defaultPostCode,
  onSelectPostalCode,
}: PostalCodeAutocompleteProps) => {
  const { t } = useTranslation();
  const [displayData, setDisplayData] = useState<IPostalCode[]>([]);
  const [searchCriteria, setSearchCriteria] = useState<string>('');
  const debouncedSearchCriteria = useDebounce<string>(searchCriteria);

  const {
    loading,
    data: postalCodes,
    invoke: getPostalCodes,
  } = useApiCall((search: string) =>
    onboardingSvc.getPostalCode({
      searchCriteria: search,
    })
  );

  const handleChange = (_: any, postalCodeOption: IPostalCode) => {
    if (!postalCodeOption) return;
    const currentClient = displayData.find(
      (option) => option.id === postalCodeOption.id
    );
    if (currentClient) {
      onSelectPostalCode(currentClient);
    }
  };

  const handleChangeCapture = async (event: any) => {
    const { value } = event.target;
    if (value.length >= 2) {
      setSearchCriteria(value);
    } else {
      onSelectPostalCode(undefined);
    }
  };

  const searchData = async (data: string) => {
    if (data.length) {
      getPostalCodes(data);
    } else {
      setDisplayData([]);
    }
  };

  useEffect(() => {
    searchData(searchCriteria);
  }, [debouncedSearchCriteria]);

  useEffect(() => {
    if (postalCodes) {
      setDisplayData(postalCodes);
    }
  }, [postalCodes]);

  return (
    <AutomCompleteBar
      loading={loading}
      data={displayData}
      className={clsx(className, 'mb-2 !text-sm !rounded-md')}
      inputClassName="!rounded-md border-slate-300 hover:border-black focus:border-black"
      onGetOptionLabel={(postalCodeOption: IPostalCode) =>
        postalCodeOption?.postalCode
      }
      renderOption={(postalCodeOption: IPostalCode) => (
        <div className="flex space-x-2 items-center w-full">
          <p>
            {postalCodeOption?.postalCode} -{' '}
            {postalCodeOption?.neighborhood?.description}
          </p>
        </div>
      )}
      inputParams={(params) => {
        const value = defaultPostCode ?? (params.inputProps?.value as string);

        return {
          value,
          placeholder: t('postCode'),
        };
      }}
      onChange={handleChange}
      onChangeCapture={handleChangeCapture}
      onInputChange={handleChange}
      emptyState={
        <div className="text-center">
          <SearchOffIcon sx={{ width: 50, height: 50 }} />
          <p className="text-sm m-0">{t('textSearchNotFound')}</p>
        </div>
      }
    />
  );
};

export default PostalCodeAutocomplete;

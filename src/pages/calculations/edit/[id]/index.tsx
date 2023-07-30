import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  Flex,
  Center,
} from '@chakra-ui/react';
import Breadcrumbs from 'components/breadcrumb';
import DatePicker from 'components/date-picker';
import { Error } from 'components/error';
import { FormWrapper } from 'components/form-wrapper';
import { NumberInput } from 'components/number-input';
import { SelectInput } from 'components/select-input';
import { AsyncSelect } from 'components/async-select';
import { TextInput } from 'components/text-input';
import AppLayout from 'layout/app-layout';
import { FormikHelpers, useFormik } from 'formik';
import { useRouter } from 'next/router';
import { FunctionComponent, useState, useRef } from 'react';
import * as yup from 'yup';
import useSWR from 'swr';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { ImagePicker } from 'components/image-file-picker';
import { getCalculationById, updateCalculationById } from 'apiSdk/calculations';
import { calculationValidationSchema } from 'validationSchema/calculations';
import { CalculationInterface } from 'interfaces/calculation';
import { MathToolInterface } from 'interfaces/math-tool';
import { UserInterface } from 'interfaces/user';
import { getMathTools } from 'apiSdk/math-tools';
import { getUsers } from 'apiSdk/users';

function CalculationEditPage() {
  const router = useRouter();
  const id = router.query.id as string;

  const { data, error, isLoading, mutate } = useSWR<CalculationInterface>(
    () => (id ? `/calculations/${id}` : null),
    () => getCalculationById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: CalculationInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateCalculationById(id, values);
      mutate(updated);
      resetForm();
      router.push('/calculations');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<CalculationInterface>({
    initialValues: data,
    validationSchema: calculationValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout
      breadcrumbs={
        <Breadcrumbs
          items={[
            {
              label: 'Calculations',
              link: '/calculations',
            },
            {
              label: 'Update Calculation',
              isCurrent: true,
            },
          ]}
        />
      }
    >
      <Box rounded="md">
        <Box mb={4}>
          <Text as="h1" fontSize={{ base: '1.5rem', md: '1.875rem' }} fontWeight="bold" color="base.content">
            Update Calculation
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}

        <FormWrapper onSubmit={formik.handleSubmit}>
          <NumberInput
            label="Result"
            formControlProps={{
              id: 'result',
              isInvalid: !!formik.errors?.result,
            }}
            name="result"
            error={formik.errors?.result}
            value={formik.values?.result}
            onChange={(valueString, valueNumber) =>
              formik.setFieldValue('result', Number.isNaN(valueNumber) ? 0 : valueNumber)
            }
          />

          <AsyncSelect<MathToolInterface>
            formik={formik}
            name={'math_tool_id'}
            label={'Select Math Tool'}
            placeholder={'Select Math Tool'}
            fetcher={getMathTools}
            labelField={'name'}
          />
          <AsyncSelect<UserInterface>
            formik={formik}
            name={'user_id'}
            label={'Select User'}
            placeholder={'Select User'}
            fetcher={getUsers}
            labelField={'email'}
          />
          <Flex justifyContent={'flex-start'}>
            <Button
              isDisabled={formik?.isSubmitting}
              bg="state.info.main"
              color="base.100"
              type="submit"
              display="flex"
              height="2.5rem"
              padding="0rem 1rem"
              justifyContent="center"
              alignItems="center"
              gap="0.5rem"
              mr="4"
              _hover={{
                bg: 'state.info.main',
                color: 'base.100',
              }}
            >
              Submit
            </Button>
            <Button
              bg="neutral.transparent"
              color="neutral.main"
              type="button"
              display="flex"
              height="2.5rem"
              padding="0rem 1rem"
              justifyContent="center"
              alignItems="center"
              gap="0.5rem"
              mr="4"
              onClick={() => router.push('/calculations')}
              _hover={{
                bg: 'neutral.transparent',
                color: 'neutral.main',
              }}
            >
              Cancel
            </Button>
          </Flex>
        </FormWrapper>
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'calculation',
    operation: AccessOperationEnum.UPDATE,
  }),
)(CalculationEditPage);

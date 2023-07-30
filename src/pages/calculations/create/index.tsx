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
import { FunctionComponent, useState } from 'react';
import * as yup from 'yup';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';

import { createCalculation } from 'apiSdk/calculations';
import { calculationValidationSchema } from 'validationSchema/calculations';
import { MathToolInterface } from 'interfaces/math-tool';
import { UserInterface } from 'interfaces/user';
import { getMathTools } from 'apiSdk/math-tools';
import { getUsers } from 'apiSdk/users';
import { CalculationInterface } from 'interfaces/calculation';

function CalculationCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: CalculationInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createCalculation(values);
      resetForm();
      router.push('/calculations');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<CalculationInterface>({
    initialValues: {
      result: 0,
      math_tool_id: (router.query.math_tool_id as string) ?? null,
      user_id: (router.query.user_id as string) ?? null,
    },
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
              label: 'Create Calculation',
              isCurrent: true,
            },
          ]}
        />
      }
    >
      <Box rounded="md">
        <Box mb={4}>
          <Text as="h1" fontSize={{ base: '1.5rem', md: '1.875rem' }} fontWeight="bold" color="base.content">
            Create Calculation
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
    operation: AccessOperationEnum.CREATE,
  }),
)(CalculationCreatePage);

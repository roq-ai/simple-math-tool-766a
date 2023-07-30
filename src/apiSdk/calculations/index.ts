import axios from 'axios';
import queryString from 'query-string';
import { CalculationInterface, CalculationGetQueryInterface } from 'interfaces/calculation';
import { GetQueryInterface, PaginatedInterface } from '../../interfaces';

export const getCalculations = async (
  query?: CalculationGetQueryInterface,
): Promise<PaginatedInterface<CalculationInterface>> => {
  const response = await axios.get('/api/calculations', {
    params: query,
    headers: { 'Content-Type': 'application/json' },
  });
  return response.data;
};

export const createCalculation = async (calculation: CalculationInterface) => {
  const response = await axios.post('/api/calculations', calculation);
  return response.data;
};

export const updateCalculationById = async (id: string, calculation: CalculationInterface) => {
  const response = await axios.put(`/api/calculations/${id}`, calculation);
  return response.data;
};

export const getCalculationById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/calculations/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteCalculationById = async (id: string) => {
  const response = await axios.delete(`/api/calculations/${id}`);
  return response.data;
};

import axios from 'axios';
import queryString from 'query-string';
import { MathToolInterface, MathToolGetQueryInterface } from 'interfaces/math-tool';
import { GetQueryInterface, PaginatedInterface } from '../../interfaces';

export const getMathTools = async (
  query?: MathToolGetQueryInterface,
): Promise<PaginatedInterface<MathToolInterface>> => {
  const response = await axios.get('/api/math-tools', {
    params: query,
    headers: { 'Content-Type': 'application/json' },
  });
  return response.data;
};

export const createMathTool = async (mathTool: MathToolInterface) => {
  const response = await axios.post('/api/math-tools', mathTool);
  return response.data;
};

export const updateMathToolById = async (id: string, mathTool: MathToolInterface) => {
  const response = await axios.put(`/api/math-tools/${id}`, mathTool);
  return response.data;
};

export const getMathToolById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/math-tools/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteMathToolById = async (id: string) => {
  const response = await axios.delete(`/api/math-tools/${id}`);
  return response.data;
};

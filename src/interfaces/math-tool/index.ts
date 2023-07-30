import { CalculationInterface } from 'interfaces/calculation';
import { CompanyInterface } from 'interfaces/company';
import { GetQueryInterface } from 'interfaces';

export interface MathToolInterface {
  id?: string;
  name: string;
  company_id?: string;
  created_at?: any;
  updated_at?: any;
  calculation?: CalculationInterface[];
  company?: CompanyInterface;
  _count?: {
    calculation?: number;
  };
}

export interface MathToolGetQueryInterface extends GetQueryInterface {
  id?: string;
  name?: string;
  company_id?: string;
}

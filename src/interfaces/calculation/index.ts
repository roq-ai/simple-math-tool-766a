import { MathToolInterface } from 'interfaces/math-tool';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface CalculationInterface {
  id?: string;
  math_tool_id?: string;
  user_id?: string;
  result: number;
  created_at?: any;
  updated_at?: any;

  math_tool?: MathToolInterface;
  user?: UserInterface;
  _count?: {};
}

export interface CalculationGetQueryInterface extends GetQueryInterface {
  id?: string;
  math_tool_id?: string;
  user_id?: string;
}

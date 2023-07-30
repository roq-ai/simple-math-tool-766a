const mapping: Record<string, string> = {
  calculations: 'calculation',
  companies: 'company',
  'math-tools': 'math_tool',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}

interface AppConfigInterface {
  ownerRoles: string[];
  customerRoles: string[];
  tenantRoles: string[];
  tenantName: string;
  applicationName: string;
  addOns: string[];
}
export const appConfig: AppConfigInterface = {
  ownerRoles: ['Business Owner'],
  customerRoles: ['End User'],
  tenantRoles: ['Business Owner'],
  tenantName: 'Company',
  applicationName: 'Simple Math Tools',
  addOns: ['file upload', 'chat', 'notifications', 'file'],
};

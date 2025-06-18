import { MenuItem } from 'primeng/api';

export interface StepItem extends MenuItem {
  id?: string;
  title?: string;
}

export interface VisitorData {
  building?: string;
  firstName?: string;
  lastName?: string;
}
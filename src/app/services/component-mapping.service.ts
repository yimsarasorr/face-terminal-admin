import { Injectable } from '@angular/core';
import { PageId } from '../pages/visitor-registration/models/page-id.enum';

@Injectable({
  providedIn: 'root',
})
export class ComponentMappingService {
  /**
   * ทำการโหลดคอมโพเนนท์แบบไดนามิก (Lazy Loading) ตาม PageId ที่ได้รับ
   * @param pageId ID ของหน้าที่ต้องการโหลด
   * @returns Promise ที่จะ resolve เป็นคลาสของคอมโพเนนท์
   */
  getComponentForPage(pageId: PageId): Promise<any> {
    console.log('ComponentMappingService: Loading component for PageId:', pageId);

    switch (pageId) {
      // --- Chapter 1 ---
      case PageId.VISITOR_TYPE:
        return import(
          '../pages/visitor-registration/steps/visitor-type/visitor-type.component'
        ).then((m) => m.VisitorTypeComponent);

      // --- Chapter 2 (New Visitor) ---
      case PageId.SELECT_BUILDING:
        return import(
          '../pages/visitor-registration/steps/select-building/select-building.component'
        ).then((m) => m.SelectBuildingComponent);

      case PageId.VISITOR_FORM:
        return import(
          '../pages/visitor-registration/steps/visitor-form/visitor-form.component'
        ).then((m) => m.VisitorFormComponent);

      case PageId.SUMMARY:
        return import(
          '../pages/visitor-registration/steps/summary/summary.component'
        ).then((m) => m.SummaryComponent);

      // --- Chapter 3 (Returning Visitor) ---
      case PageId.PRE_REGISTRATION_CODE:
        return import(
          '../pages/visitor-registration/steps/pre-registration-code/pre-registration-code.component'
        ).then((m) => m.PreRegistrationCodeComponent);

      // --- Subflow Components ---
      case PageId.TERMS_CONDITION:
        return import(
          '../pages/visitor-registration/steps/terms-condition/terms-condition.component'
        ).then((m) => m.TermsConditionComponent);

      default:
        console.error(`ComponentMappingService: No component mapping found for page ID: ${pageId}`);
        return Promise.reject(`No component mapping found for page ID: ${pageId}`);
    }
  }
}
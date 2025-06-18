import { Injectable, Type } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ComponentRegistryService {
  private registry = new Map<string, Type<any>>();
  
  /**
   * ลงทะเบียน component
   * @param name ชื่อของ component (ควรตรงกับชื่อคลาส)
   * @param component component ที่ต้องการลงทะเบียน
   */
  register(name: string, component: Type<any>): void {
    this.registry.set(name, component);
  }
  
  /**
   * ดึง component จากชื่อ
   * @param name ชื่อของ component
   * @returns component หรือ undefined ถ้าไม่พบ
   */
  get(name: string): Type<any> | undefined {
    return this.registry.get(name);
  }
  
  /**
   * เช็คว่ามี component ในระบบหรือไม่
   * @param name ชื่อของ component
   * @returns true ถ้ามี, false ถ้าไม่มี
   */
  has(name: string): boolean {
    return this.registry.has(name);
  }
}
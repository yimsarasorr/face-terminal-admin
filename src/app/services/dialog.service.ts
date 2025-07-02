import { Injectable, Type, inject } from '@angular/core';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { ComponentRegistryService } from './component-registry.service';

export interface DialogConfig {
  component: Type<any> | string;
  inputs?: Record<string, any>;
  title?: string;
  fullscreen?: boolean;
  width?: string;
  height?: string;
  callback?: (result?: any) => void;
  showHeader?: boolean;
  showFooter?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  private dialogStateSubject = new BehaviorSubject<{
    isOpen: boolean;
    config?: DialogConfig;
  }>({ isOpen: false });

  public dialogState$ = this.dialogStateSubject.asObservable();
  
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private componentRegistry = inject(ComponentRegistryService);

  openViaUrl(componentName: string | null, params: Record<string, any> = {}, preserveQueryParams: boolean = true): void {
    const navigationExtras: NavigationExtras = {
      queryParams: { 
        dialog: componentName,
        ...params
      },
      queryParamsHandling: preserveQueryParams ? 'merge' : ''
    };
    this.router.navigate([], navigationExtras);
  }
  
  open(config: DialogConfig): void {
    if (typeof config.component === 'string') {
      const componentType = this.componentRegistry.get(config.component);
      if (componentType) {
        config.component = componentType;
      } else {
        console.error(`Component "${config.component}" not found in registry`);
        return;
      }
    }
    
    this.dialogStateSubject.next({
      isOpen: true,
      config
    });
  }
  
  close(result?: any): void {
    const config = this.dialogStateSubject.value.config;
    
    if (config?.callback) {
      config.callback(result);
    }
    
    this.dialogStateSubject.next({ isOpen: false });
    
    if (this.route.snapshot.queryParams['dialog']) {
      this.router.navigate([], {
        queryParams: { dialog: null, title: null },
        queryParamsHandling: 'merge'
      });
    }
  }
}
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TabViewModule } from 'primeng/tabview';
import { InputSwitchModule } from 'primeng/inputswitch';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';

@Component({
    selector: 'app-settings',
    standalone: true,
    imports: [
        CommonModule, 
        ButtonModule, 
        TabViewModule, 
        InputSwitchModule, 
        FormsModule,
        CardModule
    ],
    template: `
        <div class="card">
            <h5>ตั้งค่าระบบ</h5>
            
            <p-tabView>
                <!-- แท็บตั้งค่าทั่วไป -->
                <p-tabPanel header="โปรไฟล์">
                    <div class="text-center py-5">
                        <i class="pi pi-spin pi-cog text-5xl text-primary mb-3"></i>
                        <h5>การตั้งค่าทั่วไปจะเพิ่มในอนาคต</h5>
                        <p class="text-secondary">การตั้งค่าส่วนนี้ยังอยู่ระหว่างการพัฒนา</p>
                    </div>
                </p-tabPanel>
                
                <!-- แท็บตั้งค่าโปรไฟล์ -->
                <p-tabPanel header="โปรไฟล์">
                    <div class="text-center py-5">
                        <i class="pi pi-user-edit text-5xl text-primary mb-3"></i>
                        <h5>การตั้งค่าโปรไฟล์จะเพิ่มในอนาคต</h5>
                        <p class="text-secondary">การตั้งค่าส่วนนี้ยังอยู่ระหว่างการพัฒนา</p>
                    </div>
                </p-tabPanel>
                
                <!-- แท็บความปลอดภัย -->
                <p-tabPanel header="ความปลอดภัย">
                    <div class="text-center py-5">
                        <i class="pi pi-lock text-5xl text-primary mb-3"></i>
                        <h5>การตั้งค่าความปลอดภัยจะเพิ่มในอนาคต</h5>
                        <p class="text-secondary">การตั้งค่าส่วนนี้ยังอยู่ระหว่างการพัฒนา</p>
                    </div>
                </p-tabPanel>
                
                <!-- แท็บแจ้งเตือน -->
                <p-tabPanel header="การแจ้งเตือน">
                    <div class="text-center py-5">
                        <i class="pi pi-bell text-5xl text-primary mb-3"></i>
                        <h5>การตั้งค่าการแจ้งเตือนจะเพิ่มในอนาคต</h5>
                        <p class="text-secondary">การตั้งค่าส่วนนี้ยังอยู่ระหว่างการพัฒนา</p>
                    </div>
                </p-tabPanel>
            </p-tabView>
        </div>
    `
})
export class Settings {
    settings = {
        darkMode: false,
        notifications: true
    };
}
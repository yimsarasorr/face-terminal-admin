import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AppFloatingConfigurator } from '../../layout/component/app.floatingconfigurator';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [
        ButtonModule, 
        CheckboxModule, 
        InputTextModule, 
        PasswordModule, 
        FormsModule, 
        RouterModule, 
        RippleModule, 
        AppFloatingConfigurator, 
        ToastModule
    ],
    providers: [MessageService],
    template: `
        <app-floating-configurator />
        <p-toast />
        <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
            <div class="flex flex-col items-center justify-center">
                <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                    <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">
                        <div class="text-center mb-8">
                            <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">Face Terminal Admin</div>
                            <span class="text-muted-color font-medium">Sign in to continue</span>
                        </div>

                        <div>
                            <label for="username1" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Username</label>
                            <input pInputText id="username1" type="text" placeholder="Username" class="w-full md:w-[30rem] mb-8" [(ngModel)]="username" />

                            <label for="password1" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Password</label>
                            <p-password id="password1" [(ngModel)]="password" placeholder="Password" [toggleMask]="true" styleClass="mb-4" [fluid]="true" [feedback]="false"></p-password>

                            <div class="flex items-center justify-between mt-2 mb-8 gap-8">
                                <div class="flex items-center">
                                    <p-checkbox [(ngModel)]="checked" id="rememberme1" binary class="mr-2"></p-checkbox>
                                    <label for="rememberme1">Remember me</label>
                                </div>
                            </div>
                            
                            <p-button 
                                label="Sign In" 
                                styleClass="w-full" 
                                (onClick)="login()"
                                [loading]="isLoading">
                            </p-button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class Login {
    username: string = '';
    password: string = '';
    checked: boolean = false;
    isLoading: boolean = false;

    constructor(
        private authService: AuthService,
        private router: Router,
        private messageService: MessageService
    ) {}

    login() {
        if (!this.username || !this.password) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Please enter username and password'
            });
            return;
        }

        this.isLoading = true;
        
        this.authService.login({ 
            username: this.username, 
            password: this.password 
        }).subscribe({
            next: (response) => {
                localStorage.setItem('access_token', response.access_token);
                localStorage.setItem('refresh_token', response.refresh_token);
                
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Login successful'
                });
                
                this.router.navigate(['/']);
                this.isLoading = false;
            },
            error: (error) => {
                console.error('Login error:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Login Failed',
                    detail: 'Invalid username or password'
                });
                this.isLoading = false;
            }
        });
    }
}

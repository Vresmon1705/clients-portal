import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { isNotAuthenticatedGuard } from './auth/guards/not-authenticated.guard';
import { HomeComponent } from './views/home/home.component';
import { isAuthenticatedGuard } from './auth/guards/is-authenticated.guard';
import { ShoppingComponent } from './views/home/shopping/shopping.component';
import { PurchaseStatusComponent } from './views/home/purchase-status/purchase-status.component';
import { PortfolioStatusComponent } from './views/home/portfolio-status/portfolio-status.component';
import { ShoppingCartComponent } from './views/home/shopping-cart/shopping-cart.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent, canActivate: [isNotAuthenticatedGuard] },    
    {
        path: 'home',
        canActivate: [isAuthenticatedGuard],
        component: HomeComponent,
        children: [
            { path: 'shopping', component: ShoppingComponent },
            { path: 'purchase-status', component: PurchaseStatusComponent },
            { path: 'portfolio-status', component: PortfolioStatusComponent},            
            { path: 'shopping-cart', component: ShoppingCartComponent },
        ]
    },
    { path: '**', redirectTo: 'login' },
];

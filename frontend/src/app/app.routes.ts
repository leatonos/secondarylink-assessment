import { Routes } from '@angular/router';
import { IndexComponent } from './pages/index/index.component';
import { TaskDescription } from './pages/task-description/task-description';
import { FundDetailComponent } from './pages/fund-detail/fund-detail.component';



export const routes: Routes = [
    { path: 'index', component: IndexComponent},
    { path: 'task-description', component: TaskDescription},
    { path: 'fund/:name', component: FundDetailComponent},
    { path: '**', redirectTo: 'index'}
];

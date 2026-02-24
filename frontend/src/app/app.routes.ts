import { Routes } from '@angular/router';
import { IndexComponent } from './pages/index/index.component';
import { TaskDescription } from './pages/task-description/task-description';


export const routes: Routes = [
    { path: 'index', component: IndexComponent},
    { path: 'task-description', component: TaskDescription},
    { path: '**', redirectTo: 'index'}
];

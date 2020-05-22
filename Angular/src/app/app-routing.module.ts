import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserVerificationComponent } from './user-verification/user-verification.component';
import { UploadImageComponent } from './upload-image/upload-image/upload-image.component';


const routes: Routes = [
  { path: 'user-verify', component: UserVerificationComponent },
  { path: 'upload', component: UploadImageComponent },

]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

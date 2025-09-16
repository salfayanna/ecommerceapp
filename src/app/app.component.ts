import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProductListPageComponent } from './components/product-list-page/product-list-page.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, ProductListPageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {
}

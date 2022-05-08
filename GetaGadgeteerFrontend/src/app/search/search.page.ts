import { Component, OnInit } from '@angular/core';
import { Product } from '../models/product/product';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage {
  public productList: Product[];
  public searchTerm: string;

  constructor() { }


}

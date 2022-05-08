import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonPopover, LoadingController, ModalController, PopoverController, ToastController } from '@ionic/angular';
import { first, take } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { SortType } from '../common/sortType';
import { Product } from '../models/product/product';
import { ProductData } from '../models/product/productData';
import { ProductQuery } from '../models/product/productQuery';
import { SearchPage } from '../search/search.page';
import { ProductService } from './product.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.page.html',
  styleUrls: ['./product.page.scss'],
})
export class ProductPage implements OnInit {
  private productData: ProductData;
  private searchTerm: string;
  private provider: number[];
  private deliveryMethod: number[];
  private category: number[];
  private sortBy: number;
  private inStock: boolean;
  private wasPredSearchClicked: boolean;
  public productList: Product[];
  public isLoading = false;
  private searchData: Product[];

  public predictiveSearch: string[];

  public get sortType() : typeof SortType{
    return SortType;
  }

  constructor(private productService: ProductService, private popoverController: PopoverController, private toastCtrl: ToastController, private router: Router, private authService : AuthService, public modalController: ModalController) { }

  async ngOnInit() {
    this.fetchStaticData();
  }

  ionViewWillEnter(){
    this.fetchStaticData();
    this.getProductList();
  }

  getProductList(){
    if (this.searchTerm !== undefined && this.searchTerm.length == 0){
      this.predictiveSearch = [];
    }
    this.isLoading = true;

    var model = new ProductQuery(this.provider,
                             this.deliveryMethod,
                             this.category,
                             this.sortBy,
                             this.searchTerm,
                             this.inStock);

    this.productService.getProductList(model).pipe(first()).subscribe(
      data =>{
        this.productList = data;
        if (this.searchTerm == undefined) {
          this.productList = data;
        } else {
          this.searchData = data;
        }
        this.isLoading = false;
        if (this.searchTerm != undefined) {
          this.presentModal();
        }
      },
      error => {
        this.toastCtrl.create({
          message: 'Unable to get the products list',
          duration: 5000,
          position: 'bottom',
          color: 'danger',
          buttons: ['Dismiss']
        }).then((el) => el.present());
        
        this.isLoading = false;
    });
  }

  fetchStaticData(){
    this.productService.getProductData().pipe(take(1)).subscribe(
      data => {
        this.productData = data;
      }
    );
  }

  addPage(){
    this.router.navigateByUrl("/product/edit");
  }

  viewCart() {
    this.router.navigateByUrl("/order");
  }

  viewWishlist() {
    this.router.navigateByUrl("/wishlist");
  }
  
  search(): void{
    if(this.searchTerm != undefined && this.searchTerm.length == 0){
      this.predictiveSearch = [];
    }

    if (this.wasPredSearchClicked){
      this.wasPredSearchClicked = false;
    } else {
      this.productService.search(this.searchTerm).pipe(take(1)).subscribe(
        data => {
          this.predictiveSearch = data;
        }
      )
    }
  }

  predSearch(item: string){
    this.searchTerm = item;
    this.wasPredSearchClicked = true;
    this.getProductList();
    this.predictiveSearch = [];
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: SearchPage,
      cssClass: 'my-custom-class',
      componentProps: {
        "productList": this.searchData,
        "searchTerm": this.searchTerm
      }
    });
    return await modal.present();
  }
}

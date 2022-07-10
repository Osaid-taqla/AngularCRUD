import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {
  productForm!: FormGroup;
  freshnessList = ["Brand New", "Second Hand", "Refurbished"];
  actionBtn: string = 'Save';
  constructor(private fb: FormBuilder,
    private api: ApiService,
    readonly snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DialogComponent>,
  ) { }

  ngOnInit(): void {
    this.productForm = this.fb.group({
      productName: ['', Validators.required],
      category: ['', Validators.required],
      freshness: ['', Validators.required],
      price: ['', Validators.required],
      comment: ['', Validators.required],
      date: ['', Validators.required],
    })
    if (this.data) {
      this.actionBtn = 'Update'
      this.productForm.controls['productName'].setValue(this.data.productName);
      this.productForm.controls['category'].setValue(this.data.category);
      this.productForm.controls['freshness'].setValue(this.data.freshness);
      this.productForm.controls['price'].setValue(this.data.price);
      this.productForm.controls['comment'].setValue(this.data.comment);
      this.productForm.controls['date'].setValue(this.data.date);
    }
  }

  addProduct() {
    if (!this.data) {
      if (this.productForm.valid) {
        this.api.postProduct(this.productForm.value).subscribe(
          {
            next: (res) => {
              this.snackBar.open("Product Added successful", '', {
                duration: 3000
              });
              this.productForm.reset();
              this.dialogRef.close('save');
            }
            ,
            error: (err) =>
              this.snackBar.open("Error while adding th e product", '', {
                duration: 3000
              })
          }
        )
      }
    } else {
      this.updateProduct();
    }
  }

  updateProduct() {
    if (this.productForm.valid) {
      this.api.putProduct(this.productForm.value, this.data.id).subscribe(
        {
          next: (res) => {
            this.snackBar.open('Product Update Successful', '', { duration: 3000 });
            this.productForm.reset();
            this.dialogRef.close('update')
          },
          error: (err) => {
            this.snackBar.open('Error while updating the record!!');

          }
        }
      )
    }
  }


  getErrorMessage() {
    if (this.productForm.controls['productName'].hasError('required')) {
      return 'You must enter a value';
    }
    if (this.productForm.controls['date'].hasError('matDatepickerParse')) {
      return 'Invalid Date';
    }
    else {
      return null;
    }

  }


  closeDialog() {
    this.dialogRef.close('save');
  }
}

import { Component, OnInit, Input, ViewChild, Inject } from '@angular/core';
import { Dish } from '../shared/dish';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { DishService } from '../services/dish.service';
import { switchMap } from 'rxjs/operators';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { visibilty, flyInOut, expand } from '../animations/app.animation';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    style: 'display: block;',
  },
  animations: [flyInOut(), visibilty(), expand()],
})
export class DishdetailComponent implements OnInit {
  errMsg: string;

  @ViewChild('cform') commentFormDirective;
  commentForm: FormGroup;
  commentValue: Comment;
  value = '5';
  dish: Dish;
  dishIds: string[];
  prev: string;
  next: string;
  dishcopy: Dish;
  visibilty = 'shown';
  formErrors = {
    author: '',
    comment: '',
    rating: '',
  };
  validationMessages = {
    author: {
      required: 'Author Name is required.',
      minlength: 'Author Name must be at least 2 characters long.',
    },
    comment: {
      required: 'First Name is required.',
      minlength: 'First Name must be at least 2 characters long.',
    },
    rating: {
      required: 'First Name is required.',
    },
  };
  constructor(
    private dishService: DishService,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder,
    @Inject('BaseURL') private BaseURL,
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.dishService.getDishIds().subscribe(
      ids => {
        this.dishIds = ids;
      },
      errMsg => (this.errMsg = <any>errMsg),
    );

    this.route.params
      .pipe(
        switchMap((params: Params) => {
          this.visibilty = 'hidden';
          return this.dishService.getDish(params.id);
        }),
      )
      .subscribe(
        dish => {
          this.dish = dish;
          this.dishcopy = dish;
          this.setPrevNext(dish.id);
          this.visibilty = 'shown';
        },
        errMsg => (this.errMsg = <any>errMsg),
      );
  }
  createForm() {
    this.commentForm = this.fb.group({
      author: ['', [Validators.required, Validators.minLength(2)]],
      comment: ['', [Validators.required, Validators.minLength(2)]],
      rating: ['', Validators.required],
      date: new Date().toISOString(),
    });
    this.commentForm.valueChanges.subscribe(data => this.onValueChange(data));
    this.onValueChange(); // reset form validation messages
  }
  onValueChange(data?: any) {
    if (!this.commentForm) {
      return;
    }
    const form = this.commentForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        // clear previous error message ( if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }
  setPrevNext(dishId: string) {
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[
      (this.dishIds.length + index - 1) % this.dishIds.length
    ];
    this.next = this.dishIds[
      (this.dishIds.length + index + 1) % this.dishIds.length
    ];
  }

  goBack() {
    this.location.back();
  }
  onSubmit() {
    this.commentValue = this.commentForm.value;
    console.log(this.commentValue);
    this.dishcopy.comments.push(this.commentValue);
    this.dishService.putDish(this.dishcopy).subscribe(
      dish => {
        this.dish = dish;
        this.dishcopy = dish;
      },
      errMsg => {
        this.dish = null;
        this.dishcopy = null;
        this.errMsg = <any>errMsg;
      },
    );
    this.commentForm.reset({
      author: '',
      comment: '',
      rating: '',
      date: '',
    });
    this.commentFormDirective.resetForm();
  }
}

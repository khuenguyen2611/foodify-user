import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { FirebaseService } from '../../../shared/services/firebase.service';
import { DistrictService } from 'src/app/shared/services/district.service';
import { District } from 'src/app/shared/classes/district';
import { Ward } from 'src/app/shared/classes/ward';
import { Register } from 'src/app/shared/classes/register';
import { Address } from 'src/app/shared/classes/address';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

    public registerForm: UntypedFormGroup;

    //Address
    ward: string = '';
    district: string = '';
    districts: District[] = [];
    wards: Ward[] = [];
    isHaveDistrict: boolean = false;

    showPassword: boolean = false;

    constructor(
        private formBuilder: UntypedFormBuilder,
        private toastService: ToastrService,
        private firebaseAuthService: FirebaseService,
        private districtService: DistrictService,
        private authService: AuthService,
        private router: Router) {
    }

    ngOnInit(): void {
        this.getAllDistricts();
        this.createRegisterForm();
    }

    createRegisterForm() {
        this.registerForm = this.formBuilder.group({
            email: new FormControl("", [Validators.required, Validators.email]),
            dob: new FormControl("", [Validators.required]),
            phoneNumber: new FormControl("", [Validators.required, Validators.pattern(/^(((\+|)84)|0)([1-9]{1})([0-9]{8})\b/)]),
            fullName: new FormControl("", [Validators.required, Validators.minLength(2)]),
            identifiedCode: new FormControl("", [Validators.required, Validators.pattern(/^(\d{9}|\d{12})$/)]),
            password: new FormControl("", [Validators.required, Validators.pattern(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&^_-]).{8,}/)]),
            confirmPassword: new FormControl("", [Validators.required, Validators.pattern(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&^_-]).{8,}/)]),
            address: new FormControl("", [Validators.required, Validators.minLength(8)]),
            district: new FormControl("", [Validators.required]),
            ward: new FormControl("", [Validators.required]),
        },
        {
            validator: this.ConfirmedValidator("password", "confirmPassword"),
        }
        );
    }

    // Validation for password and confirm password
  ConfirmedValidator(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      if (matchingControl.errors && !matchingControl.errors.confirmedValidator) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ confirmedValidator: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

    onSignUp() {

        if (this.registerForm.invalid) {
            this.registerForm.markAllAsTouched();
            return;
        } 

        const register = new Register();
        const newAddress = new Address();
        // newAddress.id = 1;
        newAddress.address = this.userAddress.value;
        newAddress.district = this.userDistrict.value;
        if (this.userDistrict.value != 'Huyện Hoàng Sa') newAddress.ward = this.userWard.value;

        register.fullName = this.userFullName.value;
        register.dateOfBirth = this.userDob.value;
        register.identifiedCode = this.userIdentifiedCode.value;
        register.email = this.userEmail.value;
        register.phoneNumber = this.userPhoneNumber.value;
        register.addressDto = newAddress;

        this.authService.checkEmailOrPhoneNumberExist(register).subscribe({
            next: (result) => {
                if (result.title == 'emailExist') {
                    this.toastService.error("Email bạn sử dụng đã được đăng ký. Vui lòng chọn một email khác!")
                }
                else if (result.title == 'phoneNumExist') {
                    this.toastService.error("Số điện thoại bạn sử dụng đã được đăng ký. Vui lòng chọn một số điện thoại khác!")
                }
                else {
                    this.authService.checkIdentifiedCodeExist(register.identifiedCode).subscribe({
                        next: (res) => {
                            if (res.isTrue == true) {
                                this.toastService.error("CCCD/CMND bạn sử dụng đã được đăng ký. Vui lòng chọn một CCCD/CMND khác!")
                            }
                            else {
                                this.authService.SignUpUser(register).subscribe((user) => {
                                    this.toastService.success(`Đăng ký người dùng ${user.fullName} thành công`);
                                    this.firebaseAuthService.signUp(register.email, this.userPassword.value);
                                    this.router.navigate(['/home/login']);
                                })
                            }
                        }
                    })
                }
            },
            error: () => { }
        })


        // this.firebaseAuthService.signUp(this.userEmail.value, this.userPassword.value);
    }

    //District & Ward
    getAllDistricts(): Promise<void> {
        return new Promise((resolve) => {
            this.districtService.getAllDistricts().subscribe({
                next: (districts) => {
                    this.districts = districts;
                    resolve();
                }
            })
        })
    }

    onDistrictSelected() {
        this.isHaveDistrict = false;
        this.wards = [];

        this.districts.forEach((district) => {
            if (this.userDistrict.value == district.name && this.userDistrict.value != 'Huyện Hoàng Sa') {
                this.isHaveDistrict = true;
                this.wards = district.wards;
            }
        })
    }


    get userFullName() { return this.registerForm.get('fullName') }
    get userDob() { return this.registerForm.get('dob') }
    get userIdentifiedCode() { return this.registerForm.get('identifiedCode') }
    get userPhoneNumber() { return this.registerForm.get('phoneNumber') }
    get userEmail() { return this.registerForm.get('email') }
    get userAddress() { return this.registerForm.get('address') }
    get userDistrict() { return this.registerForm.get('district'); }
    get userWard() { return this.registerForm.get('ward'); }
    get userPassword() { return this.registerForm.get('password') }
    get userConfirmPassword() { return this.registerForm.get('confirmPassword') }
}

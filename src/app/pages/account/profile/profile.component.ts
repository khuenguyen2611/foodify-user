import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from 'src/app/shared/classes/user';
import { FirebaseService } from 'src/app/shared/services/firebase.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  //Logged Info
  userId = this.firebaseService.getUserId();

  editForm: FormGroup;

  user: User;
  defaultAddr: string = '';

  //Modal
  @ViewChild('successModal') successModal: TemplateRef<any>

  constructor(
    private formBuilder: FormBuilder,
    private firebaseService: FirebaseService,
    private userService: UserService,
    private modalService: NgbModal
  ) {

  }

  ngOnInit(): void {
    this.createEditForm();
    this.patchUserData();
  }

  createEditForm() {
    this.editForm = this.formBuilder.group({
      fullName: new FormControl(""),
      dob: new FormControl(""),
      email: new FormControl(""), //No-validate
      phoneNumber: new FormControl(""), //No-validate
      identifiedCode: new FormControl(""), //No-validate
      defaultAddress: new FormControl("")
    })
  }

  patchUserData() {
    this.userService.getUserById(this.userId).subscribe({
      next: (user) => {
        this.user = user;
        this.user.addresses.forEach(address => {
          if (address.id = this.user.defaultAddress) {
            this.defaultAddr = address.address + ", " + address.ward + ", " + address.district;
          }
        });
        this.editForm.patchValue({
          fullName: user.fullName,
          dob: user.dateOfBirth,
          email: user.email,
          phoneNumber: user.phoneNumber,
          identifiedCode: user.identifiedCode,
          defaultAddress: this.defaultAddr
        })
      }
    })
  }

  saveData() {
    const editUser = new User();
    editUser.fullName = this.userFullName.value;
    editUser.dateOfBirth = this.userDob.value;
    editUser.email = this.userEmail.value;
    editUser.identifiedCode = this.userIdentifiedCode.value;
    editUser.phoneNumber = this.userPhoneNumber.value;

    editUser.defaultAddress = this.user.defaultAddress;
    editUser.imageUrl = this.user.imageUrl;
    editUser.isLocked = this.user.isLocked;
    this.userService.editUser(this.userId, editUser).subscribe(() => {
      this.modalService.open(this.successModal,
        {
          // size: 'lg',
          ariaLabelledBy: 'modal-basic-title',
          centered: true,
          windowClass: 'Quickview'
        })
    });
  }

  get userFullName() { return this.editForm.get('fullName') }
  get userDob() { return this.editForm.get('dob') }
  get userEmail() { return this.editForm.get('email') } //No-validate
  get userIdentifiedCode() { return this.editForm.get('identifiedCode') } //No-validate
  get userPhoneNumber() { return this.editForm.get('phoneNumber') } //No-validate
}

import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { resolve } from 'path';
import { Address } from 'src/app/shared/classes/address';
import { District } from 'src/app/shared/classes/district';
import { Ward } from 'src/app/shared/classes/ward';
import { AddressService } from 'src/app/shared/services/address.service';
import { DistrictService } from 'src/app/shared/services/district.service';
import { FirebaseService } from 'src/app/shared/services/firebase.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-user-addresses',
  templateUrl: './user-addresses.component.html',
  styleUrls: ['./user-addresses.component.scss']
})
export class UserAddressesComponent implements OnInit {

  private userId = this.firebaseService.getUserId();
  defaultAddr: number;
  addresses?: Address[] = [];
  choosenId: number;

  addr: number;
  message = '';
  address: string = '';
  district: string = 'x';
  ward: string = 'x';
  districts: District[] = [];
  wards: Ward[] = [];
  isHaveDistrict: boolean = false;

  @ViewChild('createAddress') createAddressModal: TemplateRef<any>
  @ViewChild('MessageModal') messageModal: TemplateRef<any>
  @ViewChild('deleteAddress') deleteAddressModal: TemplateRef<any>
  @ViewChild('editAddressModal') editAddressModal: TemplateRef<any>
  @ViewChild('changeDefaultModal') changeDefaultModal: TemplateRef<any>

  constructor(
    private firebaseService: FirebaseService,
    private userService: UserService,
    private districtService: DistrictService,
    private addressService: AddressService,
    private modalService: NgbModal
  ) {

  }

  ngOnInit(): void {
    this.getAllDistricts();
    this.loadData();
  }

  loadData() {
    this.userService.getUserById(this.userId).subscribe((user) => {
      this.defaultAddr = user.defaultAddress;
    })
    this.userService.getAddressesByUser(this.userId).subscribe({
      next: (data) => { this.addresses = data.addresses; }
    })
  }

  createNewAddress() {
    const newAddress = new Address();
    newAddress.address = this.address;
    newAddress.district = this.district;
    newAddress.ward = this.ward
    this.userService.createAddressForUser(this.userId, newAddress).subscribe((response) => {
      if (response.title == 'Address has existed') {
        this.message = 'Địa chỉ đã tồn tại. Vui lòng chọn một địa chỉ khác.'
        this.modalService.open(this.messageModal,
          {
            size: 'lg',
            ariaLabelledBy: 'modal-basic-title',
            centered: true,
            windowClass: 'Quickview'
          });
      }
      else {
        this.message = 'Tạo địa chỉ mới thành công.'
        this.modalService.open(this.messageModal,
          {
            size: 'lg',
            ariaLabelledBy: 'modal-basic-title',
            centered: true,
            windowClass: 'Quickview'
          });
        this.loadData();
      }
    })
    this.modalService.dismissAll();

    this.resetAddressValue();
  }

  editAddress() {
    const editAddress = new Address();
    editAddress.address = this.address;
    editAddress.district = this.district;
    editAddress.ward = this.ward;

    this.userService.updateUserAddress(this.userId, this.choosenId, editAddress).subscribe({
      next: (response) => {
        if (this.defaultAddr == this.choosenId) {
          this.userService.updateUserDefaultAddress(this.userId, response.id).subscribe();
        }
        this.modalService.dismissAll();
        this.message = 'Chỉnh sửa địa chỉ thành công.'
        this.modalService.open(this.messageModal,
          {
            size: 'lg',
            ariaLabelledBy: 'modal-basic-title',
            centered: true,
            windowClass: 'Quickview'
          });
        this.resetAddressValue();
        this.loadData();
      },
      error: () => {
        this.message = 'Địa chỉ bạn thay đổi đã tồn tại. Vui lòng chọn một địa chỉ khác.'
        this.modalService.open(this.messageModal,
          {
            size: 'lg',
            ariaLabelledBy: 'modal-basic-title',
            centered: true,
            windowClass: 'Quickview'
          });
      }
    })
  }

  confirmDelete() {
    console.log(this.userId + " " + this.choosenId)
    this.userService.deleteUserAddress(this.userId, this.choosenId).subscribe(() => {
      this.modalService.dismissAll();
      this.message = 'Xoá địa chỉ thành công.'
      this.modalService.open(this.messageModal,
        {
          size: 'lg',
          ariaLabelledBy: 'modal-basic-title',
          centered: true,
          windowClass: 'Quickview'
        })
      this.loadData();
    })
  }

  changeDefaultAddress() {
    this.userService.updateUserDefaultAddress(this.userId, this.addr).subscribe({
      next: () => {
        this.modalService.dismissAll();
        this.message = 'Chỉnh sửa địa chỉ mặc định thành công.'
        this.modalService.open(this.messageModal,
          {
            size: 'lg',
            ariaLabelledBy: 'modal-basic-title',
            centered: true,
            windowClass: 'Quickview'
          })
        this.loadData();
      }
    })
  }

  resetAddressValue() {
    this.address = '';
    this.district = 'x';
    this.ward = 'x';
  }

  openCreateModal() {
    this.modalService.open(this.createAddressModal,
      {
        size: 'lg',
        ariaLabelledBy: 'modal-basic-title',
        centered: true,
        windowClass: 'Quickview'
      })
  }

  openEditModal(id: number) {
    this.choosenId = id;
    this.addressService.getAddressById(this.choosenId).subscribe((address) => {
      this.address = address.address;
      this.district = address.district;
      this.onDistrictSelected();
      this.ward = address.ward;
      this.modalService.open(this.editAddressModal,
        {
          size: 'lg',
          ariaLabelledBy: 'modal-basic-title',
          centered: true,
          windowClass: 'Quickview'
        })
    })
  }

  openDeleteModal(id: number) {
    this.choosenId = id;
    this.modalService.open(this.deleteAddressModal,
      {
        ariaLabelledBy: 'modal-basic-title',
        centered: true,
        windowClass: 'Quickview'
      })
  }

  openChangeModal() {
    this.addressService.getAddressById(this.defaultAddr).subscribe((address) => {
      this.addr = address.id;

      this.modalService.open(this.changeDefaultModal,
        {
          ariaLabelledBy: 'modal-basic-title',
          centered: true,
          windowClass: 'Quickview'
        })
    })

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
      if (this.district == district.name && this.district != 'Huyện Hoàng Sa') {
        this.isHaveDistrict = true;
        this.wards = district.wards;
      }
    })
  }
}

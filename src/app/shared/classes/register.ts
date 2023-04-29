import { StringBoolObject } from '../string-bool-object';
import { Address } from './address';

export class Register {
    fullName: string;
    dateOfBirth: string;
    identifiedCode: string;
    email: string;
    phoneNumber: string;
    imageUrl = 'https://firebasestorage.googleapis.com/v0/b/foodify-55954.appspot.com/o/Admin%2Fdefault%2Fdefault-ava-01.png?alt=media&token=7175d053-86b9-4bee-8efa-221c2e2b8da9';
    isLocked = false;
    roleName = 'ROLE_USER';
    addressDto: Address;
}

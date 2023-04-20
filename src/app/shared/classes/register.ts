import { StringBoolObject } from "../string-bool-object";
import { Address } from "./address";

export class Register {
    fullName: string;
    dateOfBirth: string;
    identifiedCode: string;
    email: string;
    phoneNumber: string;
    imageUrl: string = 'https://firebasestorage.googleapis.com/v0/b/foodify-55954.appspot.com/o/Admin%2Fuser-default-01.png?alt=media&token=b13f27da-b39a-4d89-9cba-acba869d60ce';
    isLocked: boolean = false;
    roleName: string = 'ROLE_USER'
    addressDto: Address;
}
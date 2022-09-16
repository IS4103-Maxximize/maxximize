import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { RawMaterial } from '../raw-materials/entities/raw-material.entity';
import { SalesInquiryLineItem } from '../sales-inquiry-line-items/entities/sales-inquiry-line-item.entity';
import { SalesInquiry } from '../sales-inquiry/entities/sales-inquiry.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class MailService {
    constructor(private mailerService: MailerService) {}
    async sendPasswordEmail(email: string, organisation: string, user: User, password: string, id: number) {
        await this.mailerService.sendMail({
            to: email,
            from: process.env.MAIL_FROM,
            subject: "Account details",
            template: './sendPasswordMail', 
            context: {
                organisation: organisation,
                id: id,
                name: user.firstName + " " + user.lastName,
                username: user.username,
                password: password
            },
        });
    }

    async sendForgotPasswordEmail(email: string, password: string, name: string, id: number, organisation: string) {
        await this.mailerService.sendMail({
            to: email,
            from: process.env.MAIL_FROM,
            subject: "Forgot Password",
            template: './forgotPasswordMail', 
            context: {
                password: password,
                name: name,
                id: id,
                organisation: organisation
            },
        });
    }

    async sendSalesInquiryEmail(email: string, organisationName: string, supplierName: string, salesInquiryLineItems: SalesInquiryLineItem[], salesInquiry: SalesInquiry) {
        await this.mailerService.sendMail({
            to: email,
            from: process.env.MAIL_FROM,
            subject: "Sales Inquiry",
            template: './salesInquiryMail', 
            context: {
                organisationName: organisationName,
                supplierName: supplierName,
                salesInquiryLineItems: salesInquiryLineItems,
                salesInquiry: salesInquiry
            },
        });
    }
}

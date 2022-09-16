import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { Contact } from './entities/contact.entity';

@Injectable()
export class ContactsService {
  constructor(
    @InjectRepository(Contact)
    private readonly contactsRepository: Repository<Contact>,
  ) {}

  async create(createContactDto: CreateContactDto): Promise<Contact> {
    const contact = new Contact();
    contact.phoneNumber = createContactDto.phoneNumber;
    contact.email = createContactDto.email;
    contact.address = createContactDto.address;
    contact.postalCode = createContactDto.postalCode

    return this.contactsRepository.save(contact);
  }

  findAll(): Promise<Contact[]> {
    return this.contactsRepository.find();
  }

  findOne(id: number): Promise<Contact> {
    return this.contactsRepository.findOneBy({ id });
  }

  async update(id: number, updateContactDto: UpdateContactDto) {
    const contact = await this.findOne(id);
    contact.phoneNumber = updateContactDto.phoneNumber;
    contact.email = updateContactDto.email;
    contact.address = updateContactDto.address;
    contact.postalCode = updateContactDto.postalCode

    return this.contactsRepository.save(contact);
  }

  async remove(id: number): Promise<void> {
    await this.contactsRepository.delete(id);
  }

  async findByPhoneNumber(phoneNumber: string) {
    return this.contactsRepository.findOneBy({
      phoneNumber: phoneNumber
    });
  }
}

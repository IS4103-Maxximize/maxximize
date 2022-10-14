import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MailService } from '../mail/mail.service';
import { CreateOrganisationDto } from '../organisations/dto/create-organisation.dto';
import { OrganisationsService } from '../organisations/organisations.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsernameAlreadyExistsException } from '../users/exceptions/UsernameAlreadyExistsException';
import { UsersService } from '../users/users.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { Application } from './entities/application.entity';
import { ApplicationStatus } from './enums/applicationStatus.enum';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectRepository(Application)
    private readonly applicationRepository: Repository<Application>,
    private organisationService: OrganisationsService,
    private usersService: UsersService,
    private mailService: MailService
  ){}
  async create(createApplicationDto: CreateApplicationDto) {
    const {createOrganisationDto, createUserDto} = createApplicationDto
    const {name, type, uen, contact} = createOrganisationDto
    const {firstName, lastName, username, role, contact: userContact} = createUserDto
    const organisations = await this.organisationService.findAll()
    if (organisations.map(org => org.uen).includes(uen)) {
      throw new NotFoundException('The organisation you are applying for is already registered!')
    }
    //check if username is unique
    const user = await this.usersService.findByUsername(createUserDto.username);
    if (user != null) {
      throw new UsernameAlreadyExistsException(
        'Username: ' + createUserDto.username + ' already exists!'
      );
    }
   
    if (userContact.email === contact.email) {
      throw new NotFoundException(
        "user and organisation email cannot be the same!"
      );
    }
    const newApplication = this.applicationRepository.create({
      organisationName: name,
      organisationType: type,
      uen: uen,
      orgPhoneNumber: contact.phoneNumber,
      orgEmail: contact.email,
      orgAddress: contact.address,
      orgPostalCode: contact.postalCode,
      applicantFirstName: firstName,
      applicantLastName: lastName,
      applicantUsername: username,
      role: role,
      applicantEmail: userContact.email,
      applicantAddress: userContact.address,
      applicantPhoneNumber: userContact.phoneNumber,
      applicantPostalCode: userContact.postalCode,
      organisationId: 1,
      status: ApplicationStatus.PENDING
    })
    return this.applicationRepository.save(newApplication)
  }

  findAll() {
    return this.applicationRepository.find({
      relations: {
        documents: true
      }
    })
  }

  async findOne(id: number) {
    try {
      return await this.applicationRepository.findOne({
        where: {
          id
        },
        relations: {
          documents: true
        }
      })
    } catch (error) {
      throw new NotFoundException(`application with id: ${id} cannot be found`)
    }
  }

  async update(id: number, updateApplicationDto: UpdateApplicationDto) {
    const application = await this.findOne(id)
    const {organisationName, 
      organisationType, 
      uen, 
      orgPhoneNumber,
      orgEmail, 
      orgPostalCode, 
      orgAddress, 
      applicantFirstName,
      applicantLastName,
      applicantUsername,
      role,
      applicantAddress,
      applicantPhoneNumber,
      applicantPostalCode, 
      applicantEmail } = application
    //update status
    const { status } = updateApplicationDto
    // Approved
    if (application.status === 'pending' && status === 'approved') {
      //send email
      const createOrganisationDto: CreateOrganisationDto = {
        name: organisationName,
        type: organisationType,
        uen: uen,
        contact: {
          phoneNumber: orgPhoneNumber,
          email: orgEmail,
          postalCode: orgPostalCode,
          address: orgAddress
        }
      }
      const createUserDto: CreateUserDto = {
        firstName: applicantFirstName,
        lastName: applicantLastName,
        username: applicantUsername,
        role: role,
        contact: {
          phoneNumber: applicantPhoneNumber,
          email: applicantEmail,
          postalCode: applicantPostalCode,
          address: applicantAddress
        }
      }

      await this.organisationService.registerOrganisationAndUser(createOrganisationDto, createUserDto)
      application.status = ApplicationStatus.APPROVED
      return this.applicationRepository.save(application)
    }
    
    //Rejected
    if (application.status === 'pending' && status === 'rejected') {
      //send Email
      try {
        await this.mailService.sendRejectedApplicationEmail(applicantEmail, organisationName, id, applicantFirstName )
      } catch (err) {
        throw new InternalServerErrorException(
          'Something went wrong with sending the email...'
        );
      }
      application.status = ApplicationStatus.REJECTED
      return this.applicationRepository.save(application)
    }
  }

  async remove(id: number) {
    const applicationToRemove = await this.findOne(id)
    return this.applicationRepository.remove(applicationToRemove)
  }
}

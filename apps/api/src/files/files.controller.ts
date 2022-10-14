import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFiles, Res, UsePipes, ValidationPipe, Query, StreamableFile  } from '@nestjs/common';
import { FilesService } from './files.service';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { diskStorage } from 'multer'
import { FilesInterceptor } from '@nestjs/platform-express';
import { v4 as uuidv4 } from 'uuid';
import { extname, join } from 'path';
import { UploadFileDto } from './dto/upload-file.dto';
import { createReadStream } from 'fs';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post()
  create(@Body() createFileDto: CreateFileDto) {
    return this.filesService.create(createFileDto);
  }

  @Post('/upload')
  @UsePipes(new ValidationPipe( {transform: true}))
  @UseInterceptors(FilesInterceptor('files', 10, {
    storage: diskStorage({
      destination: 'uploads',
      filename: (req, file, callback) => {
        const name = file.originalname.substring(0, file.originalname.lastIndexOf('.')) || file.originalname;
        const ext = extname(file.originalname)
        const uuid = uuidv4()
        const fileName = `${name}-${uuid}${ext}`
        callback(null, fileName)
      }
    })
  }))
  uploadFile(@UploadedFiles() files: Express.Multer.File[], @Query() dto: UploadFileDto) {
    return this.filesService.uploadAndCreateFiles(files, dto.type, dto.organisationId, dto.applicationId)
  }

  @Get('download/:id')
  	  async downloadUploadedFile(@Param('id') id: string, @Res({passthrough: true}) res) {
      const { path, fileType, fileName } = await this.filesService.download(+id)
      const file = createReadStream(join(process.cwd(), path));
      switch(fileType) {
        case ".pdf":
          res.set({
          'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename=${fileName}`,
          });
          break
       case ".jpg":
          res.set({
            'Content-Type': 'image/jpg',
            'Content-Disposition': `attachment; filename=${fileName}`,
          })
          break
  	    }
  	    
  	    return new StreamableFile(file)
  	  }
  

  @Get()
  findAll() {
    return this.filesService.findAll();
  }

  @Get('orgId/:id')
  findAllByOrg(@Param('id') id: string) {
    return this.filesService.findAllByOrg(+id)
  }

  @Get('appId/:id')
  findAllByApplication(@Param('id') id: string) {
    return this.filesService.findAllByApplication(+id)
  }


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.filesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFileDto: UpdateFileDto) {
    return this.filesService.update(+id, updateFileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.filesService.remove(+id);
  }
}

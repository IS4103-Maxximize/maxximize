import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFiles, Res } from '@nestjs/common';
import { FilesService } from './files.service';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { diskStorage } from 'multer'
import { FilesInterceptor } from '@nestjs/platform-express';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post()
  create(@Body() createFileDto: CreateFileDto) {
    return this.filesService.create(createFileDto);
  }

  @Post('/upload/orgId/:id/type/:type')
  @UseInterceptors(FilesInterceptor('file', 10, {
    storage: diskStorage({
      destination: 'uploads',
      filename: (req, file, callback) => {
        const uuid = uuidv4()
        const ext = extname(file.originalname)
        const fileName = `${uuid}${ext}`
        callback(null, fileName)
      }
    })
  }))
  uploadFile(@UploadedFiles() files: Express.Multer.File[], @Param('id') id: string, @Param('type') type: string) {
    return this.filesService.createFilesWithType(files, +id, type)
  }

  @Get('download/:id')
  downloadUploadedFile(@Param('id') path: string, @Res() res) {
    return res.download(`uploads/${path}`)
  }

  @Get()
  findAll() {
    return this.filesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.filesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFileDto: UpdateFileDto) {
    return this.filesService.update(+id, updateFileDto);
  }

  @Delete(':id/path/:path')
  remove(@Param('id') id: string, @Param('path') path: string) {
    return this.filesService.remove(+id, `uploads/${path}`);
  }
}

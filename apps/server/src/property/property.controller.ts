import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFiles,
  Patch,
  Param,
  Get,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { PropertyService } from './property.service';
import { Property } from './entities/property.entity';
import { ImageService } from './image.service';
import { CreatePropertyDto, UpdatePropertyDto } from './dto';
import { ObjectIdValidationPipe } from 'src/common/pipes/object-id-validation.pipe';
import { PropertyParamsDto } from './dto/property-params.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage } from 'mongoose';

@ApiTags('property')
@Controller('property')
export class PropertyController {
  constructor(
    private readonly imageService: ImageService,
    private readonly propertyService: PropertyService,
    @InjectModel(Property.name) private propertyModel: Model<Property>
  ) {}

  @ApiOperation({ summary: 'Find all properties' })
  @ApiResponse({ status: 200, description: 'Returns all properties success' })
  @ApiResponse({ status: 404, description: 'No properties found' })
  @Get()
  async findAll(@Query() filterQuery: PropertyParamsDto) {
    if (filterQuery.sortByRating) {
      return await this.propertyService.findAllWithAverageRating(filterQuery);
    }
    return await this.propertyService.findAll(filterQuery);
  }

  @ApiOperation({ summary: 'Find all properties for the authenticated user' })
  @ApiResponse({
    status: 200,
    description: 'Returns all properties belonging to the authenticated user',
  })
  @ApiResponse({
    status: 404,
    description: 'No properties found for the specified user',
  })
  @Get('user/properties')
  @UseGuards(AuthGuard('jwt'))
  async findAllByUserId(@GetUser() user: User) {
    return await this.propertyService.findAllByUserId(user.id);
  }

  @ApiOperation({ summary: 'Find a property by id' })
  @ApiResponse({ status: 200, description: 'Returns a property success' })
  @ApiResponse({ status: 404, description: 'No property found' })
  @Get(':id')
  async find(
    @Param('id', ObjectIdValidationPipe) propertyId: string,
  ): Promise<Property> {
    return this.propertyService.findOneById(propertyId);
  }

  @ApiOperation({ summary: 'Register a new property' })
  @ApiResponse({ status: 200, description: 'Register property success' })
  @ApiResponse({ status: 404, description: 'Property not created' })
  @Post('register')
  @UseGuards(AuthGuard('jwt'))
  async create(
    @Body() createPropertyDto: CreatePropertyDto,
    @GetUser() userId: User,
  ): Promise<Property> {
    const propertyData = {
      ...createPropertyDto,
      userId: userId.id,
    };
    return this.propertyService.create(propertyData, userId);
  }

  @ApiOperation({ summary: 'Delete property by id' })
  @ApiResponse({ status: 200, description: 'Deleted property success' })
  @Delete('delete/:id')
  @UseGuards(AuthGuard('jwt'))
  async remove(@Param('id', ObjectIdValidationPipe) id: string) {
    return this.propertyService.remove(id);
  }

  @ApiOperation({ summary: 'Patch property by id' })
  @ApiResponse({ status: 200, description: 'Patched property success' })
  @ApiResponse({ status: 404, description: 'Property not patched' })
  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  async update(
    @Param('id', ObjectIdValidationPipe) propertyId: string,
    @Body() updatePropertyDto: UpdatePropertyDto,
  ): Promise<Property> {
    return this.propertyService.update(propertyId, updatePropertyDto);
  }

  @ApiOperation({ summary: 'Get all unique cities from properties' })
  @ApiResponse({
    status: 200,
    description: 'Returns array of unique cities',
    type: [String],
  })
  @Get('cities/unique')
  async getUniqueCities(): Promise<string[]> {
    return this.propertyService.getUniqueCities();
  }

  @ApiOperation({ summary: 'DEBUG - Test rating aggregation' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns test data for rating aggregation' 
  })
  @Get('debug/rating-test')
  async debugRatingTest() {
    return this.propertyService.debugRatingTest();
  }
}
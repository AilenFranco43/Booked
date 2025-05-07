import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('reviews')
@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @ApiOperation({ summary: 'Create a new review' })
  @ApiResponse({ status: 201, description: 'Review created successfully' })
  @ApiResponse({ status: 400, description: 'Review could not be created' })
  @Post('create')
  async create(@Body() createReviewDto: CreateReviewDto) {
    return this.reviewService.create(createReviewDto);
  }

  @ApiOperation({ summary: 'Get all reviews' })
  @ApiResponse({ status: 200, description: 'Returns all reviews' })
  @ApiResponse({ status: 404, description: 'No reviews found' })
  @Get('all')
  async findAll() {
    return this.reviewService.findAll();
  }

  @ApiOperation({ summary: 'Get a review by id' })
  @ApiResponse({ status: 200, description: 'Returns a review' })
  @ApiResponse({ status: 404, description: 'Review not found' })
  @Get('review/:id')
  async findOne(@Param('id') id: string) {
    return this.reviewService.findOne(id);
  }

  @ApiOperation({ summary: 'Get reviews by property ID' })
  @ApiResponse({ status: 200, description: 'Returns reviews for the property' })
  @ApiResponse({ status: 404, description: 'No reviews found for this property' })
  @Get('property/:propertyId')
  async findByProperty(@Param('propertyId') propertyId: string) {
    return this.reviewService.findByProperty(propertyId);
  }


  @ApiOperation({ summary: 'Update a review' })
  @ApiResponse({ status: 200, description: 'Review updated successfully' })
  @ApiResponse({ status: 400, description: 'Review not actualized' })
  @Patch('patch/:id')
  async update(
    @Param('id') id: string,
    @Body() updateReviewDto: UpdateReviewDto,
  ) {
    return this.reviewService.update(id, updateReviewDto);
  }

  @ApiOperation({ summary: 'Delete a review' })
  @ApiResponse({ status: 200, description: 'Deleted review successfully' })
  @ApiResponse({ status: 404, description: 'Review not deleted' })
  @Delete('delete/:id')
  async remove(@Param('id') id: string) {
    return this.reviewService.remove(id);
  }
}

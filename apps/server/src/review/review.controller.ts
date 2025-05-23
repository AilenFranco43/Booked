import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('reviews')
@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post('create')
  @ApiOperation({ summary: 'Create a new review' })
  @ApiResponse({ status: 201, description: 'Review created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid data' })
  @ApiResponse({ status: 404, description: 'Property or User not found' })
  async create(@Body() createReviewDto: CreateReviewDto) {
    return this.reviewService.create(createReviewDto);
  }

  @Get('all')
  @ApiOperation({ summary: 'Get all reviews' })
  @ApiResponse({ status: 200, description: 'List of all reviews' })
  async findAll() {
    return this.reviewService.findAll();
  }

  @Get('review/:id')
  @ApiOperation({ summary: 'Get review by ID' })
  @ApiResponse({ status: 200, description: 'Review details' })
  @ApiResponse({ status: 404, description: 'Review not found' })
  async findOne(@Param('id') id: string) {
    return this.reviewService.findOne(id);
  }

  @Get('property/:propertyId')
  @ApiOperation({ summary: 'Get reviews by property ID' })
  @ApiResponse({ status: 200, description: 'Reviews for property' })
  @ApiResponse({ status: 404, description: 'No reviews found' })
  async findByProperty(@Param('propertyId') propertyId: string) {
    return this.reviewService.findByProperty(propertyId);
  }

  @Patch('update/:id')
  @ApiOperation({ summary: 'Update a review' })
  @ApiResponse({ status: 200, description: 'Updated review' })
  @ApiResponse({ status: 404, description: 'Review not found' })
  async update(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto) {
    return this.reviewService.update(id, updateReviewDto);
  }

  @Delete('delete/:id')
  @ApiOperation({ summary: 'Delete a review' })
  @ApiResponse({ status: 200, description: 'Deleted review' })
  @ApiResponse({ status: 404, description: 'Review not found' })
  async remove(@Param('id') id: string) {
    return this.reviewService.remove(id);
  }

  @Post('migrate-data')
  @ApiOperation({ summary: '[ADMIN] Migrate review data' })
  async migrateData() {
    return this.reviewService.migrateData();
  }
}
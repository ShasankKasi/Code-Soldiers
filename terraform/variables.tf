############################
# General
############################
variable "project_name" {
  description = "Project name prefix for resources"
  type        = string
}

variable "aws_region" {
  description = "AWS region to deploy resources"
  type        = string
}

variable "default_tags" {
  description = "Default tags applied to all resources"
  type        = map(string)
  default     = {}
}

############################
# Frontend
############################
variable "frontend_bucket_name" {
  description = "Name of the S3 bucket for frontend hosting"
  type        = string
}

variable "frontend_index_document" {
  description = "Index document for S3 website hosting"
  type        = string
  default     = "index.html"
}

variable "frontend_error_document" {
  description = "Error document for S3 website hosting"
  type        = string
  default     = "index.html"
}

variable "enable_cloudfront" {
  description = "Whether to create CloudFront distribution"
  type        = bool
  default     = true
}

############################
# Backend
############################
variable "eb_app_name" {
  description = "Elastic Beanstalk application name"
  type        = string
}

variable "eb_app_description" {
  description = "Elastic Beanstalk application description"
  type        = string
  default     = "Backend application (Docker)"
}

variable "eb_env_name" {
  description = "Elastic Beanstalk environment name"
  type        = string
}

variable "eb_instance_profile" {
  description = "IAM instance profile for Beanstalk EC2 instances"
  type        = string
  default     = "aws-elasticbeanstalk-ec2-role"
}

variable "eb_platform_arn" {
  description = "Elastic Beanstalk platform ARN for Docker"
  type        = string
  default     = "arn:aws:elasticbeanstalk:ap-south-1::platform/Docker running on 64bit Amazon Linux 2/4.3.0"
}
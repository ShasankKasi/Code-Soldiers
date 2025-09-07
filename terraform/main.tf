############################
# FRONTEND - S3 Hosting
############################
resource "aws_s3_bucket" "frontend" {
  bucket = var.frontend_bucket_name

  tags = merge(
    var.default_tags,
    {
      Name = "${var.project_name}-frontend-bucket"
    }
  )
}

# Website configuration
resource "aws_s3_bucket_website_configuration" "frontend" {
  bucket = aws_s3_bucket.frontend.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "index.html"
  }
}

# Public read access
resource "aws_s3_bucket_public_access_block" "frontend" {
  bucket = aws_s3_bucket.frontend.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_policy" "frontend_policy" {
  bucket = aws_s3_bucket.frontend.id
  depends_on = [aws_s3_bucket_public_access_block.frontend]

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect    = "Allow"
        Principal = "*"
        Action    = ["s3:GetObject"]
        Resource  = "${aws_s3_bucket.frontend.arn}/*"
      }
    ]
  })
}

############################
# CLOUDFRONT (optional)
############################
resource "aws_cloudfront_distribution" "frontend_cdn" {
  count = var.enable_cloudfront ? 1 : 0

  origin {
    domain_name = aws_s3_bucket.frontend.bucket_regional_domain_name
    origin_id   = "s3-${var.project_name}-frontend"
  }

  enabled             = true
  default_root_object = var.frontend_index_document

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "s3-${var.project_name}-frontend"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }

  tags = merge(
    var.default_tags,
    {
      Name = "${var.project_name}-frontend-cdn"
    }
  )
}

############################
# BACKEND - Elastic Beanstalk
############################
resource "aws_elastic_beanstalk_application" "backend_app" {
  name        = var.eb_app_name
  description = var.eb_app_description

  tags = var.default_tags
}

# Default VPC and subnets (if you don't have custom VPC)
data "aws_vpc" "default" {
  default = true
}

data "aws_subnets" "default" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }
}
# Add these settings to your Elastic Beanstalk environment for better cost control

resource "aws_elastic_beanstalk_environment" "backend_env" {
  name         = var.eb_env_name
  application  = aws_elastic_beanstalk_application.backend_app.name
  platform_arn = var.eb_platform_arn

  # Essential settings
  setting {
    namespace = "aws:autoscaling:launchconfiguration"
    name      = "IamInstanceProfile"
    value     = var.eb_instance_profile
  }

  setting {
    namespace = "aws:elasticbeanstalk:environment"
    name      = "ServiceRole"
    value     = "aws-elasticbeanstalk-service-role"
  }

  # VPC settings
  setting {
    namespace = "aws:ec2:vpc"
    name      = "VPCId"
    value     = data.aws_vpc.default.id
  }

  setting {
    namespace = "aws:ec2:vpc"
    name      = "Subnets"
    value     = join(",", data.aws_subnets.default.ids)
  }

  # COST CONTROL: Force t3.micro (free tier eligible)
  setting {
    namespace = "aws:autoscaling:launchconfiguration"
    name      = "InstanceType"
    value     = "t3.micro"
  }

  # COST CONTROL: Single instance (no auto-scaling)
  setting {
    namespace = "aws:autoscaling:asg"
    name      = "MinSize"
    value     = "1"
  }

  setting {
    namespace = "aws:autoscaling:asg"
    name      = "MaxSize"
    value     = "1"
  }

  # COST CONTROL: Use GP2 storage (free tier eligible)
  setting {
    namespace = "aws:autoscaling:launchconfiguration"
    name      = "RootVolumeType"
    value     = "gp2"
  }

  setting {
    namespace = "aws:autoscaling:launchconfiguration"
    name      = "RootVolumeSize"
    value     = "8"  # 8GB is within free tier (30GB EBS free)
  }

  # Security group
  setting {
    namespace = "aws:autoscaling:launchconfiguration"
    name      = "SecurityGroups"
    value     = aws_security_group.eb_instance.id
  }

  # Health check settings
  setting {
    namespace = "aws:elasticbeanstalk:healthreporting:system"
    name      = "SystemType"
    value     = "enhanced"
  }

  # COST CONTROL: Disable monitoring (CloudWatch detailed monitoring costs extra)
  setting {
    namespace = "aws:autoscaling:launchconfiguration"
    name      = "MonitoringInterval"
    value     = "5 minute"  # Basic monitoring is free
  }

  # Environment variable
  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "PORT"
    value     = "80"
  }

  depends_on = [
    aws_iam_instance_profile.eb_ec2_profile,
    aws_iam_role.eb_service_role
  ]

  tags = merge(
    var.default_tags,
    {
      Name = "${var.project_name}-backend-env"
      CostCenter = "FreeTier"
    }
  )
}
# Security group for EB instances
resource "aws_security_group" "eb_instance" {
  name_prefix = "${var.project_name}-eb-instance-"
  vpc_id      = data.aws_vpc.default.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = merge(
    var.default_tags,
    {
      Name = "${var.project_name}-eb-instance-sg"
    }
  )
}
import type { AWS } from "@serverless/typescript";

const serverlessConfiguration: AWS = {
  service: "deploycloudfront",
  frameworkVersion: "3",
  plugins: ["serverless-s3-sync"],
  provider: {
    name: "aws",
    runtime: "nodejs20.x",
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
    },
  },
  // import the function via paths
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ["aws-sdk"],
      target: "node14",
      define: { "require.resolve": undefined },
      platform: "node",
      concurrency: 10,
    },
    bucketName: "angular-deploy-bucket-2000",
    s3Sync: [
      {
        bucketName: "${self:custom.bucketName}",
        localDir: "dist/app-cognito/browser",
      },
    ],
  },
  resources: {
    Resources: {
      DeployAngularBucket: {
        Type: "AWS::S3::Bucket",
        Properties: {
          BucketName: "${self:custom.bucketName}",
          WebsiteConfiguration: {
            IndexDocument: "index.html",
            ErrorDocument: "index.html",
          },
          PublicAccessBlockConfiguration: {
            BlockPublicAcls: false,
          },
          OwnershipControls: {
            Rules: [
              {
                ObjectOwnership: "ObjectWriter",
              },
            ],
          },
        },
      },
      S3AccessPolicy: {
        Type: "AWS::S3::BucketPolicy",
        Properties: {
          Bucket: "${self:custom.bucketName}",
          PolicyDocument: {
            Statement: [
              {
                Effect: "Allow",
                Principal: "*",
                Action: "s3:GetObject",
                Resource: {
                  "Fn::Join": [
                    "",
                    ["arn:aws:s3:::", "${self:custom.bucketName}", "/*"],
                  ],
                },
              },
            ],
          },
        },
      },
      CloudFrontDistribution: {
        Type: "AWS::CloudFront::Distribution",
        Properties: {
          DistributionConfig: {
            Origins: [
              {
                DomainName: {
                  "Fn::GetAtt": ["DeployAngularBucket", "RegionalDomainName"],
                },
                Id: "${self:custom.bucketName}",
                CustomOriginConfig: {
                  HTTPPort: 80,
                  HTTPSPort: 443,
                  OriginProtocolPolicy: "https-only",
                },
              },
            ],
            Enabled: true,
            DefaultRootObject: "index.html",
            CustomErrorResponses: [
              {
                ErrorCode: 403,
                ResponseCode: 200,
                ResponsePagePath: "/index.html",
              },
              {
                ErrorCode: 404,
                ResponseCode: 200,
                ResponsePagePath: "/index.html",
              },
            ],
            DefaultCacheBehavior: {
              AllowedMethods: [
                "GET",
                "HEAD",
                "OPTIONS",
                "PUT",
                "POST",
                "PATCH",
                "DELETE",
              ],
              TargetOriginId: "${self:custom.bucketName}",
              ForwardedValues: {
                QueryString: false,
                Cookies: {
                  Forward: "none",
                },
              },
              ViewerProtocolPolicy: "redirect-to-https",
              MinTTL: 0,
              DefaultTTL: 86400,
              MaxTTL: 31536000,
            },
            ViewerCertificate: {
              CloudFrontDefaultCertificate: true,
            },
          },
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;

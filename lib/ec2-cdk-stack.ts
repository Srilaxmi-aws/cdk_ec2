import * as cdk from 'aws-cdk-lib';
import { Stack, StackProps, CfnOutput } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

export class Ec2CdkStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // ✅ Create VPC
    const vpc = new ec2.Vpc(this, 'MyVpc', {
      maxAzs: 2
    });

    // ✅ Create Security Group
    const securityGroup = new ec2.SecurityGroup(this, 'MySecurityGroup', {
      vpc,
      allowAllOutbound: true,
    });

    // Allow SSH (port 22)
    securityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(22),
      'Allow SSH'
    );

    // Allow HTTP (port 80)
    securityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(80),
      'Allow HTTP'
    );

    // ✅ Create EC2 Instance
    const instance = new ec2.Instance(this, 'MyEC2Instance', {
      vpc,
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T3,
        ec2.InstanceSize.MICRO
      ),
      machineImage: ec2.MachineImage.latestAmazonLinux(),
      securityGroup: securityGroup,
      keyName: 'cdk_ec2_key', // 
    });

    // ✅ Install Nginx automatically
    instance.addUserData(
      '#!/bin/bash',
      'yum update -y',
      'yum install -y nginx',
      'systemctl start nginx',
      'systemctl enable nginx'
    );

    // ✅ Outputs
    new CfnOutput(this, 'InstancePublicIP', {
      value: instance.instancePublicIp,
    });

    new CfnOutput(this, 'InstancePublicDNS', {
      value: instance.instancePublicDnsName,
    });
  }
}
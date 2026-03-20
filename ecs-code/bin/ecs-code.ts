#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { CdkEc2Stack } from '../lib/ecs-code-stack';

const app = new cdk.App();

new CdkEc2Stack(app, 'CdkEc2Stack');

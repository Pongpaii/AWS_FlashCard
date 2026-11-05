# AWS service icons

One SVG per service id in `src/data/awsServices.ts`, named `<id>.svg`.

Source: the official [AWS Architecture Icons](https://aws.amazon.com/architecture/icons/),
taken from the `aws-icons` npm package (v3.3.0, `icons/architecture-service`).
Services that have no icon of their own use their AWS category icon
(`icons/category`): qldb, security-groups, nacls, nat-gateway, service-quotas,
appstream, workspaces-secure-browser, sct, free-tier, pricing-calculator,
consolidated-billing, spot-instances.

The icons belong to Amazon Web Services and are used under the AWS icon terms
of use. When adding a service, add its icon here with the same id.

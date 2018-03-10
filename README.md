[![Build Status](https://circleci.com/gh/automatelife/UE-Product_Srvc.svg?&style=shield&circle-token=f98d02672f8424ccca8f825cd413f24d83b20477 "Build Status")](https://circleci.com/gh/automatelife/UE-Product_Srvc)

# UE-Product_Srvc
This micro-service allows users to define and track specific products to which domains, users and licenses will be attributed. The service allows for purchase, payment (via stripe) and validation of licenses.  This repository is intended to be open source and will be made public when operational.

## Local Development

Bring up a local dev environment:
```docker-compose up```

Making changes and need to rebuild:
```docker-compose up -d --no-deps --build ueproductsrv```

## Live
### QA
https://productqa.unitedeffects.com

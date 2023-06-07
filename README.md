
# Arosa-je API

The Arosa-je API is intended for particle-to-particle plant management.

## Badges

![](https://img.shields.io/badge/release-v2.0.5-blue)
![](https://img.shields.io/badge/Swagger-valid-green)
![](https://img.shields.io/badge/Tests-31%20passed%2C%202%20failed-orange)
![](https://img.shields.io/badge/Coverage-81%20%25-green)
## API Reference

#### Signup

```http
  POST /api/signup
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `user` | `schemas.UserCreate` | **Required**. Your user object |

#### Login

```http
  POST /api/login/
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `user`      | `schemas.UserLogin` | **Required**. Your user object. |

#### Get a specific user

```http
  GET /api/users/${user_id}/
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `user_id`      | `integer` | **Required**. The user id. |

#### Update my profile

```http
  PUT /api/users/me
```

#### Get a specific plant

```http
  GET /api/plants/${plant_id}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `plant_id`      | `integer` | **Required**. The plant id. |

#### Search a plant by name

```http
  GET /api/plants/search/{plant_name}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `plant_name`      | `string` | **Required**. The plant name. |

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`DATABASE_URL`

`SECRET_KEY`
`ALGORITHM`

`POSTGRES_USER`
`POSTGRES_PASSWORD`
`POSTGRES_DB`

## Running Tests

To run tests in local, run the following commands

#### Pytest

```bash
  python -m pytest
```

#### Coverage

```bash
  coverage run -m pytest --profile
```

```bash
  coverage html
```
Execute at folder root

#### Locust

```bash
  locust
```
requires to have a locustfile.py file

```bash
  locust --config=.locust.conf
```
## Tech Stack

**Client:** Python, Angular

**Server:** AWS, EC2


## Authors

- [@Alexis-Looten](https://github.com/Alexis-Looten)
- [@boutillier-paul](https://github.com/boutillier-paul)
- [@McLouffy](https://github.com/McLouffy) (MAKHLOUFI Kévin)
- [@ViTj4](https://github.com/ViTj4) (RYCKEBUSCH Remi)
- [@JRedxs](https://github.com/JRedxs) (VANDEVELDE Enzo)

